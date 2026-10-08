import React from 'react';

const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
const SIZES = { sm: { d: 24, fs: 10, t: 13 }, md: { d: 32, fs: 11, t: 15 }, lg: { d: 40, fs: 13, t: 17 } };

export function StepIndicator({ steps = [], current = 0, orientation = 'horizontal', size = 'md', numerals = 'roman', onStepClick, style }) {
  const sz = SIZES[size] || SIZES.md;
  const vert = orientation === 'vertical';
  return (
    <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: vert ? 'column' : 'row', gap: vert ? 0 : 16, ...style }}>
      {steps.map((s, i) => {
        const st = s.status || (i < current ? 'complete' : i === current ? 'current' : 'upcoming');
        const click = onStepClick && st === 'complete';
        const ring = st === 'error' ? 'var(--molten)' : st === 'upcoming' ? 'var(--rule-soft)' : 'var(--ink)';
        const glyph = st === 'complete' ? '\u2713' : st === 'error' ? '!' : numerals === 'roman' ? ROMAN[i] : String(i + 1).padStart(2, '0');
        const last = i === steps.length - 1;
        const lineColor = i < current ? 'var(--ink)' : 'var(--rule-soft)';
        return (
          <li key={i} aria-current={st === 'current' ? 'step' : undefined}
            style={{ flex: vert ? 'none' : 1, display: 'flex', flexDirection: vert ? 'row' : 'column', gap: vert ? 16 : 12, minWidth: 0 }}>
            <div style={{ display: 'flex', flexDirection: vert ? 'column' : 'row', alignItems: 'center', gap: 8 }}>
              <button type="button" disabled={!click} onClick={() => click && onStepClick(i)}
                style={{ width: sz.d, height: sz.d, flex: 'none', borderRadius: 999, boxSizing: 'border-box', padding: 0, border: '1px solid ' + ring,
                  background: st === 'complete' ? 'var(--ink)' : 'var(--paper)', color: st === 'complete' ? 'var(--paper)' : st === 'error' ? 'var(--molten)' : st === 'upcoming' ? 'var(--muted-2)' : 'var(--ink)',
                  fontFamily: 'var(--font-mono)', fontSize: sz.fs, lineHeight: 1, cursor: click ? 'pointer' : 'default', transition: 'background var(--dur-hover) var(--ease-soft)' }}>{glyph}</button>
              {!last && <span aria-hidden="true" style={vert ? { width: 0, flex: 1, minHeight: 24, borderLeft: '1px solid ' + lineColor } : { height: 0, flex: 1, borderTop: '1px solid ' + lineColor }} />}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingBottom: vert && !last ? 24 : 0, paddingTop: vert ? (sz.d - sz.t * 1.4) / 2 : 0, minWidth: 0 }}>
              <span style={{ fontSize: sz.t, fontWeight: st === 'current' ? 600 : 400, color: st === 'upcoming' ? 'var(--muted)' : st === 'error' ? 'var(--molten)' : 'var(--ink)', lineHeight: 1.4 }}>{s.label}</span>
              {s.description && <span style={{ fontSize: 13, lineHeight: 1.45, color: 'var(--muted)' }}>{s.description}</span>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
