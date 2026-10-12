import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { type Checkpoint, Checkpoints } from "../../../components/future/Checkpoints";
import { Column, Note } from "../Story";

const HISTORY: Checkpoint[] = [
	{ id: "a", time: "09:12", who: "You", label: "Created the Northwind workspace", changes: 0 },
	{ id: "b", time: "10:40", who: "runner-07", agent: true, label: "Rewrote the invoice template" },
	{ id: "c", time: "13:05", who: "You", label: "Turned on auto-approve for exports" },
	{
		id: "d",
		time: "14:02",
		who: "runner-07",
		agent: true,
		label: "Paused 3 schedules",
		changes: 3,
	},
	{ id: "e", time: "14:31", who: "Ada Park", label: "Moved billing to the EU region" },
];

const meta = {
	title: "Components/Agent & trust/Checkpoints",
	component: Checkpoints,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { label: "Northwind workspace history", checkpoints: HISTORY },
	argTypes: {
		checkpoints: { control: false },
		onChange: { control: false },
		onRestore: { control: false },
	},
	render: (args) => (
		<Column wide>
			<Checkpoints {...args} />
		</Column>
	),
} satisfies Meta<typeof Checkpoints>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const EarlierSelected: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"An earlier snapshot says how many later changes restoring would revert. Without `onRestore` the Restore button stays disabled.",
			},
		},
	},
	args: { defaultValue: 2 },
};

function RestoringHistory() {
	const [points, setPoints] = useState(HISTORY);
	const [sel, setSel] = useState(HISTORY.length - 1);
	return (
		<Column wide>
			<Checkpoints
				label="Northwind workspace history"
				checkpoints={points}
				value={sel}
				onChange={setSel}
				onRestore={(c) => {
					const next = [
						...points,
						{ id: `r${points.length}`, time: "14:40", who: "You", label: `Restored to ${c.time}` },
					];
					setPoints(next);
					setSel(next.length - 1);
				}}
			/>
			<Note>
				Arrow keys move between snapshots; Enter restores. Restoring appends a checkpoint, so
				history is never thrown away.
			</Note>
		</Column>
	);
}

export const Restoring: Story = {
	parameters: {
		docs: { description: { story: "Controlled: `value` + `onChange`, and `onRestore`." } },
	},
	render: () => <RestoringHistory />,
};

export const CustomWords: Story = {
	args: {
		label: "Invoice INV-2043 history",
		checkpoints: [
			{ time: "Oct 1", who: "Billing", label: "Issued", changes: 0 },
			{ time: "Oct 4", who: "runner-07", agent: true, label: "Applied a 10% credit" },
			{ time: "Oct 9", who: "You", label: "Changed the due date" },
		],
		defaultValue: 0,
		onRestore: () => {},
		restoreLabel: "Revert",
		currentLabel: "Current",
		changeWord: "edit",
	},
};
