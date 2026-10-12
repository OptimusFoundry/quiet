import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ConsensusSlider } from "../../../components/future/ConsensusSlider";
import { Column, Note } from "../Story";

const OTHERS = [
	{ name: "Ada Park", value: 24 },
	{ name: "Leo Brandt", value: 35 },
	{ name: "runner-07", value: 31, agent: true },
];

const meta = {
	title: "Components/Agent & trust/ConsensusSlider",
	component: ConsensusSlider,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		label: "Pro seat price",
		min: 9,
		max: 79,
		defaultValue: 29,
		closeWithin: 6,
		others: OTHERS,
		formatValue: (n) => `$${n}`,
	},
	argTypes: {
		label: { control: "text" },
		others: { control: false },
		formatValue: { control: false },
		onChange: { control: false },
		meetLabel: { control: "text" },
	},
	render: (args) => (
		<Column wide>
			<ConsensusSlider {...args} />
		</Column>
	),
} satisfies Meta<typeof ConsensusSlider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const CloseToAgreement: Story = {
	parameters: {
		docs: {
			description: {
				story: "A spread at or under `closeWithin` reads as close to agreement.",
			},
		},
	},
	args: {
		defaultValue: 30,
		others: [
			{ name: "Ada Park", value: 28 },
			{ name: "Leo Brandt", value: 32 },
			{ name: "runner-07", value: 31, agent: true },
		],
	},
};

export const FarApart: Story = {
	args: {
		label: "Max parallel runs per workspace",
		min: 1,
		max: 32,
		defaultValue: 4,
		closeWithin: 2,
		formatValue: (n) => `${n} runs`,
		others: [
			{ name: "Mira Osei", value: 24 },
			{ name: "Jon Takeda", value: 12 },
			{ name: "runner-02", value: 30, agent: true },
		],
	},
};

function ControlledConsensus() {
	const [price, setPrice] = useState(49);
	return (
		<Column wide>
			<ConsensusSlider
				label="Pro seat price"
				min={9}
				max={79}
				value={price}
				onChange={setPrice}
				closeWithin={6}
				formatValue={(n) => `$${n}`}
				others={OTHERS}
			/>
			<Note>Your price: ${price}. “Meet in the middle” moves you to the mean of the others.</Note>
		</Column>
	);
}

export const Controlled: Story = { render: () => <ControlledConsensus /> };

export const Disabled: Story = { args: { disabled: true, showMeet: false } };
