import React from 'react';
import { Button } from '../core/Button';
import { FilterTabs } from '../data/FilterTabs';
import './BudgetLeash.scss';

const usd = v => '$' + (Number.isInteger(v) ? v : v.toFixed(2));
const SPEEDS = ['full speed', 'slowing', 'crawling', 'stopped at the leash'];

// Budget as a leash, not a hard stop. The slack line from the agent to the cap sags while there is
// room and pulls taut as it spends; the agent slows before it stops, and you can see the tension
// from across the room. Lengthen the leash with a preset or "Give slack".
export function BudgetLeash({ label, agent, spent = 0, cap, onCapChange, presets = [], slack, slackLabel = 'Give slack', slowAt = 0.6, crawlAt = 0.85, speeds = SPEEDS, atCap, format = usd, className, style }) {
  const pct = cap > 0 ? Math.min(1, Math.max(0, spent / cap)) : 0;
  const level = pct >= 1 ? 3 : pct >= crawlAt ? 2 : pct >= slowAt ? 1 : 0;
  const speed = speeds[level];
  const uid = React.useId();
  const sag = 20 + (1 - pct) * 34;
  const x = pct * 100;
  const cls = ['q-budget-leash', level >= 2 && 'q-budget-leash--taut', className].filter(Boolean).join(' ');
  return (
    <section aria-labelledby={uid + 'l'} className={cls} style={{ '--_pct': x + '%', ...style }}>
      <header className="q-budget-leash__header">
        <div className="q-budget-leash__who">
          {agent && <span aria-hidden="true" className="q-budget-leash__agent">{agent}</span>}
          <div className="q-budget-leash__heading">
            <span id={uid + 'l'} className="q-budget-leash__label">{label}</span>
            <span aria-hidden="true" className="q-budget-leash__speed">{speed}{level === 3 && atCap ? ' · ' + atCap : ''}</span>
          </div>
        </div>
        <span aria-hidden="true" className="q-budget-leash__amount">{format(spent)} <span className="q-budget-leash__cap">/ {format(cap)}</span></span>
      </header>
      <div role="meter" aria-labelledby={uid + 'l'} aria-valuemin={0} aria-valuemax={cap} aria-valuenow={Math.min(spent, cap)}
        aria-valuetext={format(spent) + ' of ' + format(cap) + ', ' + speed} className="q-budget-leash__track">
        <span className="q-budget-leash__rail" />
        <span className="q-budget-leash__fill" />
        <svg aria-hidden="true" viewBox="0 0 100 40" preserveAspectRatio="none" className="q-budget-leash__line">
          <path d={'M ' + x + ' 20 Q ' + (x + 100) / 2 + ' ' + sag + ' 100 20'} vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="q-budget-leash__stake" />
        <span className="q-budget-leash__runner" />
      </div>
      {(presets.length > 0 || (slack && onCapChange)) && (
        <div className="q-budget-leash__controls">
          {presets.length > 0 && (
            <div className="q-budget-leash__presets">
              <span aria-hidden="true" className="q-budget-leash__presets-label">Leash</span>
              <FilterTabs size="sm" label="Leash length" showCounts={false} value={String(cap)}
                items={presets.map(p => ({ value: String(p), label: format(p) }))} onChange={v => onCapChange && onCapChange(Number(v))} />
            </div>
          )}
          {slack && onCapChange && <Button size="sm" variant="ghost" onClick={() => onCapChange(cap + slack)}>{slackLabel} · +{format(slack)}</Button>}
        </div>
      )}
      <p role="status" className="q-sr-only">{level ? label + ': ' + speed + (level === 3 && atCap ? ', ' + atCap : '') : ''}</p>
    </section>
  );
}
