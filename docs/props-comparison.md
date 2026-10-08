# Proto → quiet props comparison

Sources: `docs/proto-props-inventory.json` (Proto, from `saas-template/webapp/src/proto-design-system`) and `src/components/<group>/<Name>.d.ts` + `.jsx` (quiet 0.1.0, React 19). Proto→quiet name mapping per `docs/reference/optimus-design/readme.md`.

Legend: **P** = Proto, **Q** = quiet. "↔" = same concept, different name. "—" = absent.

---

## 1. Coverage

### 1.1 Numbers

| | Count |
|---|---|
| Proto inventory entries | 93 (92 unique; `Grid.Item` is an alias of `GridItem`) |
| Proto standalone components | 64 |
| Proto compound sub-parts | 28 (Card ×3, GridItem, List ×2, Table ×8, NavLink, Sidebar ×9, Tabs ×4) |
| Standalone Proto with a quiet equivalent | **61 / 64** (95%), landing on 59 quiet components (LinkButton→Button, DataTable→DataGrid) |
| Standalone Proto with no equivalent | 3: ThemeSwitcherGrid, BannerCenterProvider (both dropped on purpose), ToastContainer |
| Sub-parts covered by a quiet prop or data shape | **23 / 28**; 1 (GridItem) is a real component (`Col`) |
| Sub-parts with no equivalent | 5: TableFooter, TabPanel, TabPanels, SidebarProvider, SidebarMobileTrigger |
| quiet components | 68 = 59 mapped + `Col` + 8 quiet-only |
| quiet-only | ArrowLink, Eyebrow, Headline, StatusDot, Wordmark, Stat, ProcessStep, GridOverlay |

The two systems compose differently. **Proto uses compound components** (Card/Table/List/Tabs/Sidebar/Navbar split into named sub-exports). **quiet is data-driven**: one component per concept, with slot props (`eyebrow`, `title`, `footer` …) and arrays (`items`, `groups`, `columns`, `tabs`, `links`). The only quiet sub-component is `Col` (the grid cell).

### 1.2 Coverage table

| Proto | quiet | Notes |
|---|---|---|
| Avatar | Avatar | |
| Badge | Badge | |
| Button | Button | |
| ButtonGroup | ButtonGroup | |
| Link | Link | Q also has ArrowLink for standalone CTA links |
| LinkButton | Button `href` | |
| Icon | Icon | P = Lucide component; Q = unicode glyph names |
| Skeleton | Skeleton | |
| Spinner | Spinner | |
| Tag | Tag | |
| Text | Text | Q also has Headline (display heading with an accent) |
| Checkbox | Checkbox | P native input; Q ARIA `role="checkbox"` |
| FormField | FormField | |
| FormHint | FormHint | |
| Input | TextField (full) / Input (simple) | Q Input is a *labelled* field, unlike P's bare Input |
| Label | Label | |
| Radio | Radio | P = single radio; Q = **radio group** (`options`) |
| Select | Select | |
| Slider | Slider | P native range; Q ARIA `role="slider"` |
| Stepper | Stepper | |
| Switch | Switch | |
| TextArea | TextArea | |
| TextField | TextField | |
| AspectRatio | AspectRatio | |
| Card + CardHeader / CardBody / CardFooter | Card | Data-driven: `eyebrow`/`title`/`accent` (header), `children` (body), `meta`/`footer` (footer row) |
| Container | Container | |
| Divider | Rule | |
| Grid | Grid | |
| GridItem / Grid.Item | Col | Real component |
| PageHero | PageHero | |
| PageShell | PageShell | |
| PageTransition | PageTransition | |
| SectionHeader | SectionHeader | |
| Stack | Stack | |
| DataGrid | DataGrid | |
| DataTable | DataGrid (or Table) | |
| EmptyState | EmptyState | |
| FilterTabs | FilterTabs | |
| List + ListItem / ListGroup | List | Data-driven: `items[]`, `groups[]` |
| StatCard | StatCard | Q also has the plain `Stat` |
| Table + TableHeader/Body/Row/Head/Cell/Caption/ExpandedRow | Table | Data-driven: `columns[]`, `data[]`, `caption`, `renderExpanded`, `sort` |
| TableFooter | **none** | No footer or totals row in Q |
| Alert | Alert | |
| Banner | Banner | |
| BannerCenterProvider | **none** (by design) | "use one Banner at a time" |
| Progress | Progress | |
| Toast | Toast | |
| ToastContainer | **none** | No positioning container, queue or portal in Q |
| Accordion | Accordion | Both data-driven |
| DatePicker | DatePicker | |
| FileUpload | FileUpload | |
| MultiSelect | MultiSelect | |
| ThemeSwitcherGrid | **none** (by design) | No dark theme in the brand |
| Breadcrumb | Breadcrumb | |
| CommandPalette | CommandPalette | |
| Navbar + NavLink | NavBar | Data-driven: `links[]` |
| Pagination | Pagination | |
| Sidebar + SidebarHeader / Logo / Toggle / Section / Group / Item / Divider | Sidebar | `header`, `collapsible` (toggle), `groups[]` (section; `collapsible`/`defaultOpen` = SidebarGroup), `items[]`, `dividers` |
| SidebarProvider, SidebarMobileTrigger | **none** | Q collapses to a rail below `breakpoint`; no mobile off-canvas drawer and no external trigger |
| StepIndicator | StepIndicator | |
| Tabs + TabList / Tab | Tabs | Data-driven `tabs[]` |
| TabPanel / TabPanels | **none** | Q renders the tablist only; the consumer renders the panel and links it with `tabs[].panelId` |
| Drawer | Drawer | |
| Dropdown | Dropdown | |
| DropdownMenu | DropdownMenu | P = menu surface only; Q = trigger + menu (+ context-menu mode) |
| Modal | Dialog | |
| Popover | Popover | |
| Tooltip | Tooltip | |

---

## 2. Per-component prop diff

Columns: **P only** · **Q only** · **Renamed (P ↔ Q)** · **Type / value differences** · **Behavior** (callbacks, controlled state, passthrough, ref).

