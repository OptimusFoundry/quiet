import React from 'react';
import { motionToken } from '../../a11y/hooks';
import { Table } from '../data/Table';
import './StreamingTable.scss';

// A live table that never moves under your hand. New rows (newest first) arrive at the top, unless
// you've paused, scrolled down or put focus inside the table — then they wait behind a
// "N new" bar and come in all at once when you ask. Arrivals are announced politely, in batches.
export function StreamingTable({ rows = [], columns = [], rowKey = 'id', paused, defaultPaused = false, onPausedChange,
  maxRows, maxHeight, caption, label, size, liveLabel = 'Live', pausedLabel = 'Paused', pauseLabel = 'Pause', resumeLabel = 'Resume',
  newLabel = n => 'Show ' + n + ' new', announceEvery = 2000, className, style }) {
  const keyOf = React.useCallback((r, i) => (typeof rowKey === 'function' ? rowKey(r) : r[rowKey] ?? i), [rowKey]);
  const [innerPaused, setInnerPaused] = React.useState(defaultPaused);
  const isPaused = paused ?? innerPaused;
  const [shown, setShown] = React.useState(rows);
  const [focused, setFocused] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [said, setSaid] = React.useState('');
  const holding = isPaused || focused || scrolled;
  const scroller = React.useRef(null);
  const fresh = React.useRef(0); // rows let in by the last update, highlighted once
  const queue = React.useRef({ shown: 0, held: 0, timer: null });

  const shownKeys = new Set(shown.map(keyOf));
  const waiting = rows.filter((r, i) => !shownKeys.has(keyOf(r, i))).length;

  // Batch announcements: at most one every `announceEvery` ms, so a busy stream isn't a busy screen reader.
  const announce = React.useCallback((kind, n) => {
    const q = queue.current;
    q[kind] += n;
    if (q.timer) return;
    const flush = () => {
      const parts = [];
      if (q.shown) parts.push(q.shown + (q.shown === 1 ? ' new row' : ' new rows'));
      if (q.held) parts.push(q.held + ' waiting');
      setSaid(parts.join(', '));
      q.shown = 0; q.held = 0; q.timer = null;
    };
    q.timer = setTimeout(flush, announceEvery);
  }, [announceEvery]);
  React.useEffect(() => () => clearTimeout(queue.current.timer), []);

  const letIn = React.useCallback(next => {
    setShown(prev => {
      const had = new Set(prev.map(keyOf));
      fresh.current = next.filter((r, i) => !had.has(keyOf(r, i))).length;
      return next;
    });
  }, [keyOf]);

  // New data: show it, or hold it.
  const lastRows = React.useRef(rows);
  React.useEffect(() => {
    if (lastRows.current === rows) return;
    const before = new Set(lastRows.current.map(keyOf));
    const added = rows.filter((r, i) => !before.has(keyOf(r, i))).length;
    lastRows.current = rows;
    if (holding) { if (added) announce('held', added); return; }
    letIn(rows);
    if (added) announce('shown', added);
  }, [rows, holding, keyOf, letIn, announce]);

  // Stopped reading (and not paused): what waited comes in.
  React.useEffect(() => { if (!holding && waiting) letIn(rows); }, [holding]);

  // The rows that just arrived glow softly once, then settle.
  React.useEffect(() => {
    const n = fresh.current;
    fresh.current = 0;
    const el = scroller.current;
    if (!n || !el || !el.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timing = { duration: motionToken(el, '--q-dur-expand'), easing: motionToken(el, '--q-ease-soft') };
    const glow = getComputedStyle(el).getPropertyValue('--q-streaming-table-fresh-bg').trim();
    [...el.querySelectorAll('tbody tr')].slice(0, n).forEach(tr =>
      tr.animate([{ opacity: 0, background: glow }, { opacity: 1, background: glow, offset: 0.4 }, { opacity: 1, background: 'transparent' }], { ...timing, duration: Number(timing.duration) * 4 }));
  }, [shown]);

  const setPaused = p => { setInnerPaused(p); onPausedChange && onPausedChange(p); };
  const showWaiting = () => { letIn(rows); setSaid(''); if (scroller.current) { scroller.current.scrollTop = 0; setScrolled(false); } };
  const visible = maxRows ? shown.slice(0, maxRows) : shown;
  const cls = ['q-streaming-table', className].filter(Boolean).join(' ');
  return (
    <div className={cls} data-paused={isPaused || undefined} style={style}>
      <div className="q-streaming-table__bar">
        <span className="q-streaming-table__state"><span aria-hidden="true" className="q-streaming-table__dot" />{isPaused ? pausedLabel : liveLabel}</span>
        <button type="button" aria-pressed={isPaused} onClick={() => setPaused(!isPaused)} className="q-streaming-table__toggle">
          {isPaused ? resumeLabel : pauseLabel}
        </button>
      </div>
      {waiting > 0 && (
        <button type="button" onClick={showWaiting} className="q-streaming-table__waiting q-anim-drop" data-state="open">
          <span aria-hidden="true" className="q-streaming-table__arrow">{'↑'}</span>{newLabel(waiting)}
        </button>
      )}
      <div ref={scroller} className="q-streaming-table__scroll"
        style={maxHeight != null ? { '--_max-height': typeof maxHeight === 'number' ? maxHeight + 'px' : maxHeight } : undefined}
        tabIndex={maxHeight != null ? 0 : undefined} role={maxHeight != null ? 'region' : undefined} aria-label={maxHeight != null ? label || 'Live rows' : undefined}
        onScroll={e => setScrolled(e.currentTarget.scrollTop > 4)}
        onFocus={() => setFocused(true)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }}>
        <Table columns={columns} data={visible} rowKey={rowKey} caption={caption} label={label} size={size} />
      </div>
      <span role="status" className="q-sr-only">{said}</span>
    </div>
  );
}
