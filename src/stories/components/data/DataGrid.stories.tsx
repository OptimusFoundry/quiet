import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Badge, type BadgeProps } from "../../../components/core/Badge";
import { Button } from "../../../components/core/Button";
import { Icon } from "../../../components/core/Icon";
import { DataGrid } from "../../../components/data/DataGrid";
import type { TableProps } from "../../../components/data/Table";
import { Column, Note, Row } from "../Story";
import { money, RUNS, type Run } from "./runs";
import "./DataGrid.scss";

const TONE: Record<Run["status"], BadgeProps["variant"]> = {
	Succeeded: "success",
	Running: "default",
	Failed: "error",
	"Waiting for approval": "warning",
};

// Rows are the app's own type: `DataGrid<Run, string>` types every render and the selected keys.
const COLUMNS: TableProps<Run, string>["columns"] = [
	{ key: "name", header: "Run", sortable: true },
	{ key: "runner", header: "Runner", nowrap: true, sortable: true },
	{
		key: "status",
		header: "Status",
		nowrap: true,
		render: (r) => <Badge variant={TONE[r.status]}>{r.status}</Badge>,
	},
	{ key: "started", header: "Started", nowrap: true },
	{ key: "cost", header: "Cost", align: "right", sortable: true, render: (r) => money(r.cost) },
];

const meta = {
	title: "Components/Data/DataGrid",
	component: DataGrid,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	// Plain columns here so the controls can drive it; the stories below use typed `DataGrid<Run, string>`.
	args: {
		title: "Runs",
		data: RUNS,
		columns: [
			{ key: "name", header: "Run", sortable: true },
			{ key: "runner", header: "Runner", nowrap: true },
			{ key: "status", header: "Status", nowrap: true },
			{ key: "duration", header: "Duration", align: "right", nowrap: true },
		],
		searchable: true,
		selectable: false,
		pageSize: 5,
		loading: false,
		size: "md",
	},
	argTypes: {
		columns: { control: false },
		data: { control: false },
		rowKey: { control: false },
		title: { control: "text" },
		actions: { control: false },
		emptyTitle: { control: "text" },
		emptyDescription: { control: "text" },
		emptyActions: { control: false },
		onSelectionChange: { control: false },
		onRowClick: { control: false },
		selected: { control: false },
		defaultSelected: { control: false },
	},
	decorators: [
		(Story) => (
			<div className="q-sb-data-grid">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof DataGrid>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Toolbar: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`title`, a contains-filter across every column (`searchable`) and `actions` on the right. Filtering resets to page one.",
			},
		},
	},
	render: () => (
		<DataGrid<Run, string>
			title="Runs"
			searchable
			searchPlaceholder="Filter runs"
			columns={COLUMNS}
			data={RUNS}
			pageSize={5}
			defaultSort={{ key: "cost", dir: "desc" }}
			actions={
				<Button size="sm" leftIcon={<Icon name="plus" />}>
					New run
				</Button>
			}
		/>
	),
};

function SelectionDemo() {
	const [selected, setSelected] = useState<string[]>([]);
	return (
		<Column wide>
			<DataGrid<Run, string>
				title="Runs"
				selectable
				selected={selected}
				onSelectionChange={setSelected}
				columns={COLUMNS}
				data={RUNS}
				pageSize={5}
				actions={
					<Button size="sm" variant="secondary" disabled={!selected.length}>
						Retry selected
					</Button>
				}
			/>
			<Row>
				<Button size="sm" variant="ghost" onClick={() => setSelected([])}>
					Clear selection
				</Button>
			</Row>
			<Note>Selection survives paging; the grid announces the count to screen readers.</Note>
		</Column>
	);
}

export const Selection: Story = {
	parameters: {
		docs: { description: { story: "Controlled with `selected` + `onSelectionChange`." } },
	},
	render: () => <SelectionDemo />,
};

export const Loading: Story = {
	parameters: {
		docs: { description: { story: "Skeleton rows; the footer and pages hide until data lands." } },
	},
	render: () => (
		<DataGrid<Run, string>
			title="Runs"
			searchable
			columns={COLUMNS}
			data={[]}
			loading
			pageSize={5}
		/>
	),
};

export const Empty: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"No rows shows an `EmptyState` with your `empty*` props; a filter with no match says so instead.",
			},
		},
	},
	render: () => (
		<DataGrid<Run, string>
			title="Runs"
			searchable
			columns={COLUMNS}
			data={[]}
			emptyTitle="No runs yet"
			emptyDescription="Runs you start in this workspace show up here."
			emptyActions={
				<Button size="sm" variant="secondary">
					Start a run
				</Button>
			}
		/>
	),
};

function RowClickDemo() {
	const [opened, setOpened] = useState<Run | null>(null);
	return (
		<Column wide>
			<DataGrid<Run, string>
				title="Approvals"
				columns={COLUMNS}
				data={RUNS.filter((r) => r.status === "Waiting for approval")}
				pageSize={0}
				onRowClick={setOpened}
			/>
			<Note>
				{opened
					? `Opened ${opened.name} (${opened.id}).`
					: "Click a row, or focus one and press Enter."}{" "}
				`pageSize={0}` turns paging off.
			</Note>
		</Column>
	);
}

export const RowClickNoPaging: Story = { render: () => <RowClickDemo /> };

type APIKey = {
	id: string;
	name: string;
	prefix: string;
	scope: string;
	lastUsed: string;
	requests: number;
};

const KEYS: APIKey[] = [
	{
		id: "k1",
		name: "Production",
		prefix: "qk_live_7Hd2",
		scope: "read, write",
		lastUsed: "2 minutes ago",
		requests: 184_220,
	},
	{
		id: "k2",
		name: "Staging",
		prefix: "qk_test_Lp91",
		scope: "read",
		lastUsed: "yesterday",
		requests: 9_310,
	},
];

// The actions column has no visible header, only a .q-sr-only name.
const KEY_COLUMNS: TableProps<APIKey, string>["columns"] = [
	{ key: "name", header: "Name", nowrap: true },
	{ key: "prefix", header: "Prefix", nowrap: true },
	{ key: "scope", header: "Scope", nowrap: true },
	{ key: "lastUsed", header: "Last used", nowrap: true },
	{
		key: "requests",
		header: "Requests",
		align: "right",
		render: (r) => r.requests.toLocaleString("en"),
	},
	{
		key: "actions",
		header: <span className="q-sr-only">Actions</span>,
		align: "right",
		render: (r) => (
			<Button size="sm" variant="secondary" aria-label={`Revoke ${r.name}`}>
				Revoke
			</Button>
		),
	},
];

export const TablePropsPassThrough: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Any other `Table` prop passes through: here `bordered` and `minWidth`, which scrolls the table sideways in a narrow pane.",
			},
		},
	},
	render: () => (
		<DataGrid<APIKey, string>
			title="API keys"
			bordered
			minWidth={900}
			columns={KEY_COLUMNS}
			data={KEYS}
		/>
	),
};