No pair matches exactly. These are **near-identical** and differ only in `style` support or ReactNode-vs-string: **Label** (Q adds `style`; `subText` is a node), **FormHint** (`showIcon`+`icon` → `icon: boolean | node`), **Container** (default size `lg` → `xl`; Q also accepts a number) and **Stepper** (see below).

About passthrough/ref in general: Proto primitives `forwardRef` and extend the HTML attributes, while most Proto composites accept only `className`. **No quiet component uses `forwardRef`.** Under React 19, `ref` is an ordinary prop, so it reaches the DOM only on the 10 quiet components that spread `...rest`: Button, ButtonGroup, Link, ArrowLink, Text, Spinner, Input, Select, TextField and TextArea. Every other quiet component silently drops `ref`, `id`, `data-*` and unknown `aria-*`.

### Primitives

**Avatar**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `initials` (explicit) | `name` (derives initials and title) | `variant` ↔ `shape` | P shape `circle\|rounded\|square`; Q `circle\|square` (P `rounded` and `square` both become Q `square`). Q `size` also takes a number | P: ref + HTML attrs. Q: only `className`/`style` |

**Badge**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `rounded` | `count`, `max` | — | `variant`: P has `accent`, Q doesn't. Q `dot` is on by default for success/warning/error | P: ref + span attrs. Q: none |

**Button** (also covers **LinkButton**)
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `isIconOnly` (boolean; icon passed as children) | `arrow`, `href`, `icon` (node; icon-only when there are no children) | `isLoading` ↔ `loading`, `isFullWidth` ↔ `fullWidth`, `isIconOnly` ↔ `icon` | `variant`: P has `default`, `accent`; Q has neither. **Default changes from P `default` to Q `primary`** | Both set `aria-busy` and block clicks while loading. Q warns when an icon-only button has no aria-label. A P LinkButton cannot be disabled; Q `href` + `disabled`/`loading` renders a disabled `<button>` instead. Ref: P forwardRef; Q via rest (React 19) |

**ButtonGroup**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `size` | `label` (aria name) | `isAttached` ↔ `attached`, `orientation` ↔ `vertical` (boolean), `isFullWidth` ↔ `fullWidth` | Q `spacing` also takes a number | Both spread rest |

**Link**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `leftIcon`, `LinkComponent` + `to` (router injection) | `external` (sets target/rel and appends ↗ + sr text) | `underlineOnHover` ↔ `underline` | `underline`: boolean → `'hover'\|'always'\|'none'`. Q `size` adds `inherit` (the default) | P adds rel automatically for any `target="_blank"`; Q only does so via `external`. Both spread rest |

**Icon**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `icon: LucideIcon` | `name`, `glyph` | `icon` ↔ `name`/`glyph` | `color`: P has `secondary`; Q has `quiet` plus any CSS string. Q size takes a number | P: SVG attrs + ref. Q: none. **Not source-compatible**: Lucide components → glyph names |

**Skeleton**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| — | `lines`, `gap`, `label`, `loading` + `children` | `disableAnimation` ↔ `animate` (**inverted**) | — | Q can announce itself (`role=status`) when given a `label`. P: ref + attrs |

**Spinner**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| — | — | `variant` ↔ `tone` | P `default\|primary\|secondary\|white` → Q `default\|muted\|paper\|molten`; Q size takes a number | `label`: P defaults to "Loading" and is visually hidden; Q renders it **visibly** beside the ring (mono caps) |

**Tag**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `removable`, `removeAriaLabel` | `style` | `variant` ↔ `tone`, `onSelectChange` ↔ `onSelect`, `leftIcon` ↔ `icon` | Q `tone` is only `default\|ink` (**no status colours**). Q `size` has no `lg`. `avatar`: string URL → ReactNode | Both support selected/defaultSelected (controlled and uncontrolled). Q shows the × whenever `onRemove` is set |

**Text**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `nowrap` | `heading` (1–4), `mono` | `strikethrough` ↔ `strike` | `color`: P `secondary` → Q `heading`/`quiet`; `transform` drops `none`; `align` drops `justify`; Q size takes a number; `as` narrows from `ElementType` to intrinsic tag names | P has no ref; Q passes ref via rest |

### Forms

**Checkbox**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| every native input attribute (`name`, `value`, `required`, `form`…) | `aria-label` (explicit) | `isError` ↔ `error` | `label`/`description`: string → node. `error`: boolean → `boolean \| string` (a string renders a message) | **`onChange(event)` → `onChange(checked: boolean)`**. Q is a `role="checkbox"` span, so there is **no native form participation** (no `name`, no submission). P: ref on `<input>` |

**FormField**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| — | `subText`, `style` | `errorMessage` ↔ `error` | strings → nodes | **Q wires `id`, `aria-describedby`, `aria-invalid` and `aria-required` into the child**; P makes the consumer repeat the id |

**Input** — the names collide. P Input is a *bare* control (`size`, `variant`, `leftElement`, `rightElement`, `isError`, `isFullWidth`). Q Input is a *simple labelled* field (`label`, `hint`, `error`, `multiline`) with no size, variant or adornments. Migrate P Input → **Q TextField**. Both spread native attrs; `onChange(event)` is unchanged. `className` lands on P's wrapper but on Q's native control.

**Label**: near-identical (see above).

