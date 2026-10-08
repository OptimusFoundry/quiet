import type { Meta, StoryObj } from "@storybook/react-vite";
import { type CSSProperties, useLayoutEffect, useRef, useState } from "react";
import { Col, Grid } from "../../index";
import type { TokenName } from "../../styles/tokens.generated";
import { GuidePage, Mono, Part, Span } from "./Guide";
import "./Grid.scss";

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

/** The 12 columns behind a grid, using the same gap so the cells line up with them. */
function Columns() {
	return (
		<div aria-hidden="true" className="q-sb-grid__columns">
			{COLUMN_IDS.map((id) => (
				<span key={id} className="q-sb-grid__column" />
			))}
		</div>
	);
}

function SplitRow({ s }: { s: Split }) {
	return (
		<div className="q-sb-grid__split">
			<Mono>{s.name}</Mono>
			<div className="q-sb-grid__split-stage">
				<Columns />
				<Grid
					columns={12}
					gap="md"
					rowGap="md"
					breakpoints={[0, 0]}
					className="q-sb-grid__split-grid"
				>
					{s.cols.map((c, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: static specimen
						<Col key={i} span={c.span} start={c.start}>
							<div className="q-sb-grid__cell">
								<Mono className="q-sb-grid__cell-label">{c.span}</Mono>
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
		<div className="q-sb-grid__frame" style={{ "--_w": `${width}px` } as CSSProperties}>
			<Mono>grid {w}px wide</Mono>
			<div ref={ref}>
				<Grid columns={12} gap="md" rowGap="md">
					{cols.map((c, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: static specimen
						<Col key={i} span={c.span}>
							<div className="q-sb-grid__cell">
								<Mono className="q-sb-grid__cell-label">span {c.span}</Mono>
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
] as const satisfies ReadonlyArray<readonly [TokenName, string]>;

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
				<div className="q-sb-grid__splits">
					{SPLITS.map((s) => (
						<SplitRow key={s.name} s={s} />
					))}
				</div>
			</Part>
			<Part
				title="Responsive spans"
				rule="Grid measures its own width. ≥ 960: span. 720–960: spans under 4 become 6. Under 720: 12. Always pass rowGap."
			>
				<div className="q-sb-grid__frames">
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
				<div className="q-sb-grid__panes">
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
