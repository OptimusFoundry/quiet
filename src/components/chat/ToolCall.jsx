import React from 'react';
import { Spinner } from '../core/Spinner';
import './ToolCall.scss';

const fmtDuration = d => {
  if (d == null || d === '') return null;
  if (typeof d === 'string') return d;
  return d < 1000 ? Math.round(d) + 'ms' : (d / 1000).toFixed(d < 10000 ? 1 : 0) + 's';
};

const STATUS_TEXT = { running: 'running', done: 'done', error: 'failed' };

// A step Claude took inside a reply — a tool call or a thinking pass — folded to one line:
// what, its state and how long. Open it to see the input and output in mono.
export function ToolCall({ name, kind = 'tool', status = 'done', duration, summary, input, output, children,
  open: openProp, defaultOpen = false, onOpenChange, className, style }) {
  const [inner, setInner] = React.useState(defaultOpen);
  const open = openProp ?? inner;
  const uid = React.useId();
  const toggle = () => { const next = !open; if (openProp === undefined) setInner(next); onOpenChange && onOpenChange(next); };
  const time = fmtDuration(duration);
  const hasDetail = input != null || output != null || children != null;
  const text = v => (typeof v === 'string' ? v : JSON.stringify(v, null, 2));
  const verb = kind === 'thinking' ? 'Thinking' : name;

  const cls = ['q-tool-call', 'q-tool-call--' + status, kind === 'thinking' && 'q-tool-call--thinking', className].filter(Boolean).join(' ');
  return (
    <div className={cls} style={style}>
      <button type="button" className="q-tool-call__header" aria-expanded={hasDetail ? open : undefined}
        aria-controls={hasDetail ? uid + 'p' : undefined} disabled={!hasDetail} onClick={toggle}>
        <span aria-hidden="true" className="q-tool-call__state">
          {status === 'running' ? <Spinner size={12} tone="muted" label={null} /> : <span className="q-tool-call__dot" />}
        </span>
        <span className="q-tool-call__name">{verb}</span>
        {summary && <span className="q-tool-call__summary">{summary}</span>}
        <span className="q-sr-only">{', ' + STATUS_TEXT[status]}</span>
        <span className="q-tool-call__meta">{status === 'error' ? 'failed' : time}</span>
        {hasDetail && <span aria-hidden="true" className="q-tool-call__chevron">{'›'}</span>}
      </button>
      {hasDetail && (
        <div id={uid + 'p'} role="region" aria-label={verb + ' details'} inert={!open} className="q-collapse" data-open={open}>
          <div className="q-collapse-inner">
            <div className="q-tool-call__detail">
              {input != null && (
                <div className="q-tool-call__block">
                  <span className="q-tool-call__label">Input</span>
                  <pre className="q-tool-call__code">{text(input)}</pre>
                </div>
              )}
              {output != null && (
                <div className="q-tool-call__block">
                  <span className="q-tool-call__label">{status === 'error' ? 'Error' : 'Output'}</span>
                  <pre className="q-tool-call__code">{text(output)}</pre>
                </div>
              )}
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
