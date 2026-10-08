import React from 'react';

if (typeof document !== 'undefined' && !document.getElementById('of-kf-fade')) {
  const s = document.createElement('style'); s.id = 'of-kf-fade';
  s.textContent = '@media (prefers-reduced-motion: no-preference){@keyframes of-fade{from{opacity:0}to{opacity:1}}}';
  document.head.appendChild(s);
}
const SIZES = { sm: 440, md: 560, lg: 720, xl: 960 };
const ICONS = { info: ['i', 'var(--ink)'], success: ['\u2713', 'var(--ink)'], warning: ['!', 'var(--molten)'], error: ['!', 'var(--molten)'] };

export function Dialog({ open, onClose, eyebrow, title, accent, icon, children, actions, size, width, dismissible = true, showClose = true }) {
  React.useEffect(() => {
    if (!open || !dismissible) return;
    const k = e => e.key === 'Escape' && onClose && onClose();
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, [open, onClose, dismissible]);
  if (!open) return null;
  const ic = typeof icon === 'string' && ICONS[icon] ? ICONS[icon] : null;
  return (
    <div onClick={dismissible ? onClose : undefined} style={{ position: 'fixed', inset: 0, background: 'var(--overlay-scrim)', display: 'grid', placeItems: 'center', padding: 32, zIndex: 100, animation: 'of-fade 0.2s linear' }}>
      <div role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: width || SIZES[size] || 560, maxHeight: 'calc(100vh - 64px)', overflowY: 'auto', background: 'var(--paper)', border: '1px solid var(--rule-soft)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-3)', padding: 40, display: 'flex', flexDirection: 'column', gap: 24, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {icon && <span aria-hidden="true" style={{ width: 40, height: 40, borderRadius: 999, border: '1px solid ' + (ic ? ic[1] : 'var(--ink)'), display: 'grid', placeItems: 'center', fontSize: 17, fontWeight: 600, color: ic ? ic[1] : 'var(--ink)' }}>{ic ? ic[0] : icon}</span>}
            {eyebrow && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>{eyebrow}</div>}
            {title && <div style={{ fontWeight: 700, fontSize: 30, letterSpacing: '-0.035em', lineHeight: 1.05, color: 'var(--ink)' }}>
              {title}{accent && <> <em>{accent}</em></>}<span style={{ color: 'var(--molten)' }}>.</span></div>}
          </div>
          {showClose && dismissible && <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 0, cursor: 'pointer', fontSize: 20, lineHeight: 1, color: 'var(--ink)', padding: 4 }}>{'\u00d7'}</button>}
        </div>
        {children && <div style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--ink-2)' }}>{children}</div>}
        {actions && <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end', flexWrap: 'wrap', paddingTop: 24, borderTop: '1px solid var(--rule-soft)' }}>{actions}</div>}
      </div>
    </div>
  );
}
