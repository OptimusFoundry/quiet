import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Table } from "../../../components/data/Table";
import { AnomalyRibbon } from "../../../components/future/AnomalyRibbon";
import { Column, Note } from "../Story";

// 60 days of runs per day, with three surprises.
const SPIKES: Record<number, number> = { 17: 38, 41: -26, 52: 24 };
const RUNS = Array.from({ length: 60 }, (_, i) => 40 + Math.sin(i / 5) * 8 + (SPIKES[i] ?? 0));
const ANOMALIES = Object.entries(SPIKES).map(([at, d]) => ({
	at: Number(at),
	label: `Sep ${Number(at) + 1}`,
	detail: `${d > 0 ? "+" : "−"}${Math.abs(d)} runs vs expected`,
}));

const meta = {
	title: "Components/Agent & trust/AnomalyRibbon",
	component: AnomalyRibbon,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		label: "Run volume anomalies",
		data: RUNS,
		anomalies: ANOMALIES,
		summary: "3 anomalies in 60 days",
	},
	argTypes: {
		anomalies: { control: false },
		data: { control: false },
		summary: { control: "text" },
		children: { control: false },
		onSelect: { control: false },
	},
	render: (args) => (
		<Column wide>
			<AnomalyRibbon {...args} />
		</Column>
	),
} satisfies Meta<typeof AnomalyRibbon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Selected: Story = {
	parameters: {
		docs: {
			description: {
				story: "A selected mark announces itself and lifts its neighbourhood in the series.",
			},
		},
	},
	args: { defaultSelected: 41 },
};

function ControlledRibbon() {
	const [at, setAt] = useState<number | null>(17);
	return (
		<Column wide>
			<AnomalyRibbon
				label="Run volume anomalies"
				data={RUNS}
				anomalies={ANOMALIES}
				summary="3 anomalies in 60 days"
				selected={at}
				onSelect={setAt}
			/>
			<Note>
				{at == null
					? "Nothing selected. Arrow keys move between marks; Enter selects."
					: `onSelect(${at}): scroll the run log to Sep ${at + 1}.`}
			</Note>
		</Column>
	);
}

export const Controlled: Story = {
	parameters: {
		docs: { description: { story: "`selected` + `onSelect`: use the position to jump there." } },
	},
	render: () => <ControlledRibbon />,
};

const INVOICES = [
	{ id: "INV-2041", workspace: "Northwind", amount: "$1,240.00" },
	{ id: "INV-2042", workspace: "Halcyon", amount: "$860.00" },
	{ id: "INV-2043", workspace: "Fieldnote", amount: "$12,900.00" },
	{ id: "INV-2044", workspace: "Kestrel", amount: "$379.00" },
	{ id: "INV-2045", workspace: "Pellucid", amount: "$0.00" },
	{ id: "INV-2046", workspace: "Ostra", amount: "$1,105.00" },
];

export const OverATable: Story = {
	parameters: {
		docs: {
			description: {
				story: "No `data`: pass `count` and render your own table as `children`, one mark per row.",
			},
		},
	},
	render: () => (
		<Column wide>
			<AnomalyRibbon
				label="Invoice anomalies"
				count={INVOICES.length}
				anomalies={[
					{ at: 2, label: "INV-2043", detail: "15× the workspace's usual invoice" },
					{ at: 4, label: "INV-2045", detail: "zero amount on an active plan" },
				]}
			>
				<Table
					label="October invoices"
					rowKey="id"
					columns={[
						{ key: "id", header: "Invoice" },
						{ key: "workspace", header: "Workspace" },
						{ key: "amount", header: "Amount", align: "right" },
					]}
					data={INVOICES}
				/>
			</AnomalyRibbon>
		</Column>
	),
};

export const NoAnomalies: Story = {
	args: { anomalies: [], summary: "Nothing unexpected in 60 days" },
};
