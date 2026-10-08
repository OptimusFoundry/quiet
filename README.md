# quiet

A design system built from the ground up from 1,384 saved UI references. Quiet, precise, neutral:
grey chrome with one accent, Inter at 400/500 on a small tight scale, a 4px grid, 8/12px radii,
hairlines for resting surfaces and soft shadows only for things that float, and motion with real
springs and morphs.

- **Rules:** [DESIGN.md](DESIGN.md) — the constraints every component and screen follows.
- **Stack:** React 19, CSS Modules + CSS-variable tokens, [Motion](https://motion.dev) for springs
  and layout animation. Behaviour and accessibility are hand-rolled (no headless library) and
  covered by keyboard + axe tests.

## Use

```tsx
import { QuietRoot, Button } from "@optimusfoundry/quiet";
import "@optimusfoundry/quiet/style.css";

<QuietRoot mode="light" accent={{ hue: 255 }}>
	<Button variant="primary">Continue</Button>
</QuietRoot>;
```

## Develop

```bash
npm run dev        # Storybook on :6020
npm run lint       # Biome
npm run typecheck
npm run test       # Playwright keyboard + axe tests against Storybook
npm run build      # dist/index.js, dist/quiet.css, types
```