**Radio** — the granularity differs. P renders one native radio per option and you group them with `name`. Q is a **group**: `options[]` (`description` and `disabled` per option), `value`/`defaultValue`/**`onChange(value)`**, `direction`, a group `label` and `aria-label`, and `error`. P-only: per-radio ref and native attrs. Renamed: `isError` ↔ `error`.

**Select** (both native, `onChange(event)`)
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `placeholder`, `helperText`, `errorMessage`, `size`, `variant`, `fullWidth`, per-option `disabled` | string options | — | `options` required → optional | Q Select is minimal. Field chrome (helper, error, size) lives in Dropdown / FormField instead |

**Slider**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `fullWidth`, native attrs (`name`…) | `aria-label` | — | `formatValue` returns a node in Q. `showValue` default: P `false`, Q `true` | **`onChange(event)` → `onChange(number)`**. Q is `role="slider"` with full keyboard support and tracks its value live when uncontrolled (P's display did not). No form participation in Q |

**Stepper**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| — | `defaultValue`, `id`, `aria-describedby/-invalid/-required` | `aria-label` ↔ `label` | `value`/`onChange` required → optional | P is controlled-only; Q supports both. `onChange(value)` in both. Q has a `fieldControl` hook for FormField |

**Switch**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| native attrs | `aria-label` | — | `label`/`description` become nodes | **`onChange(event)` → `onChange(checked)`**. Q has `role="switch"` (P has no switch role). No form participation in Q |

**TextArea** (both `onChange(event)`)
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `hideLabel`, `fullWidth`, `isError` | `maxLength` counter | `errorMessage` ↔ `error` | `resize` drops `horizontal` | Q forwards native `required` (P sets only `aria-required`). `className` moves from P's wrapper to Q's `<textarea>` |

**TextField** (both `onChange(event)`)
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `isFullWidth`, `isError` | `inputStyle` | `leftElement` ↔ `leftIcon`, `rightElement` ↔ `rightIcon`, `errorMessage` ↔ `error` | — | P adornments are `aria-hidden`; Q `rightIcon` may be interactive. `className`: P wrapper → Q native input; `style` goes on Q's wrapper |

**DatePicker**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `inline` | `defaultValue`, `label`, `helperText`, `error`, `style` | `minDate` ↔ `min`, `maxDate` ↔ `max`, `formatDate` ↔ `format`, `firstDayOfWeek` ↔ `weekStartsOn` | — | P's value is controlled-only; Q supports both modes. `onChange(date)` in both |

**FileUpload**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `files` (controlled), `existingFiles`, `onRemoveExisting`, `showFileList` | `hint`, `simulateUpload`, `buttonLabel`, `style` | `onFilesChange` ↔ `onChange`, `description` ↔ `hint`, `existingFiles` ≈ `defaultFiles` | file row: `{file,id,progress,error}` → `{id:number,name,size,file,progress,error}` | **P is controlled-only; Q is uncontrolled-only.** `multiple` default: P `false`, **Q `true`**. Q also validates type, size and count, and announces changes politely |

**MultiSelect**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `align`, item `icon` | `defaultValue`, `label`, `maxDisplay`, `searchable`, `helperText`, `error` | `items` ↔ `options`, item `id` ↔ `value` | **`Set<string>` → `string[]`**. `variant`: `outline` → `filled` | P is controlled-only; Q supports both. Q shows chosen values as pills |

**Dropdown**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `trigger` (custom content), `placement`, `triggerAriaLabel`, `iconOnly`, item `danger` | `defaultValue`, `label`, `helperText`, `error`, `style` | `items` ↔ `options`, item `id` ↔ `value`, `divider: bool` on an item ↔ a `{divider:true}` entry | `variant`: P `outline\|ghost` → Q `filled` | P is controlled-only, with mixed menuitem/listbox roles. Q is a combobox + listbox and supports both modes |

### Layout

**AspectRatio**: Q adds the `photo` preset, a `label` placeholder and `style`. No renames.

**Card** (P Card + CardHeader/Body/Footer → Q Card)
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `variant` (`elevated\|outlined\|filled\|spec`), `padding`, `interactive`, `as`, `onContextMenu`, sub-parts | `eyebrow`, `title`, `accent`, `meta`, `footer`, `href` | CardHeader `name` ↔ `title`, CardHeader `meta` ↔ `meta` | — | Q becomes interactive when `href` or `onClick` is set (and renders `<a>` for href). P `interactive` gives `role=button` without keyboard activation |

**Container**: near-identical. Default size changes from `lg` to `xl` (**a visual change on migration**).

**Rule** (P Divider)
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| — | `tone`, `labelAlign`, `style` | `children` ↔ `label` | — | Q labels and vertical rules keep separator semantics |

**Grid**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| responsive objects for every prop, `columnGap`, `containerQuery`, `staggerDelay`, `Grid.Item` | `minChildWidth` (auto-fit), `align`, `breakpoints` | `animate` ↔ `animated`, `containerQuery` ≈ `breakpoints` | `columns`: string literals → `number \| template string`. `gap`: `'0'` → `'none'`, no `3xl`/`4xl`, numbers allowed | Q responsiveness comes from `minChildWidth` and `Col` container spans |

**Col** (P GridItem)
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| responsive `span`/`start` objects, `span="full"`, arbitrary prop spread | `spanMd`, `spanSm`, `rowSpan`, `style` | — | — | P overwrote `style`; Q merges it |

**PageHero**: Q adds `index`, `accent`, `after`, `size`, `ruled` and `as` (heading level). Otherwise the same.

**PageShell**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `variant: full` | `layout` (`single\|half\|third\|sidebar\|sidebar-right`), `header`, `gap`, `style` | `variant="narrow"` ↔ `narrow`, `animate` ↔ `animated` | `as` narrows to `div\|main\|section\|article` | P wraps a 12-column Grid; Q uses column presets |

**PageTransition**: `pageKey` ↔ `transitionKey`, `type` ↔ `variant`. `duration`: P takes a motion token (seconds) and **Q takes ms**. Q adds `style`.

**SectionHeader**: Q adds `index` and `accent`, and turns its slots into nodes (P used strings). `as` is limited to `h2–h4`.

**Stack**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| responsive objects, `containerQuery`, `staggerDelay` | — | `animate` ↔ `animated` | **`align`/`justify`: P tokens (`start`, `between`, `around`, `evenly`) → Q raw CSS values** (`space-between`…); `between` silently breaks. `gap`: `'0'` → `'none'`, no `3xl`/`4xl`, numbers allowed. **Default gap changes from `md` to `sm`** | — |

### Data

**DataGrid** (P DataGrid and DataTable → Q DataGrid, which passes extra props to Table)
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `pagination` (boolean), `loadingMessage`, `emptyState` node, column `sortFn`; DataTable `density` | `title`, `actions`, `searchable`, `searchPlaceholder`, `size`, `emptyTitle/Description/Actions`, every Table prop | `getRowId`/`getRowKey` ↔ `rowKey`, column `id` ↔ `key`, `cell` ↔ `render`, `selectedIds` ↔ `selected`, `density` ↔ `size`, DataTable `loadingRowCount` ↔ `loadingRows` | **Selection: `Set` → array**. `rowKey` also accepts a field name. `pageSize={0}` disables paging | P selection is controlled-only and its sort is internal. Q selection works both ways, and sort can be controlled through Table |

**EmptyState**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| — | `eyebrow`, `accent`, `bordered`, `align`, `headingLevel` | `action` + `secondaryAction` ↔ `actions` | `title`/`description` become nodes; `icon=null` hides the icon | — |

**FilterTabs**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| — | `defaultValue`, `showCounts`, item `disabled`, string items | item `id` ↔ `value`, `aria-label` ↔ `label` | `size` drops `lg` | P is controlled-only with a tablist that has no arrow keys. Q is a `radiogroup` with roving focus |

**List** (P List + ListItem/ListGroup)
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `variant` enum, sub-components | item `href`, `style` | ListItem `children` ↔ item `primary`, ListGroup ↔ `groups[]`, `animate` ↔ `animated` | `variant: divided\|bordered` → booleans `divided` (**default true**) and `bordered` | Q avoids P's invalid `<li>` nesting when animated |

**StatCard**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `numericValue`, `description`, `footer` | `period`, `animate`, `href` | `formatValue` ↔ `format`, `trendValue` ↔ `delta` | `variant`: `default` → `plain`. `delta` as a number means a percent | P always springs a `numericValue`. Q counts up only with `animate`, and always eases later changes |

**Table** (P Table + 8 sub-parts → Q data-driven Table)
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| sub-parts, TableFooter, cell `narrow`, `loadingMessage` | `columns`, `data`, `rowKey`, `caption`, `selectable` + `selected/defaultSelected/onSelectionChange`, `sort/defaultSort/onSortChange`, `manualSort`, `renderExpanded`, `loadingRows`, `emptyText`, `onRowClick`, `label`, `rowLabel` | TableHead `sortDirection`/`onSort` ↔ `sort`/`onSortChange` | `variant: striped\|bordered` → booleans (combinable). `minWidth`: string → number | P expansion is controlled per row (`expanded`); Q expansion is internal only. Q names its per-row checkbox and expand controls |

### Feedback

**Alert**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `dismissible`, `customIcon` | `action`, `style` | `icon: boolean` + `customIcon` ↔ `icon: false \| node` | `title` becomes a node | Q is dismissible when `onDismiss` is set. Role: P always `alert`; Q uses `alert` only for errors and `status` otherwise |

**Banner**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `icon`, `animate`, type `feature` | `label` | `type` ↔ `status`, `description` ↔ `children` | `variant`: `filled\|light\|lighter\|stroke` → `ink\|paper\|outline`. `title` is required in P, optional in Q | Q uses `region` (or `alert` for errors) with an accessible name |

**Dialog** (P Modal)
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `description`, `iconVariant`, `size: full`, `className` | `eyebrow`, `accent`, `width` | `isOpen` ↔ `open`, `footer` ↔ `actions`, `showCloseButton` ↔ `showClose`, `icon` + `iconVariant` ↔ `icon: 'info'\|…\|node` | — | Both are controlled-only with `onClose`. P uses native `showModal`; Q makes the background inert, traps and restores focus, and locks scroll. **Q drops `className` and `style`.** Q uses `useId` (P hard-coded ids that collide) |

**Progress**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| — | `label` (visible), `heat` variant, `style` | `showLabel` ↔ `showValue` | `value` required → optional (default 0) | — |

**Toast**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `closable` | `meta`, `duration` (auto-dismiss, pauses on hover/focus), `status` (legacy), `style` | `children` ↔ `description` | `variant` adds `neutral` | Q is closable when `onClose` is set. Role: P is `aria-live=polite`; Q is `status`, or `alert` for errors |

**Tooltip**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `className` | `delay` | `position` ↔ `placement` | — | Q wires `role="tooltip"` and `aria-describedby`; P is CSS-only with neither |

### Display

**Accordion**: `onExpandedChange` ↔ `onChange`. Ids widen from `string` to `string | number`, and item `id` becomes optional. Q adds `headingLevel` and `style`. Both support controlled and uncontrolled use.

### Navigation

**Breadcrumb**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `showHomeIcon` | item `onClick`, `label`/`aria-label`, `style` | — | default separator changes from `›` to `/` | Neither supports router injection |

**CommandPalette**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `filterFn`, item `disabled`, `className` | `onOpen`, `hotkey` (⌘K), `label` | `isOpen` ↔ `open` | item `shortcut`: `string[]` → `string` | Item `onSelect` receives the item in Q. Q is a combobox + listbox with focus trap |

**NavBar** (P Navbar + NavLink)
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `variant`, `sticky`, free `children`, mobile menu | `cta`, `ctaHref`, `onCta`, `label`, `homeLabel`, `style` | `brand` ↔ `mark` (Q always renders the Wordmark), NavLink `active` ↔ link `current`, `actions` ≈ `cta` | `children` nodes → `links[]` data | Q is brand-locked: one CTA and a wordmark |

**Pagination**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| — | `defaultPage`, `label`/`aria-label`, `style` | `totalPages` ↔ `total`, `onPageChange` ↔ `onChange` | — | P is controlled-only; Q supports both |

**Sidebar** (P Sidebar + 9 parts)
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `responsive` + mobile drawer, SidebarProvider, SidebarMobileTrigger, `useSidebarContext`, item `LinkComponent`/`target`/`rel` | `items`/`groups`, `value/defaultValue/onChange` (active item), `defaultCollapsed`, `collapsible`, `dividers`, `width`, `collapsedWidth`, `footer`, `badgeLabel`, `label` | `variant="compact"` ↔ `compact`, `mobileBreakpoint` ↔ `breakpoint`, SidebarGroup `defaultExpanded` ↔ group `defaultOpen` | — | Q `breakpoint` collapses to a rail; it does not open an off-canvas drawer |

**StepIndicator**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| step `id`, step `clickable` | `numerals`, `label`, `style` | `currentStep` ↔ `current` | status `pending\|active\|completed` → `upcoming\|current\|complete` | `onStepClick(index, step)` → `onStepClick(index)`. In Q only completed steps are clickable. P is forwardRef |

**Tabs** (P Tabs + TabList/Tab/TabPanels/TabPanel)
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| TabPanel/TabPanels, compound children | `fullWidth`, tab `count`, `panelId`, `label`/`aria-label`, `style` | `activeTab` ↔ `value`, `defaultTab` ↔ `defaultValue`, `onTabChange` ↔ `onChange`, Tab `id` ↔ tab `value` | — | Both support controlled and uncontrolled use. In Q the consumer must render the panel and set `panelId` for `aria-controls` |

### Overlays

**Drawer**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `showCloseButton`, `className` | `side`, `eyebrow`, `accent` | `isOpen` ↔ `open` | Q `size` also takes a number | P is a bottom sheet on mobile and has no focus trap. Q has a focus trap and inert background, and shows the × only when dismissible. **Q drops `className`/`style`** |

**DropdownMenu**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `open` (surface-only), item `id`, item `state` enum, item `checkbox`, divider `label` | `trigger`, `contextMenu`, `header`, `align`, `width`, `label`, `{group}` entries, item `danger` | item `onClick` ↔ item `onSelect`, `onItemClick` ↔ `onSelect`, `leftIcon` ↔ `icon` | item `state: disabled\|active` → booleans `disabled`/`active`. `size` drops `lg` | P must be composed inside a Popover; Q owns its trigger and open state. P forwardRef |

**Popover**
| P only | Q only | Renamed | Types | Behavior |
|---|---|---|---|---|
| `showClose`, `closeOnClickOutside`, `closeOnEscape`, `triggerClassName`, `unstyled` | `defaultOpen`, `width`, `style` | — | — | Both use `open`/`onOpenChange`; Q adds uncontrolled mode |

---

## 3. Cross-cutting conventions

| Axis | Proto | quiet today | **Recommended for quiet** | Why |
|---|---|---|---|---|
| Boolean flags | `isLoading`, `isFullWidth`, `isIconOnly`, `isAttached`, `isError`, but also `fullWidth`/`loading`/`disabled` elsewhere | No `is` prefix anywhere (`loading`, `fullWidth`, `attached`, `disabled`) | **Keep: no `is` prefix** (`loading`, `disabled`, `fullWidth`, `selected`, `attached`) | Matches HTML (`disabled`, `checked`, `open`) and Radix/React Aria. quiet is already consistent |
| Open / close (overlays) | `isOpen` + `onClose` (Modal, Drawer, CommandPalette); `open` + `onOpenChange` (Popover) | `open` + `onClose` (Dialog, Drawer, CommandPalette + `onOpen`); `open`/`defaultOpen`/`onOpenChange` (Popover) | **`open` / `defaultOpen` / `onOpenChange(open)`** everywhere; keep `onClose` as a convenience alias | One controlled-state shape for every overlay. `onOpenChange(true)` replaces CommandPalette's `onOpen` for the hotkey |
| Controlled state | Mixed: `activeTab/defaultTab/onTabChange`, `expanded/defaultExpanded/onExpandedChange`, `page/onPageChange`, `selected/defaultSelected/onSelectChange`; many controlled-only | `value` / `defaultValue` / `onChange` on 13 widgets; `expanded`/`onChange`, `page`/`defaultPage`/`onChange`, `checked`/`defaultChecked`/`onChange`, `selected`/`defaultSelected`/`onSelect` | **`<x>` / `default<X>` / `on<X>Change(next)`** for every stateful prop: `value`/`defaultValue`/`onValueChange`, `checked`/`defaultChecked`/`onCheckedChange`, `expanded`/…/`onExpandedChange`, `page`/…/`onPageChange`, `selected`/…/`onSelectedChange`, `sort`/…/`onSortChange`, `collapsed`/…/`onCollapsedChange`. Always offer the uncontrolled `default*` too | Q already uses this shape for `onOpenChange`, `onCollapsedChange`, `onSelectionChange` and `onSortChange`. Using it everywhere makes names predictable and frees `onChange` (next row) |
| `onChange` payload | Native event on native-backed controls; value on custom ones (FilterTabs, Dropdown, DatePicker, Stepper…) | Event on Input, Select, TextField and TextArea; **value** on Checkbox, Switch, Slider, Radio, Dropdown, MultiSelect, DatePicker, Tabs, FilterTabs, Pagination, Stepper, Sidebar, Accordion, FileUpload. `onChange` means two different things | **`onChange` is always the native event** (and only exists where a native element receives it). Value callbacks use `on<X>Change` (above). Native text controls *also* get `onValueChange(string)` | No component has two meanings for one prop name. Text inputs keep working with react-hook-form/Formik |
| Collections in payloads | `Set` (MultiSelect, DataGrid selection) | arrays | **Arrays** | Serializable, easy to compare, work with `useState` without cloning |
| Item identity | `id` for everything (Tab `id`, Dropdown item `id`) | `value` for selectable things, `id` for rows/commands | **`value` for anything that is a selection value; `id` only for row identity.** `options` for form pickers, `items` for nav/menus/lists | Q already follows this. It mirrors `<option value>` |
| Dismiss naming | `dismissible`+`onDismiss` (Alert default false, Banner default true), `closable`+`onClose` (Toast), `showCloseButton` vs `showClose` | `onDismiss` (Alert; presence = dismissible), `dismissible`+`onDismiss` (Banner), `onClose` (Toast), `dismissible`+`showClose` (Dialog), `dismissible` (Drawer) | **In-flow messages** (Alert, Banner, Toast): `onDismiss` whose presence shows the × (Banner `dismissible={false}` stays only as an override). **Overlays**: `dismissible` (Esc/scrim) + `showClose` (the ×). Tag keeps `onRemove` | "Dismiss" is the WAI/APG term for messages, and presence-implies-feature avoids the boolean-plus-callback pair. Overlays need the two separate knobs |
| Icon slots | `leftIcon`/`rightIcon` (Button, Badge, Link, Tag), `leftElement`/`rightElement` (Input), `leading`/`trailing` (ListItem), `icon` (block icon), `icon` boolean + `customIcon` (Alert) | `leftIcon`/`rightIcon` (Button, Badge, TextField, Link-right only), `icon` = icon-only Button, `icon` = Tag's leading icon, `icon` = block icon elsewhere, `leading`/`trailing` (List) | **`leftIcon`/`rightIcon`** for inline icons in any text-bearing control (Tag `icon` → `leftIcon`; add `leftIcon` to Link). **`icon`** only for a component's single block or status icon (Alert, EmptyState, StatCard, Dialog, items) and for icon-only Button. **`leading`/`trailing`** for arbitrary row content (List) | Both systems mostly use these names already. If quiet ever ships RTL, alias `startIcon`/`endIcon` then; renaming everything now isn't worth it |
| variant / tone / status / color | `variant` mixes visual style and semantic status (Badge, Tag, Alert); Banner splits into `type` + `variant`; `color` on Text/Icon | `variant` (visual: Button, Banner, Card-less; status: Alert, Progress, Toast, FormHint, Badge), `tone` (Rule, Spinner, Tag, Eyebrow), `status` (Banner, StatusDot, legacy Toast), `color` (Text, Icon) | **`variant` = visual treatment** (fill or outline, ink or paper). **`status` = semantic intent** (`info\|success\|warning\|error`). **`tone` = contrast on neutral items** (soft/ink, muted). **`color` = typography and icons only** | Banner already shows how to separate the axes. Alert, Toast and Progress would then read the same as Banner, and Badge could split `variant` from status |
| Error / help text | `isError` (boolean) + `errorMessage` + `helperText` | `error: boolean \| string` (Checkbox, Radio) or `ReactNode` (others); `helperText`, but `hint` on Input and FileUpload | **`error?: boolean \| ReactNode`** (true = invalid without a message) + **`helperText`** | One prop instead of `isError` + `errorMessage`. Rename `hint` → `helperText` |
| Accessible name | `aria-label` | `label` means *visible* text on fields but an *invisible* name on ButtonGroup, FilterTabs, Table, Banner, CommandPalette, Breadcrumb, NavBar, Pagination, Sidebar, StepIndicator, Tabs, DropdownMenu, Stepper and Skeleton; several components accept both `label` and `aria-label` | **`label` = visible text only; invisible names use `aria-label`** (passed through) | Fewer surprises: `label` should never be invisible. It matches the DOM |
| Size scale | `sm\|md\|lg` on controls; `xs…2xl` on Avatar/Icon/Spinner; `xs…5xl` on Text | Same scales. Tag, FilterTabs and DropdownMenu are `sm\|md` only; SectionHeader `md\|sm`, PageHero `lg\|md`; numbers allowed on Avatar/Icon/Spinner/Text/Container/Drawer | **Controls: `sm\|md\|lg`, default `md`, every control** (accept `lg` on Tag/FilterTabs/DropdownMenu even if it renders like `md`). **Content-scaled items (Avatar, Icon, Spinner, Text): `xs…2xl \| number`**. Section components may keep their own two-step scale | Migrations can't break on a size value, and the scale stays predictable |
| Polymorphism | `as: ElementType` on Text/Card/Container/Grid/Stack/PageShell/GridItem; SectionHeader `as` = heading tag; `LinkComponent` + `to` on Link and SidebarItem | `as` (intrinsic tags) on Text, Headline, Container, Grid, Col, Stack, PageShell; `as` = heading level on PageHero/SectionHeader; `headingLevel` number on EmptyState/Accordion/ProcessStep; `href` switches to `<a>` on Button/Card/StatCard/List/Sidebar | **`as` (intrinsic tag) on layout and typography only. Heading level is always `headingLevel: 1–6`** (deprecate `as` on PageHero/SectionHeader). **Router links**: one `linkComponent` on `QuietRoot` (or ThemeProvider), used whenever a component renders an `<a>` from `href` | `as` should mean the root element only. A single router hook covers ~10 href-capable components without per-component props |
| Ref | `forwardRef` on 20 primitives and fields; composites have none | None; under React 19 refs reach the DOM only via `...rest` on 10 components, and the `.d.ts` files don't declare `ref` | **Accept `ref` on every component** (React 19 prop) and declare `ref?: React.Ref<…>` in `.d.ts`. Target: the root for layout and display; **the focusable control** for form widgets (input, `role=checkbox/switch/slider` element, Dropdown trigger); the panel for Dialog, Drawer and Popover | Focus management, measuring and form libraries all need refs. React 19 makes this nearly free |
| Passthrough | Primitives extend HTML attrs; composites take only `className`. Field components put `className` on the wrapper and the rest on `<input>` | `className` + `style` on 64/68 (**Dialog, Drawer, CommandPalette and Tooltip have neither**); rest spread on 10. Input, Select, TextField and TextArea put **`className` on the native control but `style` on the wrapper** | **Every component: `className`, `style` and remaining HTML attrs (`id`, `data-*`, `aria-*`, handlers) on the root.** Field components: `className`/`style` on the root, other native attrs on the control, with `inputClassName`/`inputStyle` as escape hatches | Test ids, analytics attributes and custom aria need a predictable place to land. Splitting `className` and `style` across two elements is the most surprising current behaviour |
| Form participation | Native inputs → `name`/`value` submit | Checkbox, Switch, Slider, Radio, Dropdown, MultiSelect and DatePicker are ARIA widgets and **don't submit** | Add **`name`** (+ `required`, `form`) to custom widgets and render a hidden `<input>` | Lets plain `<form>` and server actions work. P apps relied on this for Checkbox, Switch, Slider and Radio |

---

## 4. Migration impact

### 4.1 Inside quiet (adopting §3)

**Process caveat (AGENTS.md):** quiet's `.jsx`/`.d.ts` are 1:1 copies of the Claude Design reference, and design changes are made there first. Renames and new props therefore belong in the reference, or in quiet's a11y layer as *additive aliases* that never change what renders at rest. Most of the changes below (callback aliases, `ref` and passthrough, `name` plus a hidden input) are additive and fit the layer. The `className`-to-root move and the `variant` → `status` split change the public API and should go through the reference.

Deprecated aliases are cheap here (accept the old prop, map it, and `console.warn` in dev) and **matter most where the old name was `onChange`**: it is the most-used prop and would fail silently.

| Component | Renames (old → new; *alias* = keep the old one deprecated) | Additions |
|---|---|---|
| Dialog | — | `defaultOpen`, `onOpenChange` (`onClose` kept), `className`, `style`, `ref`, attrs |
| Drawer | — | `defaultOpen`, `onOpenChange` (`onClose` kept), `showClose`, `className`, `style`, `ref`, attrs |
| CommandPalette | `onOpen` → `onOpenChange` (*alias*) | `defaultOpen`, `className`, `style` |
| Popover | — | `ref`, attrs |
| Tooltip | — | `className`, `style` |
| Checkbox | `onChange(checked)` → `onCheckedChange` (*alias*, **important**); `aria-label` stays and passes through | `name`, `value`, `required`, `ref` |
| Switch | `onChange(checked)` → `onCheckedChange` (*alias*, **important**) | `name`, `value`, `required`, `ref` |
| Slider | `onChange` → `onValueChange` (*alias*) | `name`, `ref` |
| Radio | `onChange` → `onValueChange` (*alias*) | `required`, `ref` (group) |
| Dropdown | `onChange` → `onValueChange` (*alias*) | `name`, `required`, `ref` |
| MultiSelect | `onChange` → `onValueChange` (*alias*) | `name`, `ref` |
| DatePicker | `onChange` → `onValueChange` (*alias*) | `name`, `ref` |
| Stepper | `onChange` → `onValueChange` (*alias*); `label` → `aria-label` | `name`, `ref` |
| FilterTabs | `onChange` → `onValueChange` (*alias*); `label` → `aria-label` | `ref` |
| Tabs | `onChange` → `onValueChange` (*alias*); `label` → `aria-label` | `ref` |
| Sidebar | `onChange` → `onValueChange` (*alias*); `label` → `aria-label` | `ref` |
| Pagination | `onChange` → `onPageChange` (*alias*); `label` → `aria-label` | `ref` |
| Accordion | `onChange` → `onExpandedChange` (*alias*) | `ref` |
| FileUpload | `onChange` → `onFilesChange` (*alias*); `hint` → `helperText` | controlled `files`, `name`, `ref` |
| Tag | `onSelect` → `onSelectedChange` (*alias*); `icon` → `leftIcon` (*alias*); `tone` → `variant` | `size="lg"`, `removeLabel` |
| TextField / TextArea / Input / Select | `className` moves to the root (**behavior change**; add `inputClassName`); Input `hint` → `helperText` (*alias*) | `onValueChange`, explicit `ref` typing |
| Link | — | `leftIcon` |
| Alert | `variant` → `status` (*alias*) | `ref`, attrs |
| Toast | `variant` → `status` (*alias*; drop legacy `status: live\|neutral`); `onClose` → `onDismiss` (*alias*) | `ref`, attrs |
| Progress | `variant` → `status` (*alias*) | `ref` |
| FormHint | `variant` → `status` (*alias*) | `ref` |
| Badge | optional: split status members out of `variant` into `status` | `ref`, attrs |
| PageHero, SectionHeader | `as` → `headingLevel` (*alias*) | — |
| ButtonGroup, Table, Banner, Breadcrumb, NavBar, StepIndicator, DropdownMenu, Skeleton | invisible `label` → `aria-label` (*alias*) | `ref`, attrs |
| All other components (≈ 30 display/layout) | — | `ref` + HTML attr passthrough only |
| Href-capable (Button, Link, ArrowLink, Card, StatCard, List, Sidebar, Breadcrumb, NavBar) | — | Use `QuietRoot linkComponent` |

**Size:** about **38 components get renames or behavior changes** (~45 prop renames, ~25 of them `onChange`/`label` moves needing aliases). **All 68** gain ref and passthrough, which is additive and non-breaking. With aliases, the only real breaking change is `className` moving to the root on the 4 native field components.

### 4.2 Apps moving from Proto to quiet — rename map

**Component names:** `Modal` → `Dialog` · `Navbar`+`NavLink` → `NavBar links[]` · `Divider` → `Rule` · `LinkButton` → `Button href` · `DataTable` → `DataGrid` · `Input` → `TextField` · `GridItem`/`Grid.Item` → `Col` · `Card*`/`List*`/`Table*`/`Tab*`/`Sidebar*` sub-parts → props/arrays (see §1.2).

**Global prop renames**

| Proto | quiet (today) | quiet (recommended) |
|---|---|---|
| `isLoading` | `loading` | `loading` |
| `isFullWidth` | `fullWidth` | `fullWidth` |
| `isAttached` | `attached` | `attached` |
| `isIconOnly` + icon child | `icon={…}` | same |
| `isError` + `errorMessage` | `error` | `error` |
| `isOpen` | `open` | `open` (+ `onOpenChange`) |
| `leftElement` / `rightElement` | `leftIcon` / `rightIcon` | same |
| `orientation="vertical"` (ButtonGroup) | `vertical` | same |
| `activeTab` / `defaultTab` / `onTabChange` | `value` / `defaultValue` / `onChange` | `onValueChange` |
| Tab `id` / items `id` (FilterTabs, Dropdown, MultiSelect) | `value` | same |
| `items` (Dropdown, MultiSelect) | `options` | same |
| `onExpandedChange` (Accordion) | `onChange` | `onExpandedChange` (**back to the P name**) |
| `totalPages` / `onPageChange` | `total` / `onChange` | `total` / `onPageChange` (**back to the P name**) |
| `onSelectChange` (Tag) | `onSelect` | `onSelectedChange` |
| `onFilesChange` (FileUpload) | `onChange` | `onFilesChange` (**back to the P name**) |
| Checkbox/Switch `onChange(e)` → `e.target.checked` | `onChange(checked)` | `onCheckedChange(checked)` |
| Slider `onChange(e)` → `+e.target.value` | `onChange(number)` | `onValueChange(number)` |
| `Set` payloads (MultiSelect, DataGrid) | arrays | arrays |
| `getRowId` / `getRowKey` | `rowKey` | same |
| column `id` / `cell` | `key` / `render` | same |
| `currentStep` | `current` | same |
| `minDate` / `maxDate` / `formatDate` / `firstDayOfWeek` | `min` / `max` / `format` / `weekStartsOn` | same |
| `variant` (Avatar shape) | `shape` | same |
| `variant` (Spinner) / `variant` (Tag) | `tone` | Spinner `tone`; Tag `variant` (`default\|ink`) |
| `type` (Banner) | `status` | same |
| `variant` (Alert/Toast/Progress) | `variant` | `status` |
| `position` (Tooltip) | `placement` | same |
| `showCloseButton` | `showClose` | same |
| `footer` (Modal) | `actions` | same |
| `action` + `secondaryAction` (EmptyState) | `actions` | same |
| `children` (Divider label) | `label` | same |
| `disableAnimation` (Skeleton) | `animate={false}` | same |
| `animate` (Grid, Stack, List, PageShell) | `animated` | same |
| `pageKey` / `type` (PageTransition) | `transitionKey` / `variant`; duration in **ms** | same |
| `strikethrough` (Text) | `strike` | same |
| `underlineOnHover` (Link) | `underline="hover"` | same |
| Stack `justify="between"` | `justify="space-between"` | same (or have quiet accept tokens) |
| `aria-label` (FilterTabs/TabList) | `label` | `aria-label` (**back to the P name**) |

Six recommended names return to Proto's spelling (`onExpandedChange`, `onPageChange`, `onFilesChange`, `aria-label`, and in spirit `onOpenChange` and `onSelectedChange`), which makes the Proto→quiet path easier.

**Default-value traps** (same prop, different default): Button `variant` (`default` → `primary`), Container `size` (`lg` → `xl`), Stack `gap` (`md` → `sm`), Slider `showValue` (`false` → `true`), FileUpload `multiple` (`false` → `true`), List `divided` (off → on), Breadcrumb separator (`›` → `/`), Spinner `label` (hidden → visible).

---

## 5. Gaps

### 5.1 Worth adding to quiet (Proto has, quiet lacks)

1. **Router integration**: Proto `LinkComponent` on Link and SidebarItem. Add a provider-level `linkComponent` (§3).
2. **Form participation** for the ARIA widgets: `name`/`value`/`required` with a hidden input (Checkbox, Switch, Slider, Radio, Dropdown, MultiSelect, DatePicker). Proto's native inputs had this for free.
3. **Ref forwarding** on all components, especially form controls (focus on error) and overlay panels.
4. **Controlled FileUpload** (`files` + `onFilesChange`) and `existingFiles`/`onRemoveExisting` for files already on the server. Real uploads need controlled progress.
5. **Toast stack**: Proto `ToastContainer` positioning/portal. Even without a queue, quiet needs a `Toaster`/`ToastRegion` with `position` and a portal, plus an imperative `toast()` helper.
6. **Tab panels**: a `TabPanel` (or a `panels`/`render` option) so `aria-controls`, labelling and hidden state come wired, instead of each consumer doing it with `panelId`.
7. **Table footer / totals row** and controlled row expansion (`expanded`/`onExpandedChange`); per-cell `colSpan`.
8. **Mobile sidebar**: an off-canvas drawer mode, an external trigger and `useSidebar()` (Proto SidebarProvider/SidebarMobileTrigger). Today quiet only collapses to a rail.
9. **Popover options**: `closeOnClickOutside`, `closeOnEscape`, `showClose`.
10. **CommandPalette `filterFn`** (fuzzy search, server results) and disabled items.
11. **Select field chrome**: `placeholder`, `helperText`/`error`, `size`, and per-option `disabled` on native Select. TextField/TextArea `hideLabel` (TextField has it, TextArea doesn't).
12. **Smaller items**: Text `nowrap`, Link `leftIcon`, Dropdown custom `trigger` and item `danger`, DatePicker `inline`, Breadcrumb home icon, Tag `size="lg"` and a remove label, Dialog `description` slot, Stack/Grid responsive values (or document that `minChildWidth`/Col spans replace them).

### 5.2 Proto gaps (quiet does, Proto lacks)

- **Real modal a11y**: Dialog and Drawer trap and restore focus and make the background `inert` (Proto Drawer had no trap; Proto Modal hard-coded colliding ids).
- **FormField auto-wiring** of `id`, `aria-describedby`, `aria-invalid` and `aria-required` into the child (Proto made consumers repeat ids).
- **Correct roles**: `role="switch"`, `role="tooltip"` + `aria-describedby`, combobox/listbox for Dropdown and CommandPalette, a radiogroup with roving focus for FilterTabs (Proto had a tablist without arrow keys), `aria-checked="mixed"` for indeterminate, and status-appropriate `alert`/`status` roles (Proto Alert was always `alert`).
- **Uncontrolled mode** on Pagination, DatePicker, MultiSelect, Dropdown, FilterTabs, Stepper, Popover (`defaultOpen`) and Sidebar (`defaultCollapsed`), where Proto was controlled-only.
- **Table**: built-in selection, controlled/uncontrolled sort with `manualSort`, named per-row controls (`rowLabel`) and an accessible `label`. **DataGrid**: search, title and actions toolbar.
- **Toast `duration`** auto-dismiss that pauses on hover or focus.
- **CommandPalette ⌘K hotkey**; DropdownMenu **context-menu mode** and its own trigger.
- **`headingLevel`** on EmptyState, Accordion and ProcessStep for a correct document outline; Breadcrumb, Pagination and Sidebar landmarks get descriptive names by default.
- **Icon-only Button warning** when there is no accessible name; Link `external` adds an sr-only "(opens in new tab)".
- **Skeleton `loading`/`children`** swap with fade-in, and an announced loading state.
- **Polite announcements** in FileUpload; type, size and count validation.
- **Data shape**: arrays instead of `Set`; string shorthands for options and tabs.
