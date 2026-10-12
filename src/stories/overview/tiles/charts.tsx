import { BarChart } from "../../../components/charts/BarChart";
import { ChartLegend } from "../../../components/charts/ChartParts";
import { DonutChart } from "../../../components/charts/DonutChart";
import { LineChart } from "../../../components/charts/LineChart";
import { NarratedChart } from "../../../components/charts/NarratedChart";
import { Sparkline } from "../../../components/charts/Sparkline";
import { LAST_MONTH, RUNS } from "../../components/charts/fixtures";
import type { Tile } from "./types";

const WEEKS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];
const weekly = (d: number[]) => d.filter((_, i) => i % 3 === 0).slice(0, 8);

export const tiles: Tile[] = [
	{
		name: "LineChart",
		blurb: "Trends over time: the series that matters in the accent, comparisons in ink.",
		wide: true,
		render: () => (
			<div className="q-sb-tile-stack">
				<LineChart
					aria-label="Completed runs, this month against last"
					height={120}
					labels={WEEKS}
					legend={false}
					area
					series={[
						{ name: "This month", data: weekly(RUNS) },
						{ name: "Last month", data: weekly(LAST_MONTH) },
					]}
				/>
			</div>
		),
	},
	{
		name: "BarChart",
		blurb: "Compare categories, grouped or stacked, every bar a focusable mark.",
		wide: true,
		render: () => (
			<div className="q-sb-tile-stack">
				<BarChart
					aria-label="Runs by trigger"
					height={120}
					legend={false}
					categories={["Q1", "Q2", "Q3", "Q4"]}
					series={[
						{ name: "Scheduled", data: [420, 510, 640, 720] },
						{ name: "Manual", data: [180, 240, 260, 310] },
						{ name: "Webhook", data: [90, 120, 80, 140] },
					]}
				/>
			</div>
		),
	},
	{
		name: "DonutChart",
		blurb: "Share of a total, and only that; the largest share in the accent.",
		wide: true,
		render: () => (
			<DonutChart
				aria-label="Runs by runner"
				size={120}
				thickness={14}
				data={[
					{ label: "Hosted", value: 3120 },
					{ label: "Self-hosted", value: 1240 },
					{ label: "Local", value: 452 },
				]}
			/>
		),
	},
	{
		name: "Sparkline",
		blurb: "A word-sized trend for KPIs and table cells.",
		render: () => (
			<div className="q-sb-tile-row">
				<Sparkline data={weekly(RUNS)} width={96} height={32} aria-label="Completed runs" />
				<Sparkline
					data={[5.2, 4.8, 4.9, 4.1, 3.8, 3.6, 3.3, 3.1]}
					width={96}
					height={32}
					tone="neutral"
					aria-label="Failed runs"
				/>
			</div>
		),
	},
	{
		name: "ChartParts",
		blurb: "The legend, tooltip and hidden data table every quiet chart shares.",
		render: () => (
			<ChartLegend
				items={[{ name: "Scheduled" }, { name: "Manual" }, { name: "Webhook" }, { name: "Retry" }]}
				kind="line"
			/>
		),
	},
	{
		name: "NarratedChart",
		blurb: "A chart with its reading: each sentence marks the point it talks about.",
		wide: true,
		render: () => (
			<div className="q-sb-tile-stack">
				<NarratedChart
					aria-label="Completed runs, narrated"
					height={64}
					yTicks={2}
					labels={WEEKS}
					series={[{ name: "Completed runs", data: weekly(RUNS) }]}
					area
					beats={[{ text: "Scheduled runs switched on in week 4.", index: 3 }]}
				/>
			</div>
		),
	},
];
