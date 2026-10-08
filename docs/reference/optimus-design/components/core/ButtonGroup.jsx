import React from 'react';

export function ButtonGroup({ children, attached = false, vertical = false, spacing = 'sm', fullWidth = false, style }) {
  const gap = { sm: 8, md: 16, lg: 24 }[spacing] ?? spacing;
  const kids = React.Children.toArray(children).filter(Boolean);
  const items = kids.map((c, i) => {
    if (!React.isValidElement(c)) return c;
    const extra = {};
    if (fullWidth) extra.flex = 1;
    if (attached) {
      const sep = c.props.variant === 'primary' || c.props.variant == null ? 'rgba(255,255,255,0.24)' : 'var(--ink)';
      Object.assign(extra, { borderRadius: 0, border: 0 });
      if (i > 0) extra[vertical ? 'borderTop' : 'borderLeft'] = '1px solid ' + sep;
    }
    return React.cloneElement(c, { style: { ...(c.props.style || {}), ...extra } });
  });
  return (
    <div role="group" style={{ display: fullWidth ? 'flex' : 'inline-flex', flexDirection: vertical ? 'column' : 'row', gap: attached ? 0 : gap,
      ...(attached ? { border: '1px solid var(--ink)', borderRadius: vertical ? 'var(--radius-lg)' : 999, overflow: 'hidden' } : {}), ...style }}>
      {items}
    </div>
  );
}
