import React from 'react';
import './PageTransition.scss';

const VARIANTS = { fade: 'fade', slide: 'slide', slideUp: 'slide-up', scale: 'scale' };

export function PageTransition({ transitionKey, variant = 'fade', duration = 400, children, className, style }) {
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
  if (leaving) return <div key={last.current.key} className={['q-page-transition', 'q-anim-fade', className].filter(Boolean).join(' ')} data-state="closing" aria-hidden="true" style={style}>{last.current.children}</div>;
  const cls = ['q-page-transition', VARIANTS[variant] && 'q-page-transition--' + VARIANTS[variant], className].filter(Boolean).join(' ');
  return <div key={transitionKey} className={cls} style={{ ...(duration !== 400 && { '--_dur': duration + 'ms' }), ...style }}>{children}</div>;
}
