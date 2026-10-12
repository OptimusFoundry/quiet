import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Badge, type BadgeProps } from "../../../components/core/Badge";
import { Button } from "../../../components/core/Button";
import { Table, type TableProps } from "../../../components/data/Table";
import { Column, Note, Row } from "../Story";
import { money, RUNS, type Run } from "./runs";
import "./Table.scss";

const TONE: Record<Run["status"], BadgeProps["variant"]> = {
	Succeeded: "success",
	Running: "default",
	Failed: "error",
	"Waiting for approval": "warning",
};

// Rows are the app's own type: `Table<Run, string>` types every render, sortValue and key.
const COLUMNS: TableProps<Run, string>["columns"] = [
	{ key: "name", header: "Run", sortable: true },
	{ key: "runner", header: "Runner", nowrap: true },
	{
		key: "status",
		header: "Status",
		nowrap: true,
		render: (r) => <Badge variant={TONE[r.status]}>{r.status}</Badge>,
	},
	{ key: "duration", header: "Duration", align: "right", nowrap: true },
	{ key: "cost", header: "Cost", align: "right", sortable: true, render: (r) => money(r.cost) },
];

const FIVE = RUNS.slice(0, 5);

const meta = {
	title: "Components/Data/Table",
	component: Table,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	// Plain columns here so the controls can drive it; the stories below use typed `Table<Run, string>`.
	args: {
		label: "Runs",
		data: FIVE,
		columns: [
			{ key: "name", header: "Run" },
			{ key: "runner", header: "Runner", nowrap: true },
			{ key: "status", header: "Status", nowrap: true },
			{ key: "duration", header: "Duration", align: "right" },
		],
		size: "md",
		striped: false,
		bordered: false,
		selectable: false,
		loading: false,
	},
	argTypes: {
		columns: { control: false },
		data: { control: false },
		rowKey: { control: false },
		caption: { control: "text" },
		footer: { control: "text" },
		emptyText: { control: "text" },
		renderExpanded: { control: false },
		rowLabel: { control: false },
		onSelectionChange: { control: false },
		onSortChange: { control: false },
		onExpandedChange: { control: false },
		onRowClick: { control: false },
		selected: { control: false },
		defaultSelected: { control: false },
		expanded: { control: false },
		defaultExpanded: { control: false },
		sort: { control: false },
		defaultSort: { control: false },
	},
} satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sorting: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`sortable` columns cycle ascending, descending, off. `defaultSort` sets the first order; `manualSort` only reports it, for server sorting.",
			},
		},
	},
	render: () => (
		<Table<Run, string>
			label="Runs by cost"
			columns={COLUMNS}
			data={FIVE}
			defaultSort={{ key: "cost", dir: "desc" }}
		/>
	),
};

export const Density: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`size` sets the row height; `striped` and `bordered` (an outer frame) are optional.",
			},
		},
	},
	render: () => (
		<Column wide>
			<Note>size sm, striped</Note>
			<Table<Run, string> label="Runs, small" size="sm" striped columns={COLUMNS} data={FIVE} />
			<Note>size lg, bordered</Note>
			<Table<Run, string>
				label="Runs, large"
				size="lg"
				bordered
				columns={COLUMNS}
				data={FIVE.slice(0, 3)}
			/>
		</Column>
	),
};

function SelectionDemo() {
	const [selected, setSelected] = useState<string[]>(["run-481"]);
	return (
		<Column wide>
			<Table<Run, string>
				label="Runs to retry"
				columns={COLUMNS}
				data={FIVE}
				selectable
				selected={selected}
				onSelectionChange={setSelected}
			/>
			<Row>
				<Button size="sm" disabled={!selected.length}>
					Retry {selected.length === 1 ? "1 run" : `${selected.length} runs`}
				</Button>
				<Button size="sm" variant="ghost" onClick={() => setSelected([])}>
					Clear
				</Button>
			</Row>
			<Note>Space toggles a checkbox; the header box selects every row on the page.</Note>
		</Column>
	);
}

export const Selection: Story = {
	parameters: {
		docs: { description: { story: "Controlled with `selected` + `onSelectionChange`." } },
	},
	render: () => <SelectionDemo />,
};

type Invoice = { id: string; client: string; hours: number; amount: number; note?: string };

const INVOICES: Invoice[] = [
	{ id: "inv-1041", client: "Northwind", hours: 32, amount: 4800 },
	{ id: "inv-1042", client: "Globex", hours: 18, amount: 2700 },
	{
		id: "inv-1043",
		client: "Initech",
		hours: 0,
		amount: 0,
		note: "Retainer paused until November.",
	},
	{ id: "inv-1044", client: "Umbrella", hours: 9, amount: 1350 },
];

