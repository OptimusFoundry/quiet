import type { Meta, StoryObj } from "@storybook/react-vite";
import { type CSSProperties, useLayoutEffect, useRef, useState } from "react";
import { Col, Grid } from "../../index";
import { GuidePage, Mono, Part, Span } from "./Guide";

// docs/guidelines/grid.md as specimens: the allowed splits over the 12 columns, the responsive span
// rules at three container widths, and the fixed panes.

type Split = { name: string; cols: Array<{ span: number; start?: number }> };
const SPLITS: Split[] = [
	{ name: "12", cols: [{ span: 12 }] },
	{ name: "8 + 4", cols: [{ span: 8 }, { span: 4 }] },
	{ name: "6 + 6", cols: [{ span: 6 }, { span: 6 }] },
	{ name: "4 + 4 + 4", cols: [{ span: 4 }, { span: 4 }, { span: 4 }] },
	{ name: "3 × 4", cols: [{ span: 3 }, { span: 3 }, { span: 3 }, { span: 3 }] },
	{ name: "9 + 3", cols: [{ span: 9 }, { span: 3 }] },
	{ name: "5 + 6 from col 7", cols: [{ span: 5 }, { span: 6, start: 7 }] },
];

const COLUMN_IDS = ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "c11", "c12"];

const cell: CSSProperties = {
	height: "var(--q-space-5)",
	display: "flex",
	alignItems: "center",
	paddingLeft: "var(--q-space-1)",
	border: "var(--q-hairline) solid var(--q-fg)",
	borderRadius: "var(--q-radius-sm)",
	background: "var(--q-bg)",
	boxSizing: "border-box",
	minWidth: 0,
	overflow: "hidden",
};

/** The 12 columns behind a grid, using the same gap so the cells line up with them. */
function Columns() {
	return (
		<div
			aria-hidden="true"
			style={{
				position: "absolute",
				inset: 0,
				display: "grid",
				gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
				gap: "var(--q-space-3)",
			}}
		>
			{COLUMN_IDS.map((id) => (
				<span
					key={id}
					style={{ background: "var(--q-bg-subtle)", borderRadius: "var(--q-radius-xs)" }}
				/>
			))}
		</div>
	);
}

function SplitRow({ s }: { s: Split }) {
	return (
		<div style={{ display: "grid", gap: "var(--q-space-1)" }}>
			<Mono>{s.name}</Mono>
			<div style={{ position: "relative" }}>
				<Columns />
				<Grid
					columns={12}
					gap="md"
					rowGap="md"
					breakpoints={[0, 0]}
					style={{ position: "relative" }}
				>
					{s.cols.map((c, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: static specimen
						<Col key={i} span={c.span} start={c.start}>
							<div style={cell}>
								<Mono style={{ color: "var(--q-fg)" }}>{c.span}</Mono>
							</div>
						</Col>
					))}
				</Grid>
			</div>
		</div>
	);
}

function Frame({ width, cols }: { width: number; cols: Split["cols"] }) {
	const ref = useRef<HTMLDivElement>(null);
	const [w, setW] = useState(0);
	useLayoutEffect(() => {
		const el = ref.current;
		if (!el || typeof ResizeObserver === "undefined") return;
		const ro = new ResizeObserver(([e]) => setW(Math.round(e?.contentRect.width ?? 0)));
		ro.observe(el);
		return () => ro.disconnect();
	}, []);
	return (
		<div style={{ display: "grid", gap: "var(--q-space-1)", width: `min(${width}px, 100%)` }}>
			<Mono>grid {w}px wide</Mono>
			<div ref={ref}>
				<Grid columns={12} gap="md" rowGap="md">
					{cols.map((c, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: static specimen
						<Col key={i} span={c.span}>
							<div style={cell}>
								<Mono style={{ color: "var(--q-fg)" }}>span {c.span}</Mono>
							</div>
						</Col>
					))}
				</Grid>
			</div>
		</div>
	);
}

const PANES = [
	["--q-w-sidebar", "sidebar"],
	["--q-w-settings-nav", "settings nav"],
	["--q-w-list-pane", "list pane"],
	["--q-w-detail-panel", "detail panel"],
	["--q-w-form", "form / chat / prose"],
] as const;

function GridPage() {
	return (
		<GuidePage
			title="Grid"
			doc="grid.md"
			intro="Fixed panes hold navigation and tools. The 12-column grid holds content blocks. App gutter is 24; spans are 3 · 4 · 6 · 8 · 9 · 12."
		>
			<Part
				title="Allowed splits"
				rule="Blocks stacked on one page share column edges. 8 + 4 under 3 × 4 lines up at column 9."
			>
				<div style={{ display: "grid", gap: "var(--q-space-3)" }}>
					{SPLITS.map((s) => (
						<SplitRow key={s.name} s={s} />
					))}
				</div>
			</Part>
			<Part
				title="Responsive spans"
				rule="Grid measures its own width. ≥ 960: span. 720–960: spans under 4 become 6. Under 720: 12. Always pass rowGap."
			>
				<div style={{ display: "grid", gap: "var(--q-space-4)" }}>
					{[1000, 840, 560].map((w) => (
						<Frame key={w} width={w} cols={SPLITS[4]?.cols ?? []} />
					))}
					{[1000, 560].map((w) => (
						<Frame key={`m${w}`} width={w} cols={SPLITS[1]?.cols ?? []} />
					))}
				</div>
			</Part>
			<Part
				title="Fixed panes"
				rule="Never % or invented widths. Under 720 a pane leaves the layout (drawer or its own route)."
			>
				<div style={{ display: "grid", gap: "var(--q-space-1)", overflow: "hidden" }}>
					{PANES.map(([t, l]) => (
						<Span key={t} token={t} label={`${t} · ${l}`} />
					))}
				</div>
			</Part>
		</GuidePage>
	);
}

const meta: Meta = { title: "Guidelines/Grid", parameters: { layout: "fullscreen" } };
export default meta;
export const Default: StoryObj = { render: () => <GridPage /> };
