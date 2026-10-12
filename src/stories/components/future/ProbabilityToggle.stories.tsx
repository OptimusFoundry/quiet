import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
	PROBABILITY_LEVELS,
	ProbabilityToggle,
} from "../../../components/future/ProbabilityToggle";
import { Column, Note } from "../Story";

const POLICY = [
	{ upTo: 4, label: "Off", description: "Meerkat never posts without asking." },
	{ upTo: 34, label: "Rarely", description: "Posts alone only for routine release notes." },
	{
		upTo: 64,
		label: "Sometimes",
		description: "Posts alone when the draft scores high and nothing is scheduled.",
	},
	{
		upTo: 95,
		label: "Mostly",
		description: "Posts alone unless the draft mentions pricing, outages or people.",
	},
	{ upTo: 100, label: "Always", description: "Posts alone. You'll see it in the brief." },
];

const meta = {
	title: "Components/Agent & trust/ProbabilityToggle",
	component: ProbabilityToggle,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { label: "Publish without asking", levels: POLICY, defaultValue: 80, step: 5 },
	argTypes: {
		label: { control: "text" },
		levels: { control: false },
		onChange: { control: false },
		value: { control: { type: "range", min: 0, max: 100 } },
		defaultValue: { control: { type: "range", min: 0, max: 100 } },
	},
} satisfies Meta<typeof ProbabilityToggle>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithPolicy: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Give each level a `description` and the position is read back as a policy in words.",
			},
		},
	},
	render: () => (
		<Column>
			<ProbabilityToggle label="Publish without asking" levels={POLICY} defaultValue={80} />
		</Column>
	),
};

export const DefaultLevels: Story = {
	parameters: {
		docs: {
			description: { story: "Without `levels` it uses `PROBABILITY_LEVELS`: Off to Always." },
		},
	},
	render: () => (
		<Column>
			<ProbabilityToggle label="Auto-reply to runners" defaultValue={30} />
		</Column>
	),
};

function ControlledDemo() {
	const [value, setValue] = useState(50);
	const level = PROBABILITY_LEVELS.find((l) => value <= l.upTo);
	return (
		<Column>
			<ProbabilityToggle
				label="Approve invoices under $500"
				value={value}
				onChange={(v) => setValue(v)}
			/>
			<Note>
				Stored as {value} ({level?.label}). Arrows step 5, PageUp/PageDown 25, Home/End jump to the
				ends.
			</Note>
		</Column>
	);
}

export const Controlled: Story = { render: () => <ControlledDemo /> };

export const Disabled: Story = {
	render: () => (
		<Column>
			<ProbabilityToggle label="Merge without review" disabled defaultValue={50} />
		</Column>
	),
};

export const WithoutVisibleLabel: Story = {
	parameters: {
		docs: { description: { story: "No `label`: pass `aria-label` so the slider has a name." } },
	},
	render: () => (
		<Column>
			<ProbabilityToggle aria-label="Retry failed runs alone" defaultValue={70} />
		</Column>
	),
};
