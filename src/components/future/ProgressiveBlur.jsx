import React from 'react';
import './ProgressiveBlur.scss';

const EDGE = { top: 'to top', bottom: 'to bottom', left: 'to left', right: 'to right' };

// One backdrop blur faded by a mask only fades a fixed blur in; stacking bands of rising blur makes
// the strength itself ramp toward the edge. Each band's mask is a window one band wide, overlapping
// its neighbours so the steps don't show.
function bands(edge, mode, layers, start) {
  const count = mode === 'masked' ? 1 : Math.max(1, Math.round(layers));
  const span = (100 - start) / count;
  return Array.from({ length: count }, (_, i) => {
    const last = i === count - 1;
    const mask = mode === 'masked'
      ? `linear-gradient(${edge}, transparent ${start}%, black 100%)`
      : `linear-gradient(${edge}, transparent ${start + (i - 1) * span}%, black ${start + i * span}%, black ${last ? 100 : start + (i + 1) * span}%, ${last ? 'black 100%' : `transparent ${start + (i + 2) * span}%`})`;
    // Quadratic, not the usual doubling: doubling leaves the first bands of an 8-band stack under
    // 1px, so the blur would only show right at the edge.
    return { '--_step': ((i + 1) / count) ** 2, '--_mask': mask };
  });
}

export function ProgressiveBlur({ direction = 'bottom', maxBlur, layers = 8, start = 35, mode = 'progressive', children, className, style, ref, ...rest }) {
  const cls = ['q-progressive-blur', className].filter(Boolean).join(' ');
  const vars = maxBlur == null ? style : { '--q-progressive-blur-max': maxBlur + 'px', ...style };
  return (
    <div ref={ref} className={cls} data-direction={direction} data-mode={mode} style={vars} {...rest}>
      {children}
      <div className="q-progressive-blur__stack" aria-hidden="true">
        {bands(EDGE[direction] ?? EDGE.bottom, mode, layers, start).map((v, i) => <div key={i} className="q-progressive-blur__band" style={v} />)}
      </div>
    </div>
  );
}
