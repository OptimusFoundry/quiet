import React from 'react';
import { Button } from '../core/Button';
import { Attachment } from './Attachment';
import { accepts, formatBytes, toAttachment } from './chat-utils';
import './ChatComposer.scss';

// The message box. Text grows with what you type (up to `maxRows`); Enter sends, Shift+Enter is a
// new line, and nothing sends mid-IME-composition. Files arrive by the attach button, drag-and-drop
// onto the box, or pasting an image; they sit above the text as removable chips. While `busy` the
// send key becomes Stop. Sending is yours to wire: `onSubmit({ text, attachments })`.
export function ChatComposer({ value, defaultValue = '', onChange, attachments: attachmentsProp, defaultAttachments = [],
  onAttachmentsChange, onSubmit, onStop, busy = false, disabled = false, placeholder = 'Message Claude',
  label = 'Message', accept, maxFiles = 10, maxSize, maxRows = 10, progress, toolbar, hint, autoFocus,
  className, style }) {
  const [innerText, setInnerText] = React.useState(defaultValue);
  const [innerFiles, setInnerFiles] = React.useState(defaultAttachments);
  const text = value ?? innerText;
  const files = attachmentsProp ?? innerFiles;
  const [dragging, setDragging] = React.useState(false);
  const [notice, setNotice] = React.useState('');
  const area = React.useRef(null);
  const picker = React.useRef(null);
  const removeRefs = React.useRef([]);
  const refocus = React.useRef(null);
  const uid = React.useId();

  const setText = v => { if (value === undefined) setInnerText(v); onChange && onChange(v); };
  const setFiles = next => { if (attachmentsProp === undefined) setInnerFiles(next); onAttachmentsChange && onAttachmentsChange(next); };

  // Grow with the text: measure, then cap at maxRows (CSS max-height scrolls beyond it).
  React.useLayoutEffect(() => {
    const el = area.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, [text]);

  // After a chip is removed, focus the chip that took its place, else the previous one, else the text.
  React.useEffect(() => {
    if (refocus.current == null) return;
    const i = refocus.current;
    refocus.current = null;
    const target = removeRefs.current[Math.min(i, files.length - 1)];
    (target || area.current)?.focus();
  }, [files]);

  const add = list => {
    const incoming = [...(list || [])];
    if (!incoming.length) return;
    const ok = [];
    const rejected = [];
    for (const f of incoming) {
      if (files.length + ok.length >= maxFiles) rejected.push(f.name + ': only ' + maxFiles + ' files per message');
      else if (!accepts(f, accept)) rejected.push(f.name + ': this file type isn’t supported');
      else if (maxSize && f.size > maxSize) rejected.push(f.name + ': larger than ' + formatBytes(maxSize));
      else ok.push(toAttachment(f));
    }
    if (ok.length) setFiles([...files, ...ok]);
    const added = ok.length ? ok.length + (ok.length === 1 ? ' file attached.' : ' files attached.') : '';
    setNotice([added, rejected.length ? 'Not added — ' + rejected.join('; ') + '.' : ''].filter(Boolean).join(' '));
  };

  const remove = i => {
    const f = files[i];
    refocus.current = i;
    setFiles(files.filter((_, j) => j !== i));
    setNotice((f?.name || 'File') + ' removed.');
  };

  const pending = files.some(f => (f.status ?? (progress && progress[f.id] != null && progress[f.id] < 1 ? 'uploading' : 'done')) === 'uploading');
  const empty = !text.trim() && files.length === 0;
  const canSend = !disabled && !busy && !empty && !pending;

  const submit = () => {
    if (!canSend) return;
    onSubmit && onSubmit({ text: text.trim(), attachments: files });
    setText('');
    setFiles([]);
    setNotice('');
    area.current?.focus();
  };

  const onKeyDown = e => {
    if (e.key !== 'Enter' || e.shiftKey || e.nativeEvent.isComposing || e.keyCode === 229) return;
    e.preventDefault();
    submit();
  };

  const onPaste = e => {
    const pasted = [...(e.clipboardData?.files || [])];
    if (!pasted.length) return;
    e.preventDefault();
    add(pasted);
  };

  const hasFiles = e => [...(e.dataTransfer?.types || [])].includes('Files');
  const dropProps = disabled ? {} : {
    onDragEnter: e => { if (hasFiles(e)) { e.preventDefault(); setDragging(true); } },
    onDragOver: e => { if (hasFiles(e)) { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; } },
    onDragLeave: e => { if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false); },
    onDrop: e => { if (!hasFiles(e)) return; e.preventDefault(); setDragging(false); add(e.dataTransfer.files); },
  };

  const cls = ['q-chat-composer', dragging && 'q-chat-composer--dragging', disabled && 'q-chat-composer--disabled', className].filter(Boolean).join(' ');
  return (
    <form className={cls} style={{ '--_rows': maxRows, ...style }} aria-label={label}
      onSubmit={e => { e.preventDefault(); submit(); }} {...dropProps}>
      {files.length > 0 && (
        <ul className="q-chat-composer__files" aria-label="Attachments">
          {files.map((f, i) => {
            const p = f.progress ?? progress?.[f.id];
            const status = f.status ?? (p != null && p < 1 ? 'uploading' : 'done');
            return (
              <li key={f.id ?? i} className="q-chat-composer__file q-anim-rise" data-state="open">
                <Attachment file={f.file} name={f.name} size={f.size} type={f.type} src={f.src} status={status} progress={p}
                  error={f.error} onRemove={disabled ? undefined : () => remove(i)} removeRef={el => { removeRefs.current[i] = el; }} />
              </li>
            );
          })}
        </ul>
      )}
      <textarea ref={area} id={uid + 't'} className="q-chat-composer__input" rows={1} value={text} placeholder={placeholder}
        aria-label={label} aria-describedby={uid + 'k'} disabled={disabled} autoFocus={autoFocus}
        onChange={e => setText(e.target.value)} onKeyDown={onKeyDown} onPaste={onPaste} />
      <span id={uid + 'k'} className="q-sr-only">Enter to send, Shift+Enter for a new line.</span>
      <div className="q-chat-composer__toolbar">
        <Button variant="ghost" size="sm" className="q-chat-composer__attach" aria-label="Attach files" disabled={disabled}
          icon={<span aria-hidden="true" className="q-chat-composer__plus">+</span>} onClick={() => picker.current?.click()} />
        <input ref={picker} type="file" multiple accept={accept} tabIndex={-1} aria-hidden="true" className="q-chat-composer__picker"
          onChange={e => { add(e.target.files); e.target.value = ''; }} />
        {toolbar && <div className="q-chat-composer__slot">{toolbar}</div>}
        <span className="q-chat-composer__spacer" />
        {hint && <span className="q-chat-composer__hint">{hint}</span>}
        {busy
          ? <Button type="button" variant="secondary" size="sm" className="q-chat-composer__send" aria-label="Stop responding"
            icon={<span aria-hidden="true" className="q-chat-composer__stop" />} onClick={() => onStop && onStop()} />
          : <Button type="submit" variant="primary" size="sm" className="q-chat-composer__send" aria-label="Send message"
            disabled={!canSend} icon={<span aria-hidden="true">{'↑'}</span>} />}
      </div>
      {dragging && <div aria-hidden="true" className="q-chat-composer__drop q-anim-fade" data-state="open">Drop files to attach</div>}
      <span role="status" className="q-sr-only">{notice}</span>
    </form>
  );
}
