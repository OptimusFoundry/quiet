import React from 'react';
import './UncertaintyCell.scss';

const plain = v => (typeof v === 'number' ? v.toLocaleString('en-US') : String(v));

// A number that carries its doubt: a small track beside it, with the likely range shaded on a shared scale.
// Measured values (no range) are set heavier, so a forecast never looks like a count.
export function UncertaintyCell({ value, error, low, high, domain, format, showBand = true, describe, className, style }) {
  const lo = low ?? (error != null ? value - error : undefined);
  const hi = high ?? (error != null ? value + error : undefined);
  const uncertain = lo != null && hi != null && hi > lo;
  const fmt = format || plain;
  const [dMin, dMax] = domain || [Math.min(0, lo ?? value), Math.max(hi ?? value, value)];
  const at = v => (dMax === dMin ? 0 : Math.min(1, Math.max(0, (v - dMin) / (dMax - dMin))));
  // "±620" when the error is symmetric, otherwise the bounds.
  const range = error != null ? '±' + fmt(error) : fmt(lo) + '–' + fmt(hi);
  const spoken = uncertain
    ? (describe ? describe(value, lo, hi) : fmt(value) + ', likely between ' + fmt(lo) + ' and ' + fmt(hi))
    : fmt(value);
  const band = uncertain && showBand;
  const cls = ['q-uncertainty-cell', uncertain ? 'q-uncertainty-cell--uncertain' : 'q-uncertainty-cell--measured', className].filter(Boolean).join(' ');
  return (
    <span className={cls} style={band ? { '--_lo': at(lo), '--_hi': at(hi), '--_v': at(value), ...style } : style}>
      {band && <span aria-hidden="true" className="q-uncertainty-cell__track"><span className="q-uncertainty-cell__band" /><span className="q-uncertainty-cell__point" /></span>}
      <span aria-hidden="true" className="q-uncertainty-cell__value">
        {fmt(value)}
        {uncertain && <span className="q-uncertainty-cell__range">{range}</span>}
      </span>
      <span className="q-sr-only">{spoken}</span>
    </span>
  );
}