const euro = (n: number) => `€${n.toLocaleString("en")}`;
const sum = (rows: Invoice[], k: "hours" | "amount") => rows.reduce((t, r) => t + r[k], 0);

const INVOICE_COLUMNS: TableProps<Invoice, string>["columns"] = [
	{ key: "client", header: "Client", footer: "Total" },
	{
		key: "hours",
		header: "Hours",
		align: "right",
		sortable: true,
		// A paused retainer has no figures: its note spans the hours and amount columns.
		colSpan: (r) => (r.note ? 2 : undefined),
		render: (r) => r.note ?? r.hours,
		footer: (rows) => sum(rows, "hours"),
	},
	{
		key: "amount",
		header: "Amount",
		align: "right",
		sortable: true,
		render: (r) => euro(r.amount),
		footer: (rows) => euro(sum(rows, "amount")),
	},
];

function ExpansionDemo() {
	const [expanded, setExpanded] = useState<string[]>(["inv-1042"]);
	return (
		<Column wide>
			<Row>
				<Button
					size="sm"
					variant="secondary"
					onClick={() => setExpanded(INVOICES.map((r) => r.id))}
				>
					Expand all
				</Button>
				<Button size="sm" variant="secondary" onClick={() => setExpanded([])}>
					Collapse all
				</Button>
			</Row>
			<Table<Invoice, string>
				label="Invoices with detail"
				columns={INVOICE_COLUMNS}
				data={INVOICES}
				expanded={expanded}
				onExpandedChange={setExpanded}
				renderExpanded={(r) => `Invoice ${r.id} for ${r.client}, sent on the 1st.`}
			/>
			<Note>
				Expanded: {expanded.join(", ") || "none"}. Without `expanded`, pass `defaultExpanded` and
				the table keeps its own.
			</Note>
		</Column>
	);
}

export const ExpandableRows: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`renderExpanded` adds a disclosure per row; `expanded` + `onExpandedChange` control it.",
			},
		},
	},
	render: () => <ExpansionDemo />,
};

export const TotalsAndSpans: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`columns[].footer` adds a totals row (a function gets the rows in display order), `footer` a full-width line, `colSpan` lets a cell cover the next ones.",
			},
		},
	},
	render: () => (
		<Column wide>
			<Table<Invoice, string>
				label="Invoices"
				columns={INVOICE_COLUMNS}
				data={INVOICES}
				footer="Figures exclude VAT."
			/>
		</Column>
	),
};

export const LoadingAndEmpty: Story = {
	render: () => (
		<Column wide>
			<Note>loading</Note>
			<Table<Run, string>
				label="Runs, loading"
				columns={COLUMNS}
				data={[]}
				loading
				loadingRows={3}
			/>
			<Note>empty</Note>
			<Table<Run, string>
				label="Runs, none"
				columns={COLUMNS}
				data={[]}
				emptyText="No runs in this workspace yet."
			/>
		</Column>
	),
};

function RowClickDemo() {
	const [opened, setOpened] = useState<string | null>(null);
	return (
		<Column wide>
			<Table<Run, string>
				label="Recent runs"
				columns={COLUMNS}
				data={FIVE.slice(0, 3)}
				onRowClick={(r) => setOpened(r.id)}
			/>
			<Note>{opened ? `Opened ${opened}.` : "Click a row, or focus one and press Enter."}</Note>
		</Column>
	);
}

export const RowClick: Story = { render: () => <RowClickDemo /> };

type APIKey = {
	id: string;
	name: string;
	prefix: string;
	scope: string;
	created: string;
	lastUsed: string;
	requests: number;
};

const KEYS: APIKey[] = [
	{
		id: "k1",
		name: "Production",
		prefix: "qk_live_7Hd2",
		scope: "read, write",
		created: "12 Mar 2026",
		lastUsed: "2 minutes ago",
		requests: 184_220,
	},
	{
		id: "k2",
		name: "Staging",
		prefix: "qk_test_Lp91",
		scope: "read",
		created: "3 Jun 2026",
		lastUsed: "yesterday",
		requests: 9_310,
	},
];

// The actions column has no visible header, only a .q-sr-only name, like most row-action columns.
const KEY_COLUMNS: TableProps<APIKey, string>["columns"] = [
	{ key: "name", header: "Name", nowrap: true },
	{ key: "prefix", header: "Prefix", nowrap: true },
	{ key: "scope", header: "Scope", nowrap: true },
	{ key: "created", header: "Created", nowrap: true },
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

export const WideAndScrolling: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`minWidth` scrolls the table sideways in a narrow pane instead of squeezing it. A row-actions column names itself with `q-sr-only`.",
			},
		},
	},
	render: () => (
		<div className="q-sb-table">
			<Table<APIKey, string> label="API keys" columns={KEY_COLUMNS} data={KEYS} minWidth={900} />
		</div>
	),
};
