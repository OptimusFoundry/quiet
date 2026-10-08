import React from 'react';
import './LineageChip.scss';

const SIZES = ['sm', 'md'];

// A chip that sits on a number and says whether everything upstream of it is fresh. Pressing it
// unfolds the lineage — source tables, joins, the value itself — and marks which step is late.
export function LineageChip({ label, steps = [], freshness, summary, open, defaultOpen = false, onOpenChange, size = 'md', className, style }) {
  const [inner, setInner] = React.useState(defaultOpen);
  const cur = open ?? inner;
  const id = React.useId();
  const stale = steps.filter(s => s.stale);
  const text = summary ?? (stale.length
    ? (stale.length === 1 ? '1 source stale' : stale.length + ' sources stale') + (stale[0].detail ? ' · ' + stale[0].detail : '')
    : 'All sources fresh' + (freshness ? ' · ' + freshness : ''));
  const toggle = () => { setInner(!cur); onOpenChange && onOpenChange(!cur); };
  const cls = ['q-lineage-chip', 'q-lineage-chip--' + (SIZES.includes(size) ? size : 'md'), className].filter(Boolean).join(' ');
  return (
    <span className={cls} style={style} data-stale={stale.length > 0 || undefined}>
      <button type="button" className="q-lineage-chip__trigger" aria-expanded={cur} aria-controls={id} onClick={toggle}
        aria-label={label && typeof text === 'string' ? text + ', lineage of ' + label : undefined}>
        <span aria-hidden="true" className="q-lineage-chip__dot" />
        <span>{text}</span>
        <span aria-hidden="true" className="q-lineage-chip__chevron" />
      </button>
      <span className="q-lineage-chip__panel q-collapse" data-open={cur} id={id} inert={!cur}>
        <span className="q-collapse-inner">
          <ol className="q-lineage-chip__chain" aria-label={label ? 'Lineage of ' + label : 'Lineage'}>
            {steps.map((s, i) => (
              <li key={s.id ?? s.label} className="q-lineage-chip__step" data-stale={s.stale || undefined}>
                {i > 0 && <span aria-hidden="true" className="q-lineage-chip__arrow">{'→'}</span>}
                <span className="q-lineage-chip__node">
                  <span aria-hidden="true" className="q-lineage-chip__node-dot" />
                  <span className="q-lineage-chip__node-label">{s.label}{!s.detail && s.stale && <span className="q-sr-only">, stale</span>}</span>
                  {s.detail && <span className="q-lineage-chip__node-detail">{s.detail}{s.stale && <span className="q-sr-only">, stale</span>}</span>}
                </span>
              </li>
            ))}
          </ol>
        </span>
      </span>
    </span>
  );
}
