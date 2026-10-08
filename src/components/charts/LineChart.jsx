import React from 'react';
import { ChartLegend, ChartTable, ChartTooltip } from './ChartParts';
import { areaPath, formatNumber, linePath, linear, seriesColor, seriesDash, sparseIndices, useWidth, valueDomain } from './chart-utils';
import './LineChart.scss';

const PAD = { top: 8, right: 8, bottom: 22, left: 40 };

// Lines over a shared x axis. Series 1 is molten, comparisons ink then grey. A crosshair + tooltip
// follows the pointer; the plot is also a slider over the x points, so Left/Right (Home/End,
// PageUp/PageDown) move the same crosshair and the values are read out as the slider's value.
export function LineChart({
  series = [], labels = [], area = false, zero, height = 220, yTicks = 4, xTicks = 6,
  formatValue = formatNumber, formatLabel = l => l, reference, highlight, legend,
  title, 'aria-label': ariaLabel, className, style,
}) {
  const [ref, width] = useWidth();
  const [active, setActive] = React.useState(null);
  const n = Math.max(labels.length, ...series.map(s => s.data.length), 0);
  const name = ariaLabel ?? title ?? 'Line chart';
  const { ticks, domain } = valueDomain(series.flatMap(s => s.data).concat(reference ? [reference.value] : []), { zero: zero ?? area, count: yTicks });
  const plotW = Math.max(40, width - PAD.left - PAD.right);
  const plotH = Math.max(40, height - PAD.top - PAD.bottom);
  const x = linear([0, Math.max(1, n - 1)], [PAD.left, PAD.left + plotW]);
  const y = linear(domain, [PAD.top + plotH, PAD.top]);
  const base = y(Math.max(domain[0], Math.min(0, domain[1])));
  const label = i => formatLabel(labels[i] ?? String(i + 1), i);
  const color = (s, i) => s.color ?? seriesColor(i);
  const readout = i => series.map(s => `${s.name} ${formatValue(s.data[i])}`).join(', ');
  const showLegend = legend ?? series.length > 1;

  const fromPointer = e => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * width;
    setActive(Math.max(0, Math.min(n - 1, Math.round(((px - PAD.left) / plotW) * (n - 1)))));
  };
  const key = e => {
    const cur = active ?? n - 1;
    const page = Math.max(1, Math.round(n / 6));
    const to = { ArrowRight: cur + 1, ArrowUp: cur + 1, ArrowLeft: cur - 1, ArrowDown: cur - 1, PageUp: cur + page, PageDown: cur - page, Home: 0, End: n - 1 }[e.key];
    if (to == null || !n) return;
    e.preventDefault();
    setActive(Math.max(0, Math.min(n - 1, to)));
  };
  const focusIndex = active ?? n - 1;
  const hi = highlight;

  return (
    <figure className={['q-chart', 'q-line-chart', className].filter(Boolean).join(' ')} style={style}>
      {title && <figcaption className="q-line-chart__title">{title}</figcaption>}
      {showLegend && <ChartLegend kind="line" items={series.map((s, i) => ({ id: s.id, name: s.name, color: color(s, i) }))} />}
      <div ref={ref} className="q-chart__plot" tabIndex={n ? 0 : -1} role="slider" aria-label={name}
        aria-valuemin={0} aria-valuemax={Math.max(0, n - 1)} aria-valuenow={focusIndex}
        aria-valuetext={n ? `${label(focusIndex)}: ${readout(focusIndex)}` : 'No data'}
        onKeyDown={key} onFocus={() => setActive(a => a ?? n - 1)} onBlur={() => setActive(null)}
        onPointerMove={fromPointer} onPointerLeave={e => { if (document.activeElement !== e.currentTarget) setActive(null); }}>
        <svg className="q-chart__svg" width={width} height={height} aria-hidden="true">
          {hi?.range && (
            <rect className="q-line-chart__highlight" x={x(hi.range[0])} width={Math.max(2, x(hi.range[1]) - x(hi.range[0]))} y={PAD.top} height={plotH} />
          )}
          {ticks.map(t => (
            <g key={t}>
              <line className={t === 0 ? 'q-chart__baseline' : 'q-chart__grid'} x1={PAD.left} x2={PAD.left + plotW} y1={y(t)} y2={y(t)} />
              <text className="q-chart__axis-label q-chart__axis-label--end" x={PAD.left - 8} y={y(t)} dy="0.32em">{formatValue(t)}</text>
            </g>
          ))}
          {n > 0 && sparseIndices(n, Math.min(xTicks, Math.max(2, Math.floor(plotW / 64)))).map((i, k, arr) => (
            <text key={i} className={'q-chart__axis-label' + (k === arr.length - 1 && arr.length > 1 ? ' q-chart__axis-label--end' : k === 0 ? '' : ' q-chart__axis-label--middle')}
              x={x(i)} y={height - 6}>{label(i)}</text>
          ))}
          {reference && (
            <g className="q-line-chart__reference">
              <line x1={PAD.left} x2={PAD.left + plotW} y1={y(reference.value)} y2={y(reference.value)} />
              {reference.label && <text className="q-chart__axis-label q-chart__axis-label--end" x={PAD.left + plotW} y={y(reference.value) - 6}>{reference.label}</text>}
            </g>
          )}
          {series.map((s, i) => (s.area ?? (area && i === 0)) && (
            <path key={'a' + i} className="q-line-chart__area q-chart__fade" style={{ '--_color': color(s, i) }}
              d={areaPath(s.data.map((v, j) => [x(j), v == null ? null : y(v)]), base)} />
          ))}
          {series.map((s, i) => {
            const dashed = seriesDash(i) !== 'none';
            return (
              <path key={'l' + i} pathLength={dashed ? undefined : 1} className={'q-line-chart__line' + (dashed ? '' : ' q-chart__draw')}
                style={{ '--_color': color(s, i), '--_dash': dashed ? seriesDash(i) : undefined }}
                d={linePath(s.data.map((v, j) => [x(j), v == null ? null : y(v)]))} />
            );
          }).reverse()}
          {hi?.index != null && hi.index < n && (
            <g className="q-line-chart__mark">
              <line x1={x(hi.index)} x2={x(hi.index)} y1={PAD.top} y2={PAD.top + plotH} />
              {series[0] && series[0].data[hi.index] != null && <circle cx={x(hi.index)} cy={y(series[0].data[hi.index])} r={7} />}
            </g>
          )}
          {active != null && (
            <g className="q-line-chart__crosshair">
              <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={PAD.top + plotH} />
              {series.map((s, i) => s.data[active] != null && (
                <circle key={i} className="q-line-chart__dot" cx={x(active)} cy={y(s.data[active])} r={4} style={{ '--_color': color(s, i) }} />
              ))}
            </g>
          )}
        </svg>
        {active != null && (
          <ChartTooltip x={x(active)} y={PAD.top + 8} bounds={{ width }} title={label(active)}
            rows={series.map((s, i) => ({ id: s.id, name: s.name, value: formatValue(s.data[active]), color: color(s, i) }))} />
        )}
      </div>
      <ChartTable caption={name} columns={['Point', ...series.map(s => s.name)]}
        rows={Array.from({ length: n }, (_, i) => [label(i), ...series.map(s => formatValue(s.data[i]))])} />
    </figure>
  );
}
