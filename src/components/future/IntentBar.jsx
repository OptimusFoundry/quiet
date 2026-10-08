import React from 'react';
import { Button } from '../core/Button';
import { Skeleton } from '../core/Skeleton';
import { DropdownMenu } from '../overlays/DropdownMenu';
import './IntentBar.scss';

// Say what you want; the system shows how it understood it as editable chips before anything
// runs. The chips are the form, written for you. Reading the text is the caller's job: pass the
// interpretation back as `chips`, and set `status` while you work it out.
export function IntentBar({ value, defaultValue = '', onChange, onSubmit, status = 'idle', chips = [], onChipChange, summary, actions, suggestions = [], placeholder = 'Say what you want done', label = 'What do you want done?', submitLabel = 'Read', resubmitLabel = 'Re-read', className, style }) {
  const [inner, setInner] = React.useState(defaultValue);
  const text = value ?? inner;
  const uid = React.useId();
  const set = t => { setInner(t); onChange && onChange(t); };
  const submit = () => { if (text.trim() && status !== 'reading') onSubmit && onSubmit(text); };
  const read = status === 'read';
  const reading = status === 'reading';
  const said = read && chips.length ? 'Read as: ' + chips.map(c => c.label + ' ' + c.value).join(', ') : reading ? 'Reading…' : '';
  return (
    <div className={['q-intent-bar', className].filter(Boolean).join(' ')} data-status={status} style={style}>
      <form role="search" aria-label={label} className="q-intent-bar__field" onSubmit={e => { e.preventDefault(); submit(); }}>
        <span aria-hidden="true" className="q-intent-bar__mark" />
        <input value={text} onChange={e => set(e.target.value)} placeholder={placeholder} aria-label={label} aria-describedby={uid + 's'} className="q-intent-bar__input" />
        <Button type="submit" size="sm" variant={read ? 'secondary' : 'primary'} loading={reading} disabled={!text.trim()}>{read ? resubmitLabel : submitLabel}</Button>
      </form>
      <p id={uid + 's'} role="status" className="q-sr-only">{said}</p>
      {reading && (
        <div aria-hidden="true" className="q-intent-bar__chips">
          {[72, 128, 136, 80].map((w, i) => <Skeleton key={i} variant="rounded" width={w} height={30} />)}
        </div>
      )}
      {read && chips.length > 0 && <>
        <ul aria-label="How it was read" className="q-intent-bar__chips">
          {chips.map((c, i) => (
            <li key={c.key ?? i} className="q-intent-bar__chip-item" style={{ '--_i': i }}>
              {c.options && c.options.length > 1 ? (
                <DropdownMenu size="sm" label={c.label} width={220}
                  items={c.options.map(o => ({ label: o, checked: o === c.value, onSelect: () => onChipChange && onChipChange(c.key ?? i, o) }))}
                  trigger={<button type="button" className="q-intent-bar__chip">
                    <span className="q-intent-bar__chip-key">{c.label}</span>
                    <span className="q-intent-bar__chip-value">{c.value}</span>
                    <span aria-hidden="true" className="q-intent-bar__chip-caret" />
                  </button>} />
              ) : (
                <span className="q-intent-bar__chip q-intent-bar__chip--fixed">
                  <span className="q-intent-bar__chip-key">{c.label}</span>
                  <span className="q-intent-bar__chip-value">{c.value}</span>
                </span>
              )}
            </li>
          ))}
        </ul>
        {(summary || actions) && (
          <div className="q-intent-bar__footer">
            {summary && <span className="q-intent-bar__summary">{summary}</span>}
            {actions && <div className="q-intent-bar__actions">{actions}</div>}
          </div>
        )}
      </>}
      {status === 'idle' && suggestions.length > 0 && (
        <ul aria-label="Try" className="q-intent-bar__suggestions">
          {suggestions.map(s => (
            <li key={s}><button type="button" className="q-intent-bar__suggestion" onClick={() => set(s)}>{s}</button></li>
          ))}
        </ul>
      )}
    </div>
  );
}
