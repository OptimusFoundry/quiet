import React from 'react';
import './Wordmark.scss';

const SIZES = { nav: 15, footer: 28 };

export function Wordmark({ size = 'nav', className, style }) {
  const custom = typeof size === 'number';
  const cls = ['q-wordmark', custom ? 'q-wordmark--custom' : SIZES[size] && 'q-wordmark--' + size, className].filter(Boolean).join(' ');
  return (
    <span className={cls} style={custom ? { '--_size': size + 'px', ...style } : style}>
      Optimus Foundry<span className="q-wordmark__period">.</span>
    </span>
  );
}
