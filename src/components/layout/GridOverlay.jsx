import React from 'react';
import './GridOverlay.scss';

const px = v => (typeof v === 'number' ? v + 'px' : v);

export function GridOverlay({ visible, defaultVisible = false, columns = 12, maxWidth, gutter, padding, hotkey = true, rhythm = true, offsetLeft = 0, className, style }) {
  const [inner, setInner] = React.useState(defaultVisible);
  const on = visible ?? inner;
  React.useEffect(() => {
    if (!hotkey) return;
    const k = e => { const t = e.target; if (t && t.closest && t.closest('input,textarea,select,[contenteditable=""],[contenteditable="true"]')) return; if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') { e.preventDefault(); setInner(v => !v); } };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, [hotkey]);
  if (!on) return null;
  const cls = ['q-grid-overlay', rhythm && 'q-grid-overlay--rhythm', className].filter(Boolean).join(' ');
  const vars = {
    '--_cols': columns,
    ...(offsetLeft && { '--_offset': px(offsetLeft) }),
    ...(maxWidth != null && { '--_max': px(maxWidth) }),
    ...(gutter != null && { '--_gutter': px(gutter) }),
    ...(padding != null && { '--_pad': px(padding) }),
  };
  return (
    <div aria-hidden="true" className={cls} style={{ ...vars, ...style }}>
      <div className="q-grid-overlay__columns">
        {Array.from({ length: columns }, (_, i) => <span key={i} className="q-grid-overlay__column" />)}
      </div>
    </div>
  );
}
