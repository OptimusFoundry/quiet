# quiet — how to build with it

quiet is Optimus Foundry's React design system. Build product screens from its components; style
only your own layout glue, with its tokens.

## 1. Wrap every screen in `QuietRoot density="app"`

```jsx
<QuietRoot density="app">{/* the whole screen */}</QuietRoot>
```

Without it nothing is styled (tokens, fonts and the reset are scoped to `[data-quiet]`). `density="app"`
is the **app look**: Geist + Geist Mono, 14px body, the molten accent (#e0531a) as the brand colour on
links, the primary button, current nav and selected states, and sections grouped by soft surfaces
rather than divider lines. Dark mode: `theme="foundry-dark"`. Never mix densities on one screen;
`"marketing"` is the editorial website look, `"compact"` dense admin tables.

## 2. Compose screens from these parts

- Shell: `SidebarProvider` › `Sidebar` (groups, the current item) + main. No desktop top bar.
- Every screen opens with `PageHeader` (title, `back`, `eyebrow`, `status`, `meta`, `actions`, `tabs`).
- Sections: `Panel` (surface by default; `variant="plain"` for the lead block; `empty="…"` collapses an empty section to one line). Never put a table inside a grey surface: a table sits on the page ground (`Panel variant="plain" padding="none"` when it needs a title).
- Properties: `DescriptionList` (labels next to values). References to records: `EntityLink`. Files: `FileCard` (`variant="row"` in lists). Agent runs: `Transcript`, `AgentRun`, `ToolCall`, `ChatThread`.
- One `Button variant="primary"` per view (it is molten); others `secondary`/`ghost`. Status: `Badge variant="success|warning|error|primary"`. Icons: `<Icon name="arrow-right" />` (glyph names in `components/core/Icon`).

## 3. Styling: tokens, not classes

Components take props, not classes — don't restyle them. For your own layout glue use inline styles
with quiet's `--q-*` tokens, never raw px or hex:

- space: `--q-space-inline` (8), `--q-space-stack` (16), `--q-space-field` (24), `--q-space-block` (32), `--q-space-section` (48), `--q-space-card-pad`
- colour: `--q-bg`, `--q-bg-subtle`, `--q-fg`, `--q-fg-body`, `--q-fg-muted`, `--q-border`, `--q-accent`, `--q-accent-fg` (accent text), `--q-accent-subtle` (tint)
- type: use `Text` (`size`, `weight`, `color`, `mono`), not raw font sizes
- shape: `--q-radius-md`, `--q-radius-lg`; widths `--q-w-sidebar`, `--q-w-detail-panel`

## 4. Where the truth lives

`styles.css` (and the `_ds_bundle.css` it imports) holds every token and component style. Each
component's `.d.ts` is its API and `.prompt.md` (`README.md` in the artifact) its usage; `guidelines/` has the design rules
(`docs/guidelines/layouts.md` for page anatomy, `checklist.md` before you ship a screen).

## 5. A detail page, idiomatically

```jsx
<QuietRoot density="app">
  <div style={{ display: "grid", gap: "var(--q-space-section)", padding: "var(--q-space-section)" }}>
    <PageHeader
      back={{ label: "Runs", href: "/runs" }}
      eyebrow="Run 233f76c2 · Orca"
      title="web-message"
      status={<Badge size="sm">Idle</Badge>}
      meta={["Started Oct 10, 8:32 PM"]}
      actions={<><Button size="sm" variant="secondary">Close run</Button>
                 <Button size="sm" variant="primary">Restart run</Button></>}
    />
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) var(--q-w-detail-panel)", gap: "var(--q-space-block)" }}>
      <Panel variant="plain" title="Transcript"><Transcript sessions={sessions} /></Panel>
      <Panel title="Details">
        <DescriptionList layout="stacked" size="sm" items={[
          { label: "Project", value: <EntityLink href="/projects/assistant">Assistant</EntityLink> },
          { label: "Cost", value: "$0.902049", mono: true },
        ]} />
      </Panel>
    </div>
  </div>
</QuietRoot>
```
