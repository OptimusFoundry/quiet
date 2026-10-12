import { Badge } from "../../../components/core/Badge";
import { DataGrid } from "../../../components/data/DataGrid";
import { EmptyState } from "../../../components/data/EmptyState";
import { List } from "../../../components/data/List";
import { StatCard } from "../../../components/data/StatCard";
import { Table, type TableProps } from "../../../components/data/Table";
import type { Tile } from "./types";

type Run = { id: string; name: string; runner: string; cost: string };

const RUNS: Run[] = [
	{ id: "run-482", name: "Reconcile invoices", runner: "eu-west-2", cost: "$4.20" },
	{ id: "run-481", name: "Draft vendor replies", runner: "us-east-1", cost: "$1.85" },
	{ id: "run-480", name: "Classify clauses", runner: "eu-west-2", cost: "$6.10" },
];

const COLUMNS: TableProps<Run, string>["columns"] = [
	{ key: "name", header: "Run", nowrap: true },
	{ key: "runner", header: "Runner", nowrap: true },
	{ key: "cost", header: "Cost", align: "right" },
];

export const tiles: Tile[] = [
	{
		name: "Table",
		blurb: "Sortable, selectable, expandable rows with faint dividers and no vertical rules.",
		wide: true,
		render: () => (
			<div className="q-sb-tile-stack">
				<Table<Run, string>
					label="Runs"
					size="sm"
					columns={COLUMNS}
					data={RUNS}
					defaultSort={{ key: "name", dir: "asc" }}
				/>
			</div>
		),
	},
	{
		name: "DataGrid",
		blurb: "A table with its title bar, filter, selection count, pages, loading and empty states.",
		wide: true,
		render: () => (
			<div className="q-sb-tile-stack">
				<DataGrid<Run, string>
					title="Runs"
					searchable
					size="sm"
					pageSize={0}
					columns={COLUMNS}
					data={RUNS.slice(0, 2)}
				/>
			</div>
		),
	},
	{
		name: "List",
		blurb: "Rows of primary and secondary text with trailing meta; clickable rows nudge an arrow.",
		render: () => (
			<div className="q-sb-tile-stack">
				<List
					size="sm"
					items={[
						{ id: 1, primary: "Ada Lovelace", secondary: "Owner", trailing: "2m ago" },
						{ id: 2, primary: "Grace Hopper", secondary: "Admin", trailing: "1h ago" },
						{
							id: 3,
							primary: "Alan Turing",
							secondary: "Member",
							trailing: <Badge>Invited</Badge>,
						},
					]}
				/>
			</div>
		),
	},
	{
		name: "StatCard",
		blurb: "A dashboard metric whose change is an arrow and words, never a colour.",
		render: () => (
			<div className="q-sb-tile-stack">
				<StatCard label="Runs this month" value={1204} delta={12} period="vs last month" />
			</div>
		),
	},
	{
		name: "EmptyState",
		blurb: "Nothing here yet: an icon, one honest sentence and the next step.",
		render: () => (
			<EmptyState
				size="sm"
				icon="file"
				title="No artifacts yet"
				description="Runs that produce files list them here."
			/>
		),
	},
];
