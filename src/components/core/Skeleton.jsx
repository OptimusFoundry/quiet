import React from 'react';
import './Skeleton.scss';

const VARIANTS = ['text', 'circular', 'rectangular', 'rounded'];
const len = v => (typeof v === 'number' ? v + 'px' : v);

export function Skeleton({ variant = 'text', width, height, lines = 1, gap, animate = true, label, loading = true, children, className, style }) {
  // Content that replaces a visible skeleton fades in; content that was never loading just renders.
  const wasLoading = React.useRef(loading);
  if (loading) wasLoading.current = true;
  if (!loading) {
    if (!wasLoading.current || !React.isValidElement(children)) return children ?? null;
    return React.cloneElement(children, { className: ['q-anim-fade', children.props.className].filter(Boolean).join(' '), 'data-state': 'open' });
  }
  const a11y = label ? { role: 'status', 'aria-busy': true, 'aria-label': label } : { 'aria-hidden': true };
  const still = !animate && 'q-skeleton--still';
  if (variant === 'text' && lines > 1) {
    const lineVars = height != null ? { '--_height': len(height) } : undefined;
    const groupVars = {};
    if (gap != null) groupVars['--_gap'] = len(gap);
    if (width != null) groupVars['--_width'] = len(width);
    return (
      <span {...a11y} className={['q-skeleton-group', className].filter(Boolean).join(' ')} style={{ ...groupVars, ...style }}>
        {Array.from({ length: lines }, (_, i) => <span key={i} className={['q-skeleton', 'q-skeleton--text', still].filter(Boolean).join(' ')} style={lineVars} />)}
      </span>
    );
  }
  const vars = {};
  if (width != null) vars['--_width'] = len(width);
  if (height != null) vars['--_height'] = len(height);
  const cls = ['q-skeleton', VARIANTS.includes(variant) && 'q-skeleton--' + variant, still, className].filter(Boolean).join(' ');
  return <span {...a11y} className={cls} style={{ ...vars, ...style }} />;
}
