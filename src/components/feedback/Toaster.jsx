import React from 'react';
import { createPortal } from 'react-dom';
import { Toast } from './Toast';
import './Toaster.scss';

const POSITIONS = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];

// One store per page: toast() can be called from anywhere, and only the first mounted Toaster renders it.
let state = { toasts: [], hosts: [] };
let seq = 0;
const listeners = new Set();
const commit = next => { state = { ...state, ...next }; listeners.forEach(l => l()); };
const subscribe = l => { listeners.add(l); return () => listeners.delete(l); };
const snapshot = () => state;

export function toast(options) {
  const opts = typeof options === 'string' || React.isValidElement(options) ? { title: options } : { ...options };
  const id = opts.id ?? 'q-toast-' + ++seq;
  commit({ toasts: [...state.toasts.filter(t => t.id !== id), { ...opts, id }] });
  return id;
}
toast.dismiss = id => commit({ toasts: id == null ? [] : state.toasts.filter(t => t.id !== id) });

// toast() takes the semantic `status`; Toast's own `variant` still wins when given.
const kindOf = t => t.variant ?? (t.status && t.status !== 'info' ? t.status : 'default');

export function Toaster({ position = 'bottom-right', duration = 5000, max = 5, label = 'Notifications', className, style }) {
  const { toasts, hosts } = React.useSyncExternalStore(subscribe, snapshot, snapshot);
  const token = React.useId();
  const anchor = React.useRef(null);
  const [scope, setScope] = React.useState(null);
  React.useEffect(() => {
    commit({ hosts: [...state.hosts, token] });
    return () => commit({ hosts: state.hosts.filter(h => h !== token) });
  }, [token]);
  // The portal leaves the QuietRoot subtree, so it carries the nearest theme, density and accent with it.
  React.useLayoutEffect(() => {
    const root = anchor.current && anchor.current.closest('[data-theme]');
    if (!root) return;
    const accent = root.style.getPropertyValue('--q-accent');
    const next = {
      'data-theme': root.getAttribute('data-theme'),
      'data-density': root.getAttribute('data-density') ?? undefined,
      style: { colorScheme: root.style.colorScheme || undefined, ...(accent ? { '--q-accent': accent } : {}) },
    };
    setScope(prev => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
  });
  const host = hosts[0] === token && typeof document !== 'undefined';
  const pos = POSITIONS.includes(position) ? position : 'bottom-right';
  const shown = max > 0 ? toasts.slice(-max) : toasts;
  const cls = ['quiet', 'q-toaster', 'q-toaster--' + pos, className].filter(Boolean).join(' ');
  return (
    <>
      <span ref={anchor} hidden />
      {host && createPortal(
        <section aria-label={label} className={cls} data-quiet="" {...scope} style={{ ...(scope && scope.style), ...style }}>
          {/* The live region exists before any toast does, so insertions are announced; errors are assertive via Toast's role="alert". */}
          <ol className="q-toaster__list" aria-live="polite" aria-relevant="additions">
            {shown.map(t => <ToasterItem key={t.id} t={t} duration={duration} />)}
          </ol>
        </section>,
        document.body,
      )}
    </>
  );
}

function ToasterItem({ t, duration }) {
  const kind = kindOf(t);
  const ms = t.duration === undefined ? duration : t.duration;
  const close = () => { toast.dismiss(t.id); t.onDismiss && t.onDismiss(t.id); };
  return (
    <li className="q-toaster__item">
      <Toast title={t.title} description={t.description} meta={t.meta} variant={kind} action={t.action}
        onClose={close} duration={Number.isFinite(ms) ? ms : 0} />
    </li>
  );
}
