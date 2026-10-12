import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DraftDiff, type DraftDiffState } from "../../../components/future/DraftDiff";
import { Column, Note } from "../Story";

const HUNKS = [
	{
		keep: "Your October invoice is ",
		before: "now available to view",
		after: "ready",
		tail: ". ",
	},
	{
		before: "It covers all of the runs that your workspace has completed during the month.",
		after: "It covers every run your workspace finished in October.",
		tail: " ",
	},
	{ keep: "Payment is due ", before: "within 30 days.", after: "by November 30." },
];

const meta = {
	title: "Components/Agent & trust/DraftDiff",
	component: DraftDiff,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		hunks: HUNKS,
		label: "runner-07 suggests 3 edits",
		note: "shorter, one claim per sentence",
		shipLabel: "Send invoice note",
	},
	argTypes: {
		hunks: { control: false },
		label: { control: "text" },
		note: { control: "text" },
		shipLabel: { control: "text" },
		onChange: { control: false },
		onShip: { control: false },
	},
	render: (args) => (
		<Column wide>
			<DraftDiff {...args} />
		</Column>
	),
} satisfies Meta<typeof DraftDiff>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const PartlyResolved: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"One accepted, one kept, one open: the ship button waits for the last hunk. Resolved hunks can be reopened.",
			},
		},
	},
	args: { defaultValue: ["accepted", "rejected", "pending"] },
};

export const AllResolved: Story = {
	args: { defaultValue: ["accepted", "accepted", "rejected"] },
};

function ControlledDraft() {
	const [states, setStates] = useState<DraftDiffState[]>(HUNKS.map(() => "pending"));
	const [sent, setSent] = useState(false);
	return (
		<Column wide>
			<DraftDiff
				hunks={HUNKS}
				label="runner-07 suggests 3 edits"
				note="shorter, one claim per sentence"
				value={states}
				onChange={setStates}
				shipLabel={sent ? "Sent" : "Send invoice note"}
				onShip={() => setSent(true)}
			/>
			<Note>value: [{states.join(", ")}]</Note>
		</Column>
	);
}

export const Controlled: Story = {
	parameters: {
		docs: { description: { story: "`value` + `onChange` hold one state per hunk." } },
	},
	render: () => <ControlledDraft />,
};
