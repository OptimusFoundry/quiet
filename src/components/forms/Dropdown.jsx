import React from 'react';
import { useMergedRef, usePresence } from '../../a11y/hooks';
import { FormValue } from '../../a11y/form';
import './Dropdown.scss';

const SIZES = ['sm', 'md', 'lg'];
const norm = o => typeof o === 'string' ? { value: o, label: o } : o;
const text = o => typeof o.label === 'string' || typeof o.label === 'number' ? String(o.label) : String(o.value ?? '');

export function Dropdown({ label, options = [], value, defaultValue, onChange, placeholder = 'Select', size = 'md', variant = 'default', fullWidth = false, align = 'start', disabled = false, helperText, error, name, required, form, ref: forwardedRef, className, style }) {
  const [open, setOpen] = React.useState(false);
  const [inner, setInner] = React.useState(defaultValue);
  const [active, setActive] = React.useState(-1);
  const ref = React.useRef(null);
  const trigger = React.useRef(null);
  const triggerRef = useMergedRef(trigger, forwardedRef);
  const typed = React.useRef({ s: '', t: 0 });
  const uid = React.useId();
  const listId = uid + 'list', labelId = uid + 'label', hintId = uid + 'hint', optId = i => uid + 'opt' + i;
  const presence = usePresence(open);
  const cur = value ?? inner;
  const opts = options.map(norm);
  const sel = opts.find(o => !o.divider && o.value === cur);
  React.useEffect(() => {
    if (!open) return;
    const h = e => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, [open]);
  React.useEffect(() => {
    if (!open || active < 0) return;
    const el = document.getElementById(optId(active)); el && el.scrollIntoView && el.scrollIntoView({ block: 'nearest' });
  }, [open, active]);
  const pick = o => { if (o.disabled) return; setInner(o.value); onChange && onChange(o.value); setOpen(false); };
  const en = () => opts.map((o, i) => (!o.divider && !o.disabled ? i : -1)).filter(i => i >= 0);
  const show = to => { const sel = en(); const s = opts.findIndex(o => !o.divider && !o.disabled && o.value === cur); setActive(to ?? (s >= 0 ? s : sel[0] ?? -1)); setOpen(true); };
  // Type-ahead: printable keys jump to the next option whose label starts with what was typed.
  const ahead = e => {
    if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
    const now = Date.now(), t = typed.current;
    t.s = now - t.t > 500 ? e.key.toLowerCase() : t.s + e.key.toLowerCase(); t.t = now;
    const sel = en(), from = Math.max(0, sel.indexOf(active) + (t.s.length === 1 ? 1 : 0));
    const hit = [...sel.slice(from), ...sel.slice(0, from)].find(i => text(opts[i]).toLowerCase().startsWith(t.s));
    if (hit == null) return;
    e.preventDefault(); if (open) setActive(hit); else show(hit);
  };
  const key = e => {
    const sel = en(), k = e.key;
    if (!open) {
      if (k === 'ArrowDown' || k === 'ArrowUp' || k === 'Enter' || k === ' ') { e.preventDefault(); show(); }
      else if (k === 'Home' || k === 'End') { e.preventDefault(); show(k === 'Home' ? sel[0] : sel[sel.length - 1]); }
      else ahead(e);
      return;
    }
    if (k === 'Escape') { e.preventDefault(); e.stopPropagation(); setOpen(false); }
    else if (k === 'Tab') setOpen(false);
    else if (k === 'ArrowDown' || k === 'ArrowUp') {
      e.preventDefault();
      const p = sel.indexOf(active); const n = k === 'ArrowDown' ? sel[Math.min(sel.length - 1, p + 1)] : sel[Math.max(0, p - 1)];
      setActive(n ?? sel[0]);
    } else if (k === 'Home' || k === 'End') { e.preventDefault(); setActive(k === 'Home' ? sel[0] : sel[sel.length - 1]); }
    else if (k === 'Enter' || (k === ' ' && Date.now() - typed.current.t > 500)) { e.preventDefault(); if (active >= 0) pick(opts[active]); else setOpen(false); }
    else ahead(e);
  };
  const cls = ['q-dropdown', 'q-dropdown--' + (SIZES.includes(size) ? size : 'md'), variant === 'filled' && 'q-dropdown--filled', fullWidth && 'q-dropdown--full',
    error && 'q-dropdown--invalid', disabled && 'q-dropdown--disabled', className].filter(Boolean).join(' ');
  return (
    <div ref={ref} className={cls} style={style}>
      {label && <span id={labelId} className="q-dropdown__label">{label}</span>}
      <button ref={triggerRef} type="button" disabled={disabled} role="combobox" aria-required={required || undefined} aria-haspopup="listbox" aria-expanded={open} aria-controls={presence.mounted || open ? listId : undefined}
        aria-activedescendant={open && active >= 0 ? optId(active) : undefined} aria-labelledby={label ? labelId : undefined} aria-label={label ? undefined : placeholder}
        aria-describedby={error || helperText ? hintId : undefined} aria-invalid={error ? true : undefined}
        onClick={() => (open ? setOpen(false) : show())} onKeyDown={key} className={'q-dropdown__trigger' + (sel ? '' : ' q-dropdown__trigger--placeholder')}>
        {sel && sel.icon && <span className="q-dropdown__icon">{sel.icon}</span>}
        <span className="q-dropdown__value">{sel ? sel.label : placeholder}</span>
        <span aria-hidden="true" className="q-dropdown__chevron">{'\u2193'}</span>
      </button>
      {(open || presence.mounted) && <div id={listId} role="listbox" aria-labelledby={label ? labelId : undefined} className={'q-dropdown__list q-anim-drop' + (align === 'end' ? ' q-dropdown__list--end' : '')} data-state={open ? 'open' : presence.state}
        onMouseDown={e => e.preventDefault()}>
        {opts.map((o, i) => o.divider
          ? <div key={'d' + i} className="q-dropdown__divider" />
          : <div key={o.value} id={optId(i)} role="option" aria-selected={o.value === cur} aria-disabled={o.disabled || undefined} data-active={active === i || undefined} onMouseEnter={() => setActive(i)} onClick={() => pick(o)}
              className="q-dropdown__option">
              {o.icon && <span className="q-dropdown__option-icon">{o.icon}</span>}
              <span className="q-dropdown__option-text">
                <span>{o.label}</span>
                {o.description && <span className="q-dropdown__option-description">{o.description}</span>}
              </span>
              <span aria-hidden="true" className="q-dropdown__check">{o.value === cur ? '\u2713' : ''}</span>
            </div>)}
      </div>}
      {(error || helperText) && <span id={hintId} className={'q-dropdown__hint' + (error ? ' q-dropdown__hint--error' : '')}>{error || helperText}</span>}
      <FormValue name={name} value={cur ?? ''} required={required} disabled={disabled} form={form} focusTarget={() => trigger.current} />
    </div>
  );
}
