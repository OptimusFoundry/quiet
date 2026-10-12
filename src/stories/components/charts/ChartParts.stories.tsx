import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChartLegend, ChartTable, ChartTooltip } from "../../../components/charts/ChartParts";
import { seriesColor } from "../../../components/charts/chart-utils";
import { Column, Note, Row } from "../Story";
import "./ChartParts.scss";

const SERIES = [
	{ name: "Scheduled" },
	{ name: "Manual" },
	{ name: "Webhook" },
	{ name: "Retry" },
	{ name: "Backfill" },
];

const meta = {
	title: "Components/Charts/ChartParts",
	component: ChartLegend,
	subcomponents: { ChartTooltip, ChartTable },
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"The pieces every quiet chart shares: the legend, the hover/keyboard tooltip and the visually hidden data table. The charts use them already; reach for them when you build a chart of your own so it reads and behaves like the rest.",
			},
		},
	},
	args: { items: SERIES.slice(0, 3), kind: "dot" },
} satisfies Meta<typeof ChartLegend>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const LegendKinds: Story = {
	parameters: {
		docs: {
			description: {
				story: "`line` for line charts (series 4–5 dash), `dot` for bars and donuts.",
			},
		},
	},
	render: () => (
		<Column>
			<Row label="dot">
				<ChartLegend items={SERIES} />
			</Row>
			<Row label="line">
				<ChartLegend items={SERIES} kind="line" />
			</Row>
		</Column>
	),
};

export const Tooltip: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`ChartTooltip` floats at (x, y) inside a positioned plot and flips left past 60% of `bounds.width`.",
			},
		},
	},
	render: () => (
		<Column wide>
			<div className="q-sb-chart-parts__plot">
				<ChartTooltip
					x={120}
					y={60}
					bounds={{ width: 760 }}
					title="Sep 14"
					rows={[
						{ name: "This month", value: "134", color: seriesColor(0) },
						{ name: "Last month", value: "70", color: seriesColor(1) },
					]}
				/>
			</div>
		</Column>
	),
};

export const HiddenTable: Story = {
	parameters: {
		docs: {
			description: {
				story: "`ChartTable` renders nothing visible: it is the chart's data for screen readers.",
			},
		},
	},
	render: () => (
		<Column>
			<ChartTable
				caption="Runs by trigger"
				columns={["Quarter", "Scheduled", "Manual"]}
				rows={[
					["Q1", 420, 180],
					["Q2", 510, 240],
				]}
			/>
			<Note>Inspect this story: a captioned table sits inside a `q-sr-only` wrapper.</Note>
		</Column>
	),
};
