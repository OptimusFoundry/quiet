---
name: port-future-concept
description: Bring a concept from a Claude Design project (e.g. "Protoapp Design System" Future Components I–IV) into quiet — judge fit, read the source through Chrome, rebuild it on quiet tokens. Use when asked to add "future components" or port a Claude Design concept.
---

# Port a Claude Design concept into quiet

## 1. Judge fit before writing anything

A concept fits quiet only if it is all of the following:
- **reusable:** any product could use it; it's not a one-off demo;
- **keyboard-operable:** it has a real keyboard equivalent, not a pointer-only gesture;
- **calm:** it works in ink and greys with molten as punctuation, with no ambient or looping motion;
- **hardware-free:** no gaze, posture, voice, haptics or sensors.

Rejected before, for these reasons:
- **Pointer-only:** Weighted button, Scrub button, Tilt sort, Rip to dismiss, Chord action, Liquid cursor.
- **Sensors:** Gaze focus, Posture mode, Voice ripple, Haptic preview, Blink-safe alerts.
- **Too loud:** Thermal surface, Wet ink, Breathing container, System weather, Melting modal, Light source.
- **Whole screens:** Fleet view, Room, Day loom.

Check `src/components/future/` first, because about 25 concepts are already ported.

## 2. Read the source (Chrome, read-only)

Future Components lives in a non-design-system project: Protoapp Design System, `a87792bf-11eb-4926-bb3f-262e3ffc5c46`. DesignSync returns 404 for it, so read it through the Claude Design web API in the user's Chrome.

1. Open your **own** tab (`tabs_create_mcp`) and navigate to `https://claude.ai/robots.txt`. Any same-origin page works.
2. Fetch the file with `javascript_tool`, then put its text into a `<pre>`:

```js
const pid = 'a87792bf-11eb-4926-bb3f-262e3ffc5c46';
const enc = new TextEncoder(), td = new TextDecoder();
const varint = n => { const o = []; while (n > 127) { o.push((n & 127) | 128); n >>>= 7; } o.push(n); return o; };
const str = (f, s) => { const b = enc.encode(s); return [(f << 3) | 2, ...varint(b.length), ...b]; };
function dec(b) { let i = 0; const out = []; const vi = () => { let r = 0, s = 0, x; do { x = b[i++]; r += (x & 127) * 2 ** s; s += 7; } while (x & 128); return r; };
  while (i < b.length) { const k = vi(), f = k >> 3, t = k & 7; if (t === 0) out.push([f, vi()]); else if (t === 2) { const l = vi(); out.push([f, b.slice(i, i + l)]); i += l; } else if (t === 1) i += 8; else if (t === 5) i += 4; else break; } return out; }
window.__get = async p => { const r = await fetch('/design/anthropic.omelette.api.v1alpha.OmeletteService/GetFile', { method: 'POST', headers: { 'content-type': 'application/proto', 'connect-protocol-version': '1' }, body: new Uint8Array([...str(1, pid), ...str(2, p)]), credentials: 'include' });
  return td.decode(dec(new Uint8Array(await r.arrayBuffer())).find(([f]) => f === 1)[1]).replace(/<style data-omelette-injected[\s\S]*?<\/style>/, ''); };
const t = await __get('Future Components II.html');            // or "Future Components.html", "… III.html", "… IV.html"
const i = t.indexOf('function Honest');                          // slice just the concept you need
const pre = document.createElement('pre'); pre.textContent = t.slice(i, i + 6000); document.body.replaceChildren(pre); t.length
```

3. Read the slice with `get_page_text`. **Never** read file content from `javascript_tool` output: it gets truncated at about 1000 characters and blocked as cookie or query data.
4. To list files, call `ListFiles` with the same body shape plus `24, 1`, field 2 being the folder.
5. **Never** send page data to localhost or any other receiver. Read it, then retype what you need.
6. Close your tab when you're done.

Each concept has its `name`, `from`/`replaces` and `why` on its `<Concept …>` element. On pages III and IV, the concepts are listed in a `CONCEPTS` array.

## 3. Rebuild in quiet's language, not Proto's

| Proto | quiet |
|---|---|
| green success, red danger, amber warning | `--q-status-*` tokens (foundry maps success to ink and warning/error to molten); no status fills |
| accent fills, bevelled keys, glass, well shadows | hairline borders, `--q-bg-subtle`, quiet's Button/Badge |
| `--ease-spring`, overshoot, looping pulses, drifting backgrounds | `--q-ease-soft`, one-shot transitions, nothing that moves at rest |
| inline styles and `useState` hover | BEM SCSS with tokens; `:is(:hover, :focus-visible)` |
| pointer-only drags | a `role="slider"` (or similar) with arrow keys, Home/End and PageUp/PageDown, plus the pointer |
| hard-coded demo data | props only; the data goes in the story |
| a timer-driven demo | buttons or a slider in the story, so tests stay deterministic |

Keep the concept's idea, and record what you dropped and why in your report.

Then follow the `new-component` skill: scaffold, story section with `index` = concept number, `from` and `idea` adapted from the source, tests, and the done-bar.
