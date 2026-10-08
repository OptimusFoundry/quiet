import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button, Table } from "../../index";
import "./Table.scss";

// Additions on top of the Claude Design catalog (G12): footer / totals row, controlled
// expansion, per-cell colSpan.
const meta: Meta = { title: "Extensions/Table", parameters: { layout: "padded" } };
export default meta;

type Invoice = { id: string; client: string; hours: number; amount: number; note?: string };

const INVOICES: Invoice[] = [
	{ id: "inv-1", client: "Northwind", hours: 32, amount: 4800 },
	{ id: "inv-2", client: "Globex", hours: 18, amount: 2700 },
	{ id: "inv-3", client: "Initech", hours: 0, amount: 0, note: "Retainer paused until November." },
	{ id: "inv-4", client: "Umbrella", hours: 9, amount: 1350 },
];

const money = (n: number) => `€${n.toLocaleString("en")}`;
const sum = (rows: Invoice[], k: "hours" | "amount") => rows.reduce((t, r) => t + r[k], 0);

const columns = [
	{ key: "client", header: "Client", footer: "Total" },
	{
		key: "hours",
		header: "Hours",
		align: "right" as const,
		sortable: true,
		// A paused retainer has no figures: its note spans the hours and amount columns.
		colSpan: (r: Invoice) => (r.note ? 2 : undefined),
		render: (r: Invoice) => r.note ?? r.hours,
		footer: (rows: Invoice[]) => sum(rows, "hours"),
	},
	{
		key: "amount",
		header: "Amount",
		align: "right" as const,
		sortable: true,
		render: (r: Invoice) => money(r.amount),
		footer: (rows: Invoice[]) => money(sum(rows, "amount")),
	},
];

export const Footer: StoryObj = {
	render: () => (
		<div id="table-footer">
			<Table label="Invoices" columns={columns} data={INVOICES} footer="Figures exclude VAT." />
		</div>
	),
};

function ControlledDemo() {
	const [expanded, setExpanded] = useState<string[]>(["inv-2"]);
	return (
		<div id="table-expansion" className="q-sb-table">
			<div className="q-sb-table__actions">
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
				<output aria-label="Expanded rows">{expanded.join(", ") || "none"}</output>
			</div>
			<Table
				label="Invoices with detail"
				columns={columns}
				data={INVOICES}
				expanded={expanded}
				onExpandedChange={setExpanded}
				renderExpanded={(r: Invoice) => `Invoice ${r.id} for ${r.client}.`}
			/>
		</div>
	);
}

export const ControlledExpansion: StoryObj = { render: () => <ControlledDemo /> };

export const UncontrolledExpansion: StoryObj = {
	render: () => (
		<div id="table-uncontrolled">
			<Table
				label="Invoices, uncontrolled"
				columns={columns}
				data={INVOICES}
				selectable
				defaultExpanded={["inv-1"]}
				renderExpanded={(r: Invoice) => `Invoice ${r.id} for ${r.client}.`}
			/>
		</div>
	),
};
