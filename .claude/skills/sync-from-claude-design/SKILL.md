---
name: sync-from-claude-design
description: Update quiet's reference mirror from the Claude Design project "Rounder softer design system" (daa56afb-593e-422a-ab8a-5ecfa9309fb9) — re-mirror changed files byte-for-byte, port the changes into the TypeScript components, keep pixel parity. Use when the design changed in Claude Design, or a reference component (core, forms, display, data, navigation, feedback, overlays, layout) needs to change.
---

# Sync the reference from Claude Design

The reference groups are a **TypeScript port** of the mirror. Never "improve" their design here. Change the design in Claude Design, then re-sync.

## 1. Who can fetch

- `DesignSync` (`get_project`, `list_files`, `get_file`) only works in the **main session or a fork** (`subagent_type: "fork"`). General-purpose subagents don't have it, so don't delegate fetching to them.
- If DesignSync returns an auth error, the user must run `/design-login`.
- DesignSync only serves design-system-type projects. For other projects, see the `port-future-concept` skill.

## 2. Mirror changed files into `docs/reference/optimus-design/`

1. `DesignSync get_file` each changed path. Write it to the same path under `docs/reference/optimus-design/`.
2. **Escape gotcha:** writing fetched text through Write or a heredoc turns `\uXXXX` escapes into literal characters, so the copy silently differs. Keep escapes as escapes, then verify.
3. **Verify every file by hash.** Compute sha256 inside a claude.ai tab: Omelette `GetFile` (snippet in `port-future-concept`) with project id `daa56afb-593e-422a-ab8a-5ecfa9309fb9`, then `crypto.subtle.digest('SHA-256', bytes)`. Compare it with `shasum -a 256 <file>` locally.
   - GetFile HTML includes an injected `<style data-omelette-injected>` and a `<script data-omelette-injected>`. Strip both before hashing HTML.
   - Return only the hashes and the list of mismatches from `javascript_tool`. File bodies get truncated.
4. Don't run `git checkout` on mirrored files mid-sync. A stray checkout once reset already-fixed files.

## 3. Bring changes into `src/`

1. `git diff -- docs/reference/optimus-design/components/` shows what changed in the mirror's `.jsx` and `.d.ts`.
2. **Port those changes by hand** into `src/components/<group>/<Name>.tsx`. Keep the a11y + motion layer, keep the props interface in step with the mirror's `.d.ts` (same names, JSDoc and `@startingPoint`), and keep the types strict: no `@ts-ignore` or new `any`.
3. Styles are quiet's own (BEM SCSS); the reference styles inline. Update `<Name>.scss` so the at-rest look matches.
4. Tokens or `styles.css` changed? Update `src/styles/tokens/` and `tokens/_reference-compat.scss` (reference names such as `--ink`/`--paper`/`--molten` live only there).
5. Run `npm run gen`. It regenerates `src/index.ts` and `src/stories/catalog.generated.tsx` from `components/index.html` and `ds-loader.js`.

## 4. Prove nothing drifted

```bash
npm run lint && npm run typecheck && npm run build && npm run test
```

- `tests/parity.spec.ts`: the catalog must be **pixel-identical** to the reference `components/index.html`, served on :8791 by `scripts/serve-reference.py`. The stock `http.server` resets connections under about 70 parallel loads, so always use that script.
- `tests/hover-parity.spec.ts`: hover states must match.
- `tests/a11y*.spec.ts`: axe in both themes plus keyboard. Only the accepted reference colours are exempt.

If parity fails, fix the scss or tokens. Never edit the mirror to match.
