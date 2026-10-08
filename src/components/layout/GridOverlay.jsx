import React from 'react';

export function GridOverlay({ visible, defaultVisible = false, columns = 12, maxWidth = 'var(--grid-max)', gutter = 'var(--grid-gutter)', padding = 'var(--space-page-x)', hotkey = true, rhythm = true, offsetLeft = 0 }) {
  const [inner, setInner] = React.useState(defaultVisible);
  const on = visible ?? inner;
  React.useEffect(() => {
    if (!hotkey) return;
    const k = e => { const t = e.target; if (t && t.closest && t.closest('input,textarea,select,[contenteditable=""],[contenteditable="true"]')) return; if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') { e.preventDefault(); setInner(v => !v); } };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, [hotkey]);
  if (!on) return null;
  return (
    <div aria-hidden="true" style={{ position: 'fixed', top: 0, bottom: 0, left: offsetLeft, right: 0, pointerEvents: 'none', zIndex: 9999,
      backgroundImage: rhythm ? 'repeating-linear-gradient(to bottom, rgba(11,11,12,0.05) 0 1px, transparent 1px 8px)' : 'none' }}>
      <div style={{ maxWidth, height: '100%', margin: '0 auto', padding: '0 ' + padding, boxSizing: 'border-box', display: 'grid', gridTemplateColumns: 'repeat(' + columns + ', minmax(0, 1fr))', columnGap: gutter }}>
        {Array.from({ length: columns }, (_, i) => <span key={i} style={{ background: 'rgba(224,83,26,0.06)', borderLeft: '1px solid rgba(224,83,26,0.25)', borderRight: '1px solid rgba(224,83,26,0.25)' }} />)}
      </div>
    </div>
  );
}
