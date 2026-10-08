import React from 'react';
import './FileUpload.scss';

const fmtSize = b => b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(1) + ' MB';
const matches = (f, accept) => !accept || accept.split(',').map(s => s.trim()).some(a =>
  a.startsWith('.') ? f.name.toLowerCase().endsWith(a.toLowerCase()) : a.endsWith('/*') ? (f.type || '').startsWith(a.slice(0, -1)) : f.type === a);
let ofFileId = 0;

function FileRow({ f, onRemove, disabled, fresh }) {
  const pct = f.progress;
  const busy = pct != null && pct < 100 && !f.error;
  return (
    <div role="listitem" className={'q-file-upload__row' + (fresh ? ' q-anim-rise' : '')} data-state={fresh ? 'open' : undefined}>
      <div className="q-file-upload__row-main">
        <span className="q-file-upload__file">
          <span className="q-file-upload__name">{f.name}</span>
          <span className={'q-file-upload__meta' + (f.error ? ' q-file-upload__meta--error' : '')}>
            {f.size != null ? fmtSize(f.size) : ''}{' \u00b7 '}{f.error || (busy ? 'Uploading ' + Math.round(pct) + '%' : 'Ready')}
          </span>
        </span>
        {!busy && !f.error && <span aria-hidden="true" className="q-file-upload__done">{'\u2713'}</span>}
        <button type="button" aria-label={'Remove ' + f.name} disabled={disabled} onClick={onRemove} className="q-file-upload__remove">{'\u00d7'}</button>
      </div>
      {busy && <span role="progressbar" aria-label={'Uploading ' + f.name} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} className="q-file-upload__progress" style={{ '--_progress': pct + '%' }}><span className="q-file-upload__progress-fill" /></span>}
    </div>
  );
}

export function FileUpload({ label, hint, accept, multiple = true, maxSize, maxFiles, disabled = false, variant = 'dropzone', defaultFiles = [], onChange, simulateUpload = false, buttonLabel = 'Choose files', className, style }) {
  const [files, setFiles] = React.useState(() => defaultFiles.map(f => ({ id: ++ofFileId, ...f })));
  const [drag, setDrag] = React.useState(false);
  const [note, setNote] = React.useState(null);
  const [said, setSaid] = React.useState(''); // polite announcement of adds, removals and errors
  const input = React.useRef(null);
  const zone = React.useRef(null);
  const list = React.useRef(null);
  const fresh = React.useRef(new Set()); // rows added after mount rise in; preloaded rows stay still
  const timers = React.useRef([]);
  const uid = React.useId();
  const labelId = uid + 'label', hintId = uid + 'hint';
  React.useEffect(() => () => timers.current.forEach(clearInterval), []);
  const update = fn => setFiles(prev => { const next = fn(prev); onChange && onChange(next); return next; });
  const add = list => {
    if (disabled) return;
    let incoming = Array.from(list);
    if (!multiple) incoming = incoming.slice(0, 1);
    const room = maxFiles ? Math.max(0, maxFiles - (multiple ? files.length : 0)) : Infinity;
    const limit = incoming.length > room ? 'Limit is ' + maxFiles + (maxFiles === 1 ? ' file.' : ' files.') : null;
    setNote(limit);
    const items = incoming.slice(0, room).map(f => ({
      id: ++ofFileId, name: f.name, size: f.size, file: f,
      error: !matches(f, accept) ? 'Type not accepted' : maxSize && f.size > maxSize ? 'Over ' + fmtSize(maxSize) + ' limit' : null,
      progress: simulateUpload ? 0 : undefined,
    }));
    items.forEach(i => fresh.current.add(i.id));
    setSaid([items.length ? 'Added ' + items.map(i => i.name + (i.error ? ' (' + i.error + ')' : '')).join(', ') + '.' : '', limit || ''].filter(Boolean).join(' '));
    update(prev => multiple ? [...prev, ...items] : items);
    if (simulateUpload) items.filter(i => !i.error).forEach(it => {
      const t = setInterval(() => update(prev => prev.map(p => {
        if (p.id !== it.id) return p;
        const n = Math.min(100, (p.progress || 0) + 8 + Math.random() * 12);
        if (n >= 100) clearInterval(t);
        return { ...p, progress: n };
      })), 220);
      timers.current.push(t);
    });
  };
  const remove = (f, i) => {
    update(prev => prev.filter(p => p.id !== f.id));
    setSaid('Removed ' + f.name + '.');
    // Keep keyboard focus in place: next row's remove button, else the previous one, else the picker.
    requestAnimationFrame(() => { const b = list.current ? list.current.querySelectorAll('button[aria-label^="Remove"]') : []; (b[i] || b[i - 1] || zone.current) && (b[i] || b[i - 1] || zone.current).focus(); });
  };
  const hintText = hint ?? [accept && accept.split(',').map(s => s.trim().replace(/^\./, '').replace('/*', '')).join(', '), maxSize && 'up to ' + fmtSize(maxSize), maxFiles && 'max ' + maxFiles].filter(Boolean).join(' \u00b7 ');
  const hidden = <input ref={input} type="file" accept={accept} multiple={multiple} disabled={disabled} onChange={e => { add(e.target.files); e.target.value = ''; }} className="q-file-upload__input" />;
  const cls = ['q-file-upload', disabled && 'q-file-upload--disabled', className].filter(Boolean).join(' ');
  return (
    <div role="group" aria-labelledby={label ? labelId : undefined} className={cls} style={style}>
      {label && <span id={labelId} className="q-file-upload__label">{label}</span>}
      <span className="q-sr-only" aria-live="polite">{said}</span>
      {variant === 'button' ? (
        <div className="q-file-upload__bar">
          {hidden}
          <button ref={zone} type="button" disabled={disabled} aria-describedby={hintText ? hintId : undefined} onClick={() => input.current.click()} className="q-file-upload__button">
            <span aria-hidden="true">{'\u2191'}</span>{buttonLabel}
          </button>
          {hintText && <span id={hintId} className="q-file-upload__hint">{hintText}</span>}
        </div>
      ) : (
        <div ref={zone} role="button" tabIndex={disabled ? -1 : 0} aria-disabled={disabled || undefined} aria-label={'Choose ' + (multiple ? 'files' : 'a file') + ' or drop ' + (multiple ? 'them' : 'it') + ' here'} aria-describedby={hintText ? hintId : undefined}
          onClick={() => !disabled && input.current.click()} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), !disabled && input.current.click())}
          onDragOver={e => { e.preventDefault(); !disabled && setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files); }}
          className="q-file-upload__zone" data-dragging={drag || undefined}>
          {hidden}
          <span aria-hidden="true" className="q-file-upload__zone-icon">{'\u2191'}</span>
          <span className="q-file-upload__zone-text">{drag ? 'Release to add' : <>Drop {multiple ? 'files' : 'a file'} here or <span className="q-file-upload__browse">browse</span></>}</span>
          {hintText && <span id={hintId} className="q-file-upload__hint">{hintText}</span>}
        </div>
      )}
      {note && <span className="q-file-upload__note">{note}</span>}
      {files.length > 0 && <div ref={list} role="list" aria-label="Files" className="q-file-upload__list">
        {files.map((f, i) => <FileRow key={f.id} f={f} disabled={disabled} fresh={fresh.current.has(f.id)} onRemove={() => remove(f, i)} />)}
      </div>}
    </div>
  );
}
