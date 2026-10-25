import React from 'react';
import { animate, useReducedMotion } from 'motion/react';
import { motionToken } from '../../a11y/hooks';
import './ThinkingOrb.scss';

const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const TILT = 0.45;
const REST_ANGLE = 0.6;

// Even spread on a unit sphere, without the pole clustering of a lat/long grid.
function sphere(n) {
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (i / Math.max(1, n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    return { x: Math.cos(GOLDEN * i) * r, y, z: Math.sin(GOLDEN * i) * r };
  });
}

// A dotted sphere turning slowly, for "working" states. One lap per --q-thinking-orb-dur
// (the forge loop, 6s) divided by `speed`; reduced motion holds a single still frame.
export function ThinkingOrb({ size = 40, dots = 90, speed = 1, accent = 0.18, depthFade = 1, label = 'Thinking', className, style, ref, ...rest }) {
  const canvas = React.useRef(null);
  const reduced = useReducedMotion();
  const setRef = React.useCallback(el => {
    canvas.current = el;
    if (typeof ref === 'function') ref(el); else if (ref) ref.current = el;
  }, [ref]);

  React.useEffect(() => {
    const el = canvas.current;
    const ctx = el && el.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    el.width = Math.round(size * dpr);
    el.height = Math.round(size * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // A live declaration: reading it per frame follows theme and mode switches without a re-run.
    const css = getComputedStyle(el);
    const points = sphere(Math.max(2, Math.round(dots)));
    const every = accent > 0 ? Math.max(1, Math.round(1 / accent)) : 0;
    const radius = size * 0.42;

    const draw = angle => {
      const base = css.getPropertyValue('--q-thinking-orb-dot').trim() || 'currentColor';
      const hot = css.getPropertyValue('--q-thinking-orb-dot-accent').trim() || base;
      ctx.clearRect(0, 0, size, size);
      const projected = points.map((p, i) => {
        const x = p.x * Math.cos(angle) - p.z * Math.sin(angle);
        const z1 = p.x * Math.sin(angle) + p.z * Math.cos(angle);
        return { x, y: p.y * Math.cos(TILT) - z1 * Math.sin(TILT), z: p.y * Math.sin(TILT) + z1 * Math.cos(TILT), hot: every > 0 && i % every === 0 };
      }).sort((a, b) => a.z - b.z);
      for (const p of projected) {
        const depth = (p.z + 1) / 2;
        const persp = 1.6 / (2.4 - p.z);
        ctx.globalAlpha = 1 - depthFade * 0.75 * (1 - depth);
        ctx.fillStyle = p.hot ? hot : base;
        ctx.beginPath();
        ctx.arc(size / 2 + p.x * radius * persp, size / 2 + p.y * radius * persp, (size / 90) * (0.6 + depth * (p.hot ? 1.6 : 0.9)), 0, Math.PI * 2);
        ctx.fill();
      }
    };

    if (reduced || speed <= 0) { draw(REST_ANGLE); return; }
    const lap = Number(motionToken(el, '--q-thinking-orb-dur')) / 1000 || 6;
    const run = animate(REST_ANGLE, REST_ANGLE + Math.PI * 2, { duration: lap / speed, ease: 'linear', repeat: Infinity, onUpdate: draw });
    return () => run.stop();
  }, [size, dots, speed, accent, depthFade, reduced]);

  const named = label != null && label !== '';
  return (
    <canvas ref={setRef} width={size} height={size} role={named ? 'img' : undefined} aria-label={named ? label : undefined} aria-hidden={named ? undefined : true}
      className={className ? 'q-thinking-orb ' + className : 'q-thinking-orb'} data-motion={reduced || speed <= 0 ? 'still' : 'running'}
      style={{ '--_size': size + 'px', ...style }} {...rest} />
  );
}
