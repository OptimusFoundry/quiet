# quiet — agent guide

Read [DESIGN.md](DESIGN.md) before writing any component or story; it is the spec. quiet ports
the Optimus Foundry "Soft" system mirrored in `docs/reference/optimus-design/` — port a
component from its `.jsx`/`.d.ts`/`.prompt.md` there, keep the prop API, and add it to the
catalog story (`src/stories/Catalog.stories.tsx`) in the same group and order. The reference
corpus it came from (per-post analysis of 1,384 liked UI posts) lives outside this repo in
`~/Workspaces/x-likes/` (`ui_all.json`, `design-dna.md`), media in `s3://protoapp-x-likes-media`.

## Rules

- **Tokens only.** Every colour, size, space, radius, shadow, duration and easing comes from
  `--q-*` in `src/tokens/tokens.scss`. Add a token rather than a literal.
- **One folder per component:** `src/components/Name/Name.tsx`, `Name.module.scss`,
  `Name.stories.tsx`. Export it from `src/index.ts`.
- **React 19:** `ref` as a prop, no `forwardRef`. No barrel files besides `src/index.ts`.
- **Behaviour is hand-rolled.** Use the shared hooks in `src/hooks/` (focus trap, roving focus,
  dismiss, portal, positioning) instead of re-implementing them per component. Every interactive
  component ships keyboard support, correct ARIA, and a Playwright test with axe in `tests/`.
- **Motion:** eased, never bouncy (`--q-ease-soft`); layout morphs may use `motion`, hovers and
  fades stay in CSS. Everything respects `prefers-reduced-motion`.
- **Showcase stories:** components with motion get a `Showcase` story that runs a scripted
  timeline (no real pointer) so it can be recorded as a social clip.
- **Comments explain why, never what.** Keep them rare.
- **Before finishing:** `npm run lint && npm run typecheck && npm run test`, and look at the story
  in light and dark at 2x — check focus states and that nothing shifts between states.
