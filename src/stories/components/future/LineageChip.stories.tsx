import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../../components/core/Button";
import { LineageChip, type LineageStep } from "../../../components/future/LineageChip";
import { Column, Row } from "../Story";
import "./LineageChip.scss";

const FRESH: LineageStep[] = [
	{ label: "runs.events" },
	{ label: "stripe.invoices" },
	{ label: "workspaces.raw", detail: "join workspace_id" },
	{ label: "workspaces.billed" },
	{ label: "dash.mrr" },
];
const STALE = FRESH.map((s) =>
	s.label === "stripe.invoices" ? { ...s, stale: true, detail: "40 min late" } : s,
);

const meta = {
	title: "Components/Agent & trust/LineageChip",
	component: LineageChip,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { label: "MRR", steps: FRESH, freshness: "4 min", size: "md" },
	argTypes: {
		steps: { control: false },
		freshness: { control: "text" },
		summary: { control: "text" },
		onOpenChange: { control: false },
	},
	render: (args) => (
		<div className="q-sb-lineage-chip">
			<span className="q-sb-lineage-chip__figure">$13,204</span>
			<LineageChip {...args} />
		</div>
	),
} satisfies Meta<typeof LineageChip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const OneSourceLate: Story = {
	parameters: {
		docs: {
			description: {
				story: "A `stale` step turns the chip to attention; open, the lineage marks which one.",
			},
		},
	},
	args: { steps: STALE, freshness: undefined, defaultOpen: true },
};

export const Small: Story = {
	args: { size: "sm", label: "workspaces", steps: FRESH.slice(2, 4), freshness: "1 min" },
	render: (args) => (
		<div className="q-sb-lineage-chip">
			<span className="q-sb-lineage-chip__num">418 workspaces</span>
			<LineageChip {...args} />
		</div>
	),
};

function ControlledDemo() {
	const [open, setOpen] = useState(false);
	return (
		<Column wide>
			<div className="q-sb-lineage-chip">
				<span className="q-sb-lineage-chip__figure">$13,204</span>
				<LineageChip label="MRR" steps={STALE} open={open} onOpenChange={setOpen} />
			</div>
			<Row>
				<Button size="sm" variant="secondary" onClick={() => setOpen((o) => !o)}>
					{open ? "Fold the lineage" : "Unfold the lineage"}
				</Button>
			</Row>
		</Column>
	);
}

export const Controlled: Story = {
	parameters: {
		docs: { description: { story: "`open`/`onOpenChange`; Escape folds it from the keyboard." } },
	},
	render: () => <ControlledDemo />,
};
