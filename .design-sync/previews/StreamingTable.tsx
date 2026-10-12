import { StreamingTable } from "@optimusfoundry/quiet";
import { useEffect, useState } from "react";

const box = { width: 560 } as const;

type Run = { id: number; run: string; trigger: string; runner: string; cost: string };
const TRIGGERS = ["web-message", "slack.mention", "schedule.daily", "web-message", "webhook.stripe"];
const RUNNERS = ["Orca", "Headless", "Orca", "Orca", "Headless"];
const run = (n: number): Run => ({
	id: n,
	run: `run-${8800 + n}`,
	trigger: TRIGGERS[n % TRIGGERS.length] ?? "",
	runner: RUNNERS[n % RUNNERS.length] ?? "",
	cost: `$${(0.0412 + ((n * 0.137) % 0.9)).toFixed(6)}`,
});

const columns = [
	{ key: "run", header: "Run", nowrap: true },
	{ key: "trigger", header: "Trigger" },
	{ key: "runner", header: "Runner" },
	{ key: "cost", header: "Cost", align: "right" as const },
];

export const Live = () => (
	<div style={box}>
		<StreamingTable
			label="Runs, newest first"
			rows={[6, 5, 4, 3, 2, 1].map(run)}
			rowKey="id"
			maxRows={8}
			size="sm"
			columns={columns}
		/>
	</div>
);

export const PausedWithWaiting = () => {
	const [rows, setRows] = useState(() => [4, 3, 2, 1].map(run));
	useEffect(() => {
		const t = setTimeout(() => setRows((r) => [7, 6, 5].map(run).concat(r)), 50);
		return () => clearTimeout(t);
	}, []);
	return (
		<div style={box}>
			<StreamingTable
				label="Runs, newest first"
				rows={rows}
				rowKey="id"
				defaultPaused
				size="sm"
				columns={columns}
			/>
		</div>
	);
};

export const Caption = () => (
	<div style={box}>
		<StreamingTable
			caption="Approvals waiting on Ada Park"
			rows={[
				{ id: 3, what: "Refund $41.99 to Mira Osei", agent: "Meerkat", age: "2 min" },
				{ id: 2, what: "Publish competitor-pricing.md", agent: "Orca", age: "14 min" },
				{ id: 1, what: "Rerun run-8812 on Headless", agent: "Meerkat", age: "1 h" },
			]}
			columns={[
				{ key: "what", header: "Action" },
				{ key: "agent", header: "Agent" },
				{ key: "age", header: "Waiting", align: "right" },
			]}
		/>
	</div>
);
