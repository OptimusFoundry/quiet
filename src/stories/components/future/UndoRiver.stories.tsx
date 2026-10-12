import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../../components/core/Button";
import { UndoRiver, type UndoRiverItem } from "../../../components/future/UndoRiver";
import { Column, Row } from "../Story";

const HOUR = 3600e3;
const NOW = Date.UTC(2026, 9, 8, 12);
const RIVER: UndoRiverItem[] = [
	{ id: 1, label: "Paused runner eu-west-2", by: "Meerkat", kind: "agent", at: NOW - 2.4 * HOUR },
	{ id: 2, label: "Changed the webhook URL", by: "Ada Park", kind: "person", at: NOW - 7 * HOUR },
	{ id: 3, label: "Deleted 2 artifacts", kind: "you", at: NOW - 13 * HOUR },
	{ id: 4, label: "Approved invoice #1042", by: "Meerkat", kind: "agent", at: NOW - 19 * HOUR },
	{ id: 5, label: "Rotated API key", by: "Leo Brandt", kind: "person", at: NOW - 22 * HOUR },
];

const meta = {
	title: "Components/Agent & trust/UndoRiver",
	component: UndoRiver,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { items: RIVER, now: NOW },
	argTypes: {
		items: { control: false },
		onUndo: { control: false },
		startLabel: { control: "text" },
		endLabel: { control: "text" },
		hint: { control: "text" },
	},
	decorators: [
		(Story) => (
			<Column wide>
				<Story />
			</Column>
		),
	],
} satisfies Meta<typeof UndoRiver>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

function RiverDemo() {
	const [items, setItems] = useState(RIVER);
	return (
		<>
			<UndoRiver
				items={items}
				now={NOW}
				onUndo={(it) => setItems((xs) => xs.filter((x) => x.id !== it.id))}
			/>
			<Row>
				<Button
					size="sm"
					variant="secondary"
					onClick={() =>
						setItems((xs) => [
							{ id: Date.now(), label: "Archived run #318", kind: "you", at: NOW - 0.2 * HOUR },
							...xs,
						])
					}
				>
					Do something
				</Button>
				<Button size="sm" variant="ghost" onClick={() => setItems(RIVER)}>
					Reset
				</Button>
			</Row>
		</>
	);
}

export const PullBack: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"One tab stop; arrows move along the river, newest first. Undo removes the item here because `onUndo` does.",
			},
		},
	},
	render: () => <RiverDemo />,
};

export const Kinds: Story = {
	parameters: {
		docs: {
			description: {
				story: "You are an accent dot, an agent an ink square, a person a hollow dot.",
			},
		},
	},
	args: { items: RIVER.slice(0, 3) },
};

export const ShortWindow: Story = {
	parameters: {
		docs: {
			description: { story: "`window` of 8 hours: older actions have already drifted out." },
		},
	},
	args: { window: 8 * HOUR, endLabel: "8 h · gone" },
};

export const Empty: Story = { args: { items: [] } };
