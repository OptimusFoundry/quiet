import React from 'react';
import { Button } from '../core/Button';
import { Attachment } from './Attachment';
import { useCopy } from './chat-utils';
import './ChatMessage.scss';

const fmtTime = t => {
  if (t == null || t === '') return null;
  const d = t instanceof Date ? t : new Date(t);
  if (Number.isNaN(d.getTime())) return { text: String(t) };
  return { text: d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }), iso: d.toISOString() };
};

// The Claude mark: a molten asterisk on a quiet tile — the one bit of heat in a reply.
export function ClaudeMark({ size = 'md', className }) {
  return <span aria-hidden="true" className={['q-chat-message__mark', 'q-chat-message__mark--' + size, className].filter(Boolean).join(' ')}>{'✳'}</span>;
}

// One turn in a conversation. `from` is who said it — pass the API message's role straight through.
// A person's message is a soft bubble on the right; Claude's reply is
// plain prose under a small name row — no bubble. While `status="streaming"` a soft caret trails the
// text and assistive tech hears "Claude is responding" once, not every token.
export function ChatMessage({ from = 'assistant', name, avatar, children, attachments = [], status = 'done', error,
  onRetry, onEdit, actions, copyText: copyTextProp, showCopy, time, className, style }) {
  const isUser = from === 'user';
  const isSystem = from === 'system';
  const who = name ?? (isUser ? 'You' : 'Claude');
  const body = React.useRef(null);
  const [copyState, copy] = useCopy();
  const uid = React.useId();
  const stamp = fmtTime(time);
  const streaming = status === 'streaming';
  const failed = status === 'error';
  const canCopy = (showCopy ?? !isUser) && !streaming;

  if (isSystem) {
    return (
      <div role="note" className={['q-chat-message', 'q-chat-message--system', className].filter(Boolean).join(' ')} style={style}>
        {children}
      </div>
    );
  }

  const doCopy = () => copy(copyTextProp ?? body.current?.innerText ?? '');
  const files = attachments.length > 0 && (
    <ul className="q-chat-message__files" aria-label="Attachments">
      {attachments.map((a, i) => (
        <li key={a.id ?? i}>
          <Attachment variant="card" file={a.file} name={a.name} size={a.size} type={a.type} src={a.src} href={a.href}
            onOpen={a.onOpen} status={a.status} error={a.error} />
        </li>
      ))}
    </ul>
  );

  const toolbar = (canCopy || onRetry || onEdit || actions) && !streaming && (
    <div className="q-chat-message__actions">
      {canCopy && (
        <Button variant="ghost" size="sm" onClick={doCopy} aria-label={copyState === 'copied' ? 'Copied' : 'Copy message'}>
          {copyState === 'copied' ? 'Copied' : copyState === 'failed' ? 'Copy failed' : 'Copy'}
        </Button>
      )}
      {onRetry && <Button variant="ghost" size="sm" onClick={onRetry}>Retry</Button>}
      {onEdit && <Button variant="ghost" size="sm" onClick={onEdit}>Edit</Button>}
      {actions}
    </div>
  );

  const cls = ['q-chat-message', 'q-chat-message--' + (isUser ? 'user' : 'assistant'), streaming && 'q-chat-message--streaming',
    failed && 'q-chat-message--error', className].filter(Boolean).join(' ');
  return (
    <article className={cls} style={style} aria-labelledby={uid + 'n'}>
      {isUser ? (
        <h3 id={uid + 'n'} className="q-sr-only">{who + ' said'}</h3>
      ) : (
        <header className="q-chat-message__header">
          {avatar ?? <ClaudeMark />}
          <h3 id={uid + 'n'} className="q-chat-message__name">{who}</h3>
          {stamp && <time className="q-chat-message__time" dateTime={stamp.iso}>{stamp.text}</time>}
        </header>
      )}
      {files}
      {(children != null || streaming) && (
        <div ref={body} className="q-chat-message__body" aria-busy={streaming || undefined}>
          {children}
          {streaming && <span aria-hidden="true" className="q-chat-message__caret" />}
        </div>
      )}
      {failed && (
        <p className="q-chat-message__error">
          <span aria-hidden="true" className="q-chat-message__error-dot" />
          {error || 'Something went wrong before Claude finished.'}
        </p>
      )}
      {isUser && stamp && <time className="q-chat-message__time" dateTime={stamp.iso}>{stamp.text}</time>}
      {toolbar}
      <span role="status" className="q-sr-only">
        {streaming ? who + ' is responding' : failed ? who + '’s response failed' : copyState === 'copied' ? 'Copied to clipboard' : ''}
      </span>
    </article>
  );
}
