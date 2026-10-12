import { useEffect, useRef } from "react";
import { Badge, Button, DataGrid, EntityLink, Icon, Text } from "@optimusfoundry/quiet";

type Run = { id: string; trigger: string; project: string; status: string; runner: string; cost: number; activity: string };

const RUNS: Run[] = [
	{ id: "233f76c2", trigger: "web-message", project: "Assistant", status: "Idle", runner: "Orca", cost: 0.902049, activity: "6 hours ago" },
	{ id: "9b1e04aa", trigger: "jira.issue_created", project: "Support triage", status: "Working", runner: "Headless", cost: 0.1183, activity: "2 min ago" },
	{ id: "51c7d9e3", trigger: "slack.mention", project: "Assistant", status: "Awaiting you", runner: "Orca", cost: 0.064512, activity: "14 min ago" },
	{ id: "e04f2b19", trigger: "schedule.daily", project: "Weekly digest", status: "Failed", runner: "Headless", cost: 0.010002, activity: "Yesterday" },
	{ id: "7ac2d410", trigger: "github.pr_opened", project: "Code review", status: "Completed", runner: "Orca", cost: 0.348771, activity: "Yesterday" },
	{ id: "c90e3b57", trigger: "web-message", project: "Assistant", status: "Completed", runner: "Orca", cost: 0.221004, activity: "2 days ago" },
];
const VARIANT: Record<string, "default" | "success" | "warning" | "error"> = {
	"Awaiting you": "warning",
	Failed: "error",
	Completed: "success",
};

const columns = [
	{
		key: "trigger",
		header: "Run",
		sortable: true,
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
	{ key: "runner", header: "Runner", sortable: true },
	{ key: "cost", header: "Cost", align: "right" as const, sortable: true, render: (r: Run) => `$${r.cost.toFixed(6)}` },
	{ key: "activity", header: "Last activity", align: "right" as const, nowrap: true },
];

export const Runs = () => (
	<DataGrid<Run>
		title="Runs"
		size="sm"
		rowKey="id"
		data={RUNS}
		columns={columns}
		searchable
		searchPlaceholder="Search runs"
		pageSize={4}
		actions={
			<Button size="sm" leftIcon={<Icon name="plus" />}>
				New trigger
			</Button>
		}
	/>
);

// DataGrid owns its selection state (selected/defaultSelected aren't read), so tick two rows on mount.
export const Selectable = () => {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const boxes = ref.current?.querySelectorAll<HTMLElement>('tbody [role="checkbox"]');
		boxes?.[1]?.click();
		// The second toggle must see the first one's state, so it waits a tick.
		const t = setTimeout(() => boxes?.[2]?.click(), 0);
		return () => clearTimeout(t);
	}, []);
	return (
		<div ref={ref}>
			<DataGrid<Run> title="Runs" size="sm" rowKey="id" data={RUNS.slice(0, 4)} columns={columns} selectable defaultSort={{ key: "cost", dir: "desc" }} />
		</div>
	);
};

export const Loading = () => <DataGrid<Run> title="Runs" size="sm" rowKey="id" data={[]} columns={columns} loading loadingRows={3} />;

export const Empty = () => (
	<DataGrid<Run>
		title="Runs"
		size="sm"
		rowKey="id"
		data={[]}
		columns={columns}
		emptyTitle="No runs yet"
		emptyDescription="Runs start when a trigger fires."
		emptyActions={
			<Button size="sm" variant="secondary" leftIcon={<Icon name="plus" />}>
				Add a trigger
			</Button>
		}
	/>
);
