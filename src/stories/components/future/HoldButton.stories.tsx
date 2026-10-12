import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../../components/core/Button";
import { HoldButton } from "../../../components/future/HoldButton";
import { Column, Note, Row } from "../Story";

const meta = {
	title: "Components/Agent & trust/HoldButton",
	component: HoldButton,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		children: "Delete workspace",
		confirmedLabel: "Deleted",
		variant: "primary",
		size: "md",
		duration: 900,
	},
	argTypes: {
		children: { control: "text" },
		confirmedLabel: { control: "text" },
		variant: {
			control: "inline-radio",
			options: ["primary", "secondary", "outline", "destructive"],
		},
		size: { control: "inline-radio", options: ["sm", "md", "lg"] },
		onConfirm: { control: false },
		ref: { table: { disable: true } },
	},
} satisfies Meta<typeof HoldButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	parameters: {
		docs: {
			description: {
				story: "Press and hold (pointer, Space or Enter). Letting go early springs back.",
			},
		},
	},
};

export const Variants: Story = {
	render: () => (
		<Row>
			<HoldButton confirmedLabel="Approved">Approve 3 runs</HoldButton>
			<HoldButton variant="secondary" confirmedLabel="Archived">
				Archive workspace
			</HoldButton>
			<HoldButton variant="outline" confirmedLabel="Sent">
				Send 12 invoices
			</HoldButton>
			<HoldButton variant="destructive" confirmedLabel="Revoked">
				Revoke all keys
			</HoldButton>
		</Row>
	),
};

export const Sizes: Story = {
	render: () => (
		<Row>
			<HoldButton size="sm">Small</HoldButton>
			<HoldButton size="md">Medium</HoldButton>
			<HoldButton size="lg">Large</HoldButton>
		</Row>
	),
};

export const LongerHold: Story = {
	parameters: {
		docs: {
			description: { story: "A longer `duration` for actions that reach further." },
		},
	},
	args: {
		children: "Revoke all keys",
		confirmedLabel: "Revoked",
		variant: "destructive",
		size: "sm",
		duration: 1400,
	},
};

export const Disabled: Story = { args: { disabled: true } };

function ControlledHold() {
	const [done, setDone] = useState(false);
	return (
		<Column>
			<Row>
				<HoldButton
					confirmed={done}
					onConfirm={() => setDone(true)}
					confirmedLabel="Paused · undo for 24h"
				>
					Pause 3 schedules
				</HoldButton>
				<Button size="sm" variant="ghost" onClick={() => setDone(false)} disabled={!done}>
					Undo
				</Button>
			</Row>
			<Note>Controlled: `confirmed` + `onConfirm`, which fires once when the hold completes.</Note>
		</Column>
	);
}

export const Controlled: Story = { render: () => <ControlledHold /> };
