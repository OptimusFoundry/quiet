import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { BarChart } from "../../components/charts/BarChart";
import { DonutChart } from "../../components/charts/DonutChart";
import { LineChart } from "../../components/charts/LineChart";
import { NarratedChart } from "../../components/charts/NarratedChart";
import { Sparkline } from "../../components/charts/Sparkline";
import { Concept, FuturePage, Spec } from "./Concept";

// quiet's chart set: hand-rolled SVG, molten carries the data (series 1), ink and greys compare.
// Narrated chart is Future concept 21, rebuilt on quiet.
const DAYS = Array.from({ length: 24 }, (_, i) => `Sep ${i + 1}`);
const SIGNUPS = [
	42, 51, 38, 64, 72, 58, 80, 91, 77, 102, 96, 120, 88, 134, 141, 126, 150, 162, 148, 171, 180, 166,
	192, 204,
];
const LAST_MONTH = [
	40, 44, 41, 47, 52, 49, 55, 58, 54, 61, 63, 60, 66, 70, 68, 72, 75, 71, 78, 80, 77, 83, 85, 88,
];
const usd = (v: number) => `$${v >= 1000 ? `${(v / 1000).toFixed(1).replace(/\.0$/, "")}k` : v}`;

const kpi: CSSProperties = {
	display: "grid",
	gap: 6,
	minWidth: 200,
	padding: "16px 20px",
	border: "1px solid var(--q-border)",
	borderRadius: "var(--q-radius-md)",
};
const kpiLabel: CSSProperties = {
	fontFamily: "var(--q-font-mono)",
	fontSize: "var(--q-text-3xs)",
	letterSpacing: "var(--q-tracking-mono)",
	textTransform: "uppercase",
	color: "var(--q-fg-muted)",
};
const kpiRow: CSSProperties = {
	display: "flex",
	alignItems: "flex-end",
	justifyContent: "space-between",
	gap: 16,
};
const kpiValue: CSSProperties = {
	fontSize: "var(--q-text-2xl)",
	fontWeight: 700,
	letterSpacing: "var(--q-tracking-tight)",
	lineHeight: 1,
	fontVariantNumeric: "tabular-nums",
};

function Kpi({
	label,
	value,
	data,
	tone,
}: {
	label: string;
	value: string;
	data: number[];
	tone?: "accent" | "ink";
}) {
	return (
		<div style={kpi}>
			<span style={kpiLabel}>{label}</span>
			<div style={kpiRow}>
				<span style={kpiValue}>{value}</span>
				<Sparkline data={data} tone={tone} aria-label={`${label}, last 24 days`} />
			</div>
		</div>
	);
}

