import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { motionToken, useEscape } from '../../a11y/hooks';
import './MorphingTooltip.scss';

const Group = React.createContext(null);
const FOCUSABLE = 'a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"]),[role="button"]';
const NO_BOX = { x: 0, y: 0, w: 0, h: 0 };

function seconds(el, name) {
  const v = motionToken(el, name);
  return typeof v === 'number' ? v / 1000 : 0;
}

function easing(el, name) {
  const m = String(motionToken(el, name)).match(/cubic-bezier\(([^)]+)\)/);
  return m ? m[1].split(',').map(Number) : 'easeOut';
}

// `custom` reaches content that is already leaving, so its exit uses the latest direction and timing.
const slide = {
  enter: ({ dir, by }) => ({ opacity: dir ? 0 : 1, x: dir ? `${dir * by}%` : 0 }),
  center: ({ move }) => ({ opacity: 1, x: 0, transition: move }),
  exit: ({ dir, by, move }) => ({ opacity: 0, x: dir ? `${-dir * by}%` : 0, transition: move }),
};

// One tooltip shared by every trigger in the group. Moving between triggers glides it to the new
// anchor and resizes it, and the content slides in from the side the pointer came from, so a row
// of dense headers reads as one surface instead of popups flickering open and shut.
export function MorphingTooltipGroup({ hideDelay = 120, placement = 'bottom', children, className, style, ref, ...rest }) {
  const root = React.useRef(null);
  const sizer = React.useRef(null);
  const timer = React.useRef();
  const current = React.useRef(null);
  const openRef = React.useRef(false);
  const tooltipId = React.useId();
  const reduced = useReducedMotion();
  const [active, setActive] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [dir, setDir] = React.useState(0);
  const [box, setBox] = React.useState(NO_BOX);
  // Whether this change is a move between triggers (glide) or an opening from closed (jump into place).
  const [glide, setGlide] = React.useState(false);
  const [timing, setTiming] = React.useState({ dur: 0, fade: 0, ease: 'easeOut', by: 40 });

  const setRoot = React.useCallback(el => {
    root.current = el;
    if (typeof ref === 'function') ref(el); else if (ref) ref.current = el;
  }, [ref]);

  React.useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    setTiming({
      dur: seconds(el, '--q-morphing-tooltip-dur'),
      fade: seconds(el, '--q-morphing-tooltip-fade-dur'),
      ease: easing(el, '--q-morphing-tooltip-ease'),
      by: parseFloat(getComputedStyle(el).getPropertyValue('--q-morphing-tooltip-slide')) || 0,
    });
  }, [reduced]);

  const setOpenBoth = v => { openRef.current = v; setOpen(v); };

  const show = React.useCallback(next => {
    clearTimeout(timer.current);
    const cur = current.current;
    const moving = !!cur && openRef.current && cur.id !== next.id;
    setGlide(moving);
    setDir(moving ? (next.el.getBoundingClientRect().left >= cur.el.getBoundingClientRect().left ? 1 : -1) : 0);
    current.current = next;
    setActive(next);
    setOpenBoth(true);
  }, []);

  const hide = React.useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpenBoth(false), hideDelay);
  }, [hideDelay]);

  const close = React.useCallback(() => { clearTimeout(timer.current); setOpenBoth(false); }, []);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  useEscape(open, close);

  React.useLayoutEffect(() => {
    if (!active || !root.current || !sizer.current) return;
    const r = root.current.getBoundingClientRect();
    const a = active.el.getBoundingClientRect();
    const w = sizer.current.offsetWidth;
    const h = sizer.current.offsetHeight;
    const centred = a.left - r.left + a.width / 2 - w / 2;
    setBox({
      x: r.width > w ? Math.min(Math.max(0, centred), r.width - w) : centred,
      y: placement === 'top' ? a.top - r.top - h : a.bottom - r.top,
      w,
      h,
    });
  }, [active, placement]);

  const move = reduced || !glide ? { duration: 0 } : { duration: timing.dur, ease: timing.ease };
  const ctx = React.useMemo(() => ({ show, hide, close, tooltipId, activeId: open && active ? active.id : null }), [show, hide, close, tooltipId, open, active]);
  const custom = { dir: reduced ? 0 : dir, by: timing.by, move };

  return (
    <Group.Provider value={ctx}>
      <div ref={setRoot} className={className ? 'q-morphing-tooltip ' + className : 'q-morphing-tooltip'} style={style} {...rest}>
        {children}
        <div ref={sizer} className="q-morphing-tooltip__content q-morphing-tooltip__sizer" aria-hidden="true">{active?.content}</div>
        <motion.div id={tooltipId} role="tooltip" className="q-morphing-tooltip__panel" data-state={open ? 'open' : 'closed'} data-placement={placement}
          initial={false}
          animate={{ x: box.x, y: box.y, width: box.w, height: box.h, opacity: open ? 1 : 0, visibility: 'visible', transitionEnd: open ? undefined : { visibility: 'hidden' } }}
          transition={{ x: move, y: move, width: move, height: move, opacity: { duration: timing.fade, ease: timing.ease } }}
          onPointerEnter={() => clearTimeout(timer.current)} onPointerLeave={hide}>
          <AnimatePresence initial={false} custom={custom}>
            {active && (
              <motion.div key={active.id} className="q-morphing-tooltip__content" style={{ width: box.w }} custom={custom}
                variants={slide} initial="enter" animate="center" exit="exit">
                {active.content}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </Group.Provider>
  );
}

export function MorphingTooltipTrigger({ id, content, children, className, style, ref, ...rest }) {
  const ctx = React.useContext(Group);
  const own = React.useRef(null);
  const auto = React.useId();
  const key = id ?? auto;
  const setOwn = React.useCallback(el => {
    own.current = el;
    if (typeof ref === 'function') ref(el); else if (ref) ref.current = el;
  }, [ref]);
  // A button, link or field child is the trigger itself and gets the description; plain text gets a
  // tab stop on the wrapper instead (as Tooltip and Popover do).
  const [inner, setInner] = React.useState(null);
  React.useLayoutEffect(() => {
    const c = own.current && own.current.firstElementChild;
    setInner(c && c.matches(FOCUSABLE) ? c : null);
  });
  const described = ctx && ctx.activeId === key ? ctx.tooltipId : undefined;
  React.useLayoutEffect(() => {
    if (!inner) return;
    if (described) inner.setAttribute('aria-describedby', described); else inner.removeAttribute('aria-describedby');
  }, [inner, described]);
  if (!ctx) throw new Error('MorphingTooltipTrigger must be inside a MorphingTooltipGroup');
  const show = () => own.current && ctx.show({ id: key, content, el: own.current });
  return (
    <span ref={setOwn} className={className ? 'q-morphing-tooltip__trigger ' + className : 'q-morphing-tooltip__trigger'} style={style}
      tabIndex={inner ? undefined : 0} aria-describedby={inner ? undefined : described} data-active={described ? 'true' : undefined}
      onPointerEnter={show} onPointerLeave={ctx.hide} onFocus={show} onBlur={ctx.hide} {...rest}>
      {children}
    </span>
  );
}
