import { Badge, EntityLink, Table, Text } from "@optimusfoundry/quiet";

type Run = { id: string; trigger: string; project: string; status: string; runner: string; cost: string; activity: string };

const RUNS: Run[] = [
	{ id: "233f76c2", trigger: "web-message", project: "Assistant", status: "Idle", runner: "Orca", cost: "$0.902049", activity: "6 hours ago" },
	{ id: "9b1e04aa", trigger: "jira.issue_created", project: "Support triage", status: "Working", runner: "Headless", cost: "$0.118300", activity: "2 min ago" },
	{ id: "51c7d9e3", trigger: "slack.mention", project: "Assistant", status: "Awaiting you", runner: "Orca", cost: "$0.064512", activity: "14 min ago" },
	{ id: "e04f2b19", trigger: "schedule.daily", project: "Weekly digest", status: "Failed", runner: "Headless", cost: "$0.010002", activity: "Yesterday" },
];
const VARIANT: Record<string, "default" | "warning" | "error"> = { "Awaiting you": "warning", Failed: "error" };

const columns = [
	{
		key: "trigger",
		header: "Run",
		render: (r: Run) => (
			<span style={{ display: "flex", flexDirection: "column" }}>
				<EntityLink href="#run" id={r.id}>
					{r.trigger}
				</EntityLink>
				<Text size="xs" color="muted">
					{r.project}
				</Text>
			</span>
		),
	},
	{ key: "status", header: "Status", render: (r: Run) => <Badge size="sm" variant={VARIANT[r.status] ?? "default"}>{r.status}</Badge> },
	{ key: "runner", header: "Runner" },
	{ key: "cost", header: "Cost", align: "right" as const },
	{ key: "activity", header: "Last activity", align: "right" as const, nowrap: true },
];

export const Runs = () => <Table<Run> label="Runs" size="sm" rowKey="id" data={RUNS} columns={columns} />;

export const Selectable = () => (
	<Table<Run> label="Runs" size="sm" rowKey="id" data={RUNS} columns={columns} selectable defaultSelected={["51c7d9e3"]} />
);

export const Loading = () => <Table<Run> label="Runs" size="sm" rowKey="id" data={[]} columns={columns} loading loadingRows={3} />;

export const Empty = () => (
	<Table<Run> label="Runs" size="sm" rowKey="id" data={[]} columns={columns} emptyText="No runs yet. They start when a trigger fires." />
);