function Charts() {
	return (
		<FuturePage
			title="Charts"
			intro="Hand-drawn SVG charts on quiet tokens. Molten carries the data — the series you care about — while comparisons sit in ink and grey, grids stay hairline and every value is reachable by keyboard."
		>
			<Concept
				id="sparkline"
				index={1}
				name="Sparkline"
				from="KPI deltas, tiny static charts"
				idea="A trend the size of a word. Molten by default with the latest point dotted; a quieter ink tone for secondary figures. Screen readers hear one sentence: from, to, low, high."
			>
				<Spec label="KPI row">
					<Kpi label="Verified signups" value="4,812" data={SIGNUPS} />
					<Kpi
						label="Bounce rate"
						value="3.1%"
						data={[5.2, 4.8, 4.9, 4.1, 3.8, 3.6, 3.3, 3.1]}
						tone="ink"
					/>
					<Kpi label="MRR" value="$13.2k" data={[9.1, 9.4, 10.2, 10.8, 11.5, 12.1, 12.6, 13.2]} />
				</Spec>
				<Spec label="Inline">
					<span
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 8,
							fontSize: "var(--q-text-sm)",
						}}
					>
						Signups this week{" "}
						<Sparkline
							data={SIGNUPS.slice(-7)}
							width={56}
							height={16}
							aria-label="Signups this week"
						/>
						<strong style={{ fontWeight: 600 }}>+12%</strong>
					</span>
				</Spec>
			</Concept>

			<Concept
				id="line-chart"
				index={2}
				name="Line chart"
				from="Static image charts"
				idea="This month in molten over last month in ink. Hover or focus the plot and use the arrow keys — the same crosshair moves either way, and the values are read out as you go."
			>
				<Spec label="Two series, area" col>
					<LineChart
						title="Verified signups · September"
						labels={DAYS}
						series={[
							{ name: "This month", data: SIGNUPS },
							{ name: "Last month", data: LAST_MONTH },
						]}
						area
						reference={{ value: 150, label: "Target 150/day" }}
					/>
				</Spec>
				<Spec label="Four series" col>
					<LineChart
						title="Weekly active by plan"
						height={200}
						labels={["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"]}
						series={[
							{ name: "Pro", data: [320, 340, 365, 390, 402, 431, 455, 470] },
							{ name: "Team", data: [210, 214, 230, 228, 240, 251, 249, 262] },
							{ name: "Starter", data: [150, 160, 158, 170, 176, 171, 182, 190] },
							{ name: "Trial", data: [90, 120, 104, 98, 130, 112, 125, 118] },
						]}
					/>
				</Spec>
			</Concept>

			<Concept
				id="bar-chart"
				index={3}
				name="Bar chart"
				from="Static image charts"
				idea="Grouped to compare, stacked to total. Rounded data ends, square to the baseline, with a 2px surface gap between fills. Every bar is a focusable mark: tab in once, then arrows."
			>
				<Spec label="Grouped" col>
					<BarChart
						title="Signups by channel"
						categories={["Q1", "Q2", "Q3", "Q4"]}
						series={[
							{ name: "Organic", data: [420, 510, 640, 720] },
							{ name: "Referral", data: [180, 240, 260, 310] },
							{ name: "Paid", data: [90, 120, 80, 140] },
						]}
					/>
				</Spec>
				<Spec label="Stacked, horizontal" col>
					<BarChart
						title="Agent spend by kind of work"
						orientation="horizontal"
						stacked
						valueLabels
						formatValue={usd}
						categories={["Meerkat", "Tickuptoks", "Research", "Orca"]}
						series={[
							{ name: "Replying", data: [240, 80, 30, 120] },
							{ name: "Drafting", data: [110, 140, 60, 40] },
							{ name: "Rendering", data: [20, 400, 0, 60] },
						]}
					/>
				</Spec>
			</Concept>

			<Concept
				id="donut-chart"
				index={4}
				name="Donut chart"
				from="Pie charts"
				idea="For share of a total, and only that. The largest share is molten, the rest step through ink and grey; the centre turns into the active segment's share on hover or focus."
			>
				<Spec label="Revenue by plan">
					<DonutChart
						title="MRR by plan"
						formatValue={usd}
						data={[
							{ label: "Pro", value: 9400 },
							{ label: "Team", value: 2600 },
							{ label: "Starter", value: 900 },
							{ label: "Add-ons", value: 300 },
						]}
					/>
				</Spec>
			</Concept>

			<Concept
				id="narrated-chart"
				index={21}
				name="Narrated chart"
				from="Chart + caption"
				idea="A chart that comes with its reading. Each sentence is a button that marks the point or stretch it talks about, so the story and the evidence stay side by side. The narration is written for you, not by the chart."
			>
				<Spec label="Signups" col>
					<NarratedChart
						title="Verified signups · September"
						labels={DAYS}
						series={[{ name: "Signups", data: SIGNUPS }]}
						area
						beats={[
							{ text: "Quiet first week, around 50 a day.", range: [0, 6] },
							{ text: "Product Hunt on the 10th: nearly doubled.", index: 9 },
							{ text: "Dip on the 13th when verification emails bounced.", index: 12 },
							{ text: "Recovered and climbing. Best day: 204.", index: 23 },
						]}
					/>
				</Spec>
			</Concept>
		</FuturePage>
	);
}

const meta: Meta = { title: "Charts", component: Charts, parameters: { layout: "fullscreen" } };
export default meta;
export const All: StoryObj = {};
