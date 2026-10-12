import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../../components/core/Button";
import { Approval } from "../../../components/future/Approval";
import { Column, Note, Row } from "../Story";

const CHANGES = [
	{ label: "Nightly export", before: "Live", after: "Paused", meta: "1,240 runs" },
	{ label: "Invoice sync", before: "Live", after: "Paused", meta: "862 runs" },
	{ label: "EU backfill", before: "Live", after: "Paused", meta: "379 runs" },
];

const meta = {
	title: "Components/Agent & trust/Approval",
	component: Approval,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		title: "Pause 3 schedules in Northwind",
		description:
			"Queued runs stay saved and keep their place. Each owner gets one notice. Nothing is deleted.",
		changes: CHANGES,
		consequences: [
			{ icon: "undo", label: "Reversible for 24h" },
			{ icon: "arrow-right", label: "3 notices" },
		],
		confirmLabel: "Pause 3 schedules",
		confirmedLabel: "Paused · undo for 24h",
	},
	argTypes: {
		title: { control: "text" },
		description: { control: "text" },
		confirmLabel: { control: "text" },
		confirmedLabel: { control: "text" },
		changes: { control: false },
		consequences: { control: false },
		secondaryAction: { control: false },
		onConfirm: { control: false },
	},
	render: (args) => (
		<Column wide>
			<Approval {...args} />
		</Column>
	),
} satisfies Meta<typeof Approval>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithSecondaryAction: Story = {
	parameters: {
		docs: {
			description: { story: "`secondaryAction` sits beside the hold key until it's confirmed." },
		},
	},
	args: {
		secondaryAction: (
			<Button size="sm" variant="ghost">
				Edit plan
			</Button>
		),
	},
};

export const Confirmed: Story = { args: { confirmed: true } };

export const PlainConsequences: Story = {
	parameters: {
		docs: {
			description: {
				story: "Rows can be any node; strings become badges. Consequences can be plain strings.",
			},
		},
	},
	args: {
		title: "Revoke 2 API keys for runner-07",
		description: "Runs using these keys fail on their next call.",
		changes: [
			{ label: "ci-deploy", before: "Active", after: "Revoked", meta: "last used 2m ago" },
			{ label: "nightly-export", before: "Active", after: "Revoked", meta: "last used 9h ago" },
		],
		consequences: ["Not reversible", "2 runners affected"],
		confirmLabel: "Revoke 2 keys",
		confirmedLabel: "Revoked",
		holdDuration: 1400,
	},
};

function ControlledApproval() {
	const [done, setDone] = useState(false);
	return (
		<Column wide>
			<Approval
				title="Send 12 overdue invoices"
				description="Each workspace owner gets one email with the invoice attached."
				consequences={[{ icon: "undo", label: "Unsend for 10 min" }]}
				confirmLabel="Send 12 invoices"
				confirmedLabel="Sent · unsend for 10 min"
				confirmed={done}
				onConfirm={() => setDone(true)}
			/>
			<Row>
				<Button size="sm" variant="ghost" onClick={() => setDone(false)} disabled={!done}>
					Unsend
				</Button>
			</Row>
			<Note>Controlled: `confirmed` + `onConfirm`. Hold the key (pointer, Space or Enter).</Note>
		</Column>
	);
}

export const Controlled: Story = { render: () => <ControlledApproval /> };
