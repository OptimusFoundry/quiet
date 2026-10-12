import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Receipt, type ReceiptLine } from "../../../components/future/Receipt";
import { Column, Note } from "../Story";

const LINES: ReceiptLine[] = [
	{ id: "1", verb: "Paused", object: "Runner eu-west-1", undoable: true },
	{ id: "2", verb: "Paused", object: "Runner eu-west-2", undoable: true },
	{ id: "3", verb: "Paused", object: "Runner eu-central-1", undoable: true },
	{ id: "4", verb: "Sent", object: "3 owner notices" },
	{ id: "5", verb: "Kept", object: "41 queued runs in place" },
];

const meta = {
	title: "Components/Agent & trust/Receipt",
	component: Receipt,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		actor: "Meerkat",
		time: "14:02",
		reference: "#4f2a",
		reason: "Three runners failed above 5% for two days running.",
		lines: LINES,
		footer: "Reversible until tomorrow 14:02",
	},
	argTypes: {
		actor: { control: "text" },
		time: { control: "text" },
		reference: { control: "text" },
		reason: { control: "text" },
		footer: { control: "text" },
		lines: { control: false },
		onUndo: { control: false },
	},
	decorators: [
		(Story) => (
			<Column>
				<Story />
			</Column>
		),
	],
} satisfies Meta<typeof Receipt>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const NothingUndoable: Story = {
	parameters: {
		docs: {
			description: {
				story: "`undoable` is off by default: only effects that can really be taken back offer it.",
			},
		},
	},
	args: {
		actor: "You",
		reference: "#4f2b",
		reason: undefined,
		lines: [
			{ id: "1", verb: "Sent", object: "Invoice #1042 to Northwind" },
			{ id: "2", verb: "Logged", object: "$2,400 against Q4" },
		],
		footer: undefined,
	},
};

function ControlledDemo() {
	const [undone, setUndone] = useState<string[]>([]);
	return (
		<>
			<Receipt
				actor="Meerkat"
				time="14:02"
				reference="#4f2a"
				reason="Three runners failed above 5% for two days running."
				lines={LINES.map((l) => ({ ...l, undone: undone.includes(l.id ?? "") }))}
				onUndo={(l) => setUndone((u) => [...u, l.id ?? ""])}
				footer="Reversible until tomorrow 14:02"
			/>
			<Note>Undone: {undone.length ? undone.join(", ") : "none"}</Note>
		</>
	);
}

export const Controlled: Story = {
	parameters: {
		docs: {
			description: { story: "Pass `undone` per line to own the state; `onUndo` reports each one." },
		},
	},
	render: () => <ControlledDemo />,
};

export const PartlyUndone: Story = {
	args: { lines: LINES.map((l, i) => (i === 1 ? { ...l, undone: true } : l)) },
};
