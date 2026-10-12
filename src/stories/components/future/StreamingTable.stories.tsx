import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { Button } from "../../../components/core/Button";
import { Switch } from "../../../components/forms/Switch";
import { StreamingTable } from "../../../components/future/StreamingTable";
import "./StreamingTable.scss";

type Run = { id: number; name: string; runner: string; duration: number };

const PIPELINES = ["build-web", "test-api", "deploy-docs", "lint", "e2e-checkout", "bundle-size"];
const RUNNERS = ["eu-west-1", "us-east-2", "eu-west-2", "ap-south-1"];
const run = (n: number): Run => ({
	id: n,
	name: PIPELINES[n % PIPELINES.length] ?? "",
	runner: RUNNERS[n % RUNNERS.length] ?? "",
	duration: 20 + ((n * 37) % 160),
});
const COLUMNS = [
	{ key: "name", header: "Pipeline", render: (r: Run) => `${r.name} #${r.id}` },
	{ key: "runner", header: "Runner" },
	{
		key: "duration",
		header: "Took",
		align: "right" as const,
		render: (r: Run) => `${r.duration}s`,
	},
];
const START = [318, 317, 316, 315].map(run);

const meta: Meta<typeof StreamingTable<Run, number>> = {
	title: "Components/Agent & trust/StreamingTable",
	component: StreamingTable,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		rows: START,
		columns: COLUMNS,
		rowKey: "id",
		label: "Runs, newest first",
		size: "sm",
		maxRows: 8,
	},
	argTypes: {
		rows: { control: false },
		columns: { control: false },
		rowKey: { control: false },
		onPausedChange: { control: false },
		newLabel: { control: false },
		caption: { control: "text" },
		liveLabel: { control: "text" },
		pausedLabel: { control: "text" },
		pauseLabel: { control: "text" },
		resumeLabel: { control: "text" },
	},
	render: (args) => (
		<div className="q-sb-streaming-table">
			<StreamingTable<Run, number> {...args} />
		</div>
	),
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

function StreamDemo({ paused }: { paused?: boolean }) {
	const [rows, setRows] = useState(START);
	const [auto, setAuto] = useState(false);
	const arrive = () => setRows((r) => [run((r[0]?.id ?? 0) + 1), ...r].slice(0, 40));
	useEffect(() => {
		if (!auto) return;
		const t = setInterval(
			() => setRows((r) => [run((r[0]?.id ?? 0) + 1), ...r].slice(0, 40)),
			1600,
		);
		return () => clearInterval(t);
	}, [auto]);
	return (
		<div className="q-sb-streaming-table">
			<div className="q-sb-streaming-table__controls">
				<Button size="sm" variant="secondary" onClick={arrive}>
					A run finishes
				</Button>
				<Switch label="Stream every 1.6s" checked={auto} onChange={setAuto} />
			</div>
			<StreamingTable
				label="Runs, newest first"
				rows={rows}
				rowKey="id"
				maxRows={8}
				maxHeight={300}
				size="sm"
				defaultPaused={paused}
				columns={COLUMNS}
			/>
		</div>
	);
}

export const Live: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Rows arrive at the top and glow once. Scroll down, pause or put focus in the table and they wait behind a bar.",
			},
		},
	},
	render: () => <StreamDemo />,
};

export const StartsPaused: Story = {
	parameters: {
		docs: {
			description: { story: '`defaultPaused`: new rows collect behind "Show N new" until let in.' },
		},
	},
	render: () => <StreamDemo paused />,
};

export const WithCaption: Story = {
	args: { caption: "Runs on eu-west-1, newest first", label: undefined, size: "md" },
};

export const Empty: Story = { args: { rows: [] } };
