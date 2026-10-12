import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkline } from "../../../components/charts/Sparkline";
import { Column, Note, Row } from "../Story";
import { RUNS } from "./fixtures";
import "./Sparkline.scss";

const meta = {
	title: "Components/Charts/Sparkline",
	component: Sparkline,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		data: [9.1, 9.4, 10.2, 10.8, 11.5, 12.1, 12.6, 13.2],
		"aria-label": "Monthly spend",
		tone: "accent",
		width: 96,
		height: 24,
	},
	argTypes: {
		formatValue: { control: false },
	},
} satisfies Meta<typeof Sparkline>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
	parameters: {
		docs: {
			description: {
				story: "The accent for the figure that matters; neutral (ink) for secondary figures.",
			},
		},
	},
	render: () => (
		<Row>
			<Sparkline data={RUNS} aria-label="Completed runs" />
			<Sparkline data={RUNS} tone="neutral" aria-label="Completed runs" />
			<Sparkline data={RUNS} area aria-label="Completed runs" />
			<Sparkline data={RUNS} dot={false} aria-label="Completed runs" />
		</Row>
	),
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
	tone?: "accent" | "neutral";
}) {
	return (
		<div className="q-sb-sparkline__kpi">
			<span className="q-sb-sparkline__kpi-label">{label}</span>
			<div className="q-sb-sparkline__kpi-row">
				<span className="q-sb-sparkline__kpi-value">{value}</span>
				<Sparkline data={data} tone={tone} aria-label={`${label}, last 24 days`} />
			</div>
		</div>
	);
}

export const KpiRow: Story = {
	parameters: {
		docs: {
			description: {
				story: "Screen readers hear one sentence per sparkline: from, to, low, high.",
			},
		},
	},
	render: () => (
		<div className="q-sb-sparkline__kpis">
			<Kpi label="Completed runs" value="4,812" data={RUNS} />
			<Kpi
				label="Failed runs"
				value="3.1%"
				data={[5.2, 4.8, 4.9, 4.1, 3.8, 3.6, 3.3, 3.1]}
				tone="neutral"
			/>
			<Kpi
				label="Agent spend"
				value="$13.2k"
				data={[9.1, 9.4, 10.2, 10.8, 11.5, 12.1, 12.6, 13.2]}
			/>
		</div>
	),
};

export const Inline: Story = {
	parameters: {
		docs: { description: { story: "A trend the size of a word, inside a sentence." } },
	},
	render: () => (
		<span className="q-sb-sparkline__inline">
			Runs this week{" "}
			<Sparkline data={RUNS.slice(-7)} width={56} height={16} aria-label="Runs this week" />
			<strong className="q-sb-sparkline__strong">+12%</strong>
		</span>
	),
};

export const GapsAndEmpty: Story = {
	parameters: {
		docs: {
			description: {
				story: "`null` breaks the line (a day the runner was offline); no data draws nothing.",
			},
		},
	},
	render: () => (
		<Column>
			<Row label="With a gap">
				<Sparkline data={[12, 14, 13, null, null, 16, 18, 17]} aria-label="Runner uptime" />
			</Row>
			<Row label="No data">
				<Sparkline data={[]} aria-label="No runs yet" />
			</Row>
			<Note>The last non-null point carries the dot.</Note>
		</Column>
	),
};
