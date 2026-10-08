import React from 'react';

if (typeof document !== 'undefined' && !document.getElementById('of-kf-pt')) {
  const s = document.createElement('style'); s.id = 'of-kf-pt';
  s.textContent = '@media (prefers-reduced-motion: no-preference){@keyframes of-pt-fade{from{opacity:0}to{opacity:1}}@keyframes of-pt-slide{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:none}}@keyframes of-pt-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}@keyframes of-pt-scale{from{opacity:0;transform:scale(.98)}to{opacity:1;transform:none}}}';
  document.head.appendChild(s);
}
const NAMES = { fade: 'of-pt-fade', slide: 'of-pt-slide', slideUp: 'of-pt-up', scale: 'of-pt-scale' };

export function PageTransition({ transitionKey, variant = 'fade', duration = 400, children, style }) {
  // quiet: the outgoing view fades out (--dur-exit) before the new one enters; reduced motion swaps instantly.
  const last = React.useRef({ key: transitionKey, children });
  const [cur, setCur] = React.useState(transitionKey);
  const leaving = cur !== transitionKey;
  if (!leaving) last.current = { key: transitionKey, children };
  React.useEffect(() => {
    if (!leaving) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = setTimeout(() => setCur(transitionKey), reduce ? 0 : 160);
    return () => clearTimeout(t);
  }, [transitionKey, leaving]);
  if (leaving) return <div key={last.current.key} className="q-anim-fade" data-state="closing" aria-hidden="true" style={style}>{last.current.children}</div>;
  return <div key={transitionKey} style={{ animation: NAMES[variant] + ' ' + duration + 'ms var(--ease-forge) both', ...style }}>{children}</div>;
}
