import React from 'react';
import './ButtonGroup.scss';

const SPACING = ['sm', 'md', 'lg'];

export function ButtonGroup({ children, attached = false, vertical = false, spacing = 'sm', fullWidth = false, label, className, style, ...rest }) {
  const custom = !SPACING.includes(spacing);
  const cls = ['q-button-group', !custom && 'q-button-group--' + spacing, vertical && 'q-button-group--vertical',
    attached && 'q-button-group--attached', fullWidth && 'q-button-group--full', className].filter(Boolean).join(' ');
  const gap = custom ? { '--_gap': typeof spacing === 'number' ? spacing + 'px' : spacing } : null;
  return (
    <div role="group" aria-label={label} {...rest} className={cls} style={gap ? { ...gap, ...style } : style}>
      {children}
    </div>
  );
}
