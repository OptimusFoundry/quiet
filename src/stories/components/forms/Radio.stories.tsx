import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Radio } from "../../../components/forms/Radio";
import { Column, Note } from "../Story";
import { FormDemo } from "./FormDemo";

const PLANS = [
	{ value: "starter", label: "Starter", description: "2 runners, 7-day artifact retention" },
	{ value: "team", label: "Team", description: "10 runners, approvals, 90-day retention" },
	{ value: "enterprise", label: "Enterprise", description: "Talk to us", disabled: true },
];

const meta = {
	title: "Components/Forms/Radio",
	component: Radio,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		label: "Run priority",
		options: ["Low", "Normal", "High"],
		defaultValue: "Normal",
		direction: "column",
		size: "md",
	},
	argTypes: {
		label: { control: "text" },
		error: { control: "text" },
		onChange: { control: false },
		onBlur: { control: false },
		onFocus: { control: false },
		ref: { table: { disable: true } },
	},
} satisfies Meta<typeof Radio>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithDescriptions: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Options can carry a description and be disabled. Arrow keys move and select; Tab leaves the group.",
			},
		},
	},
	render: () => <Radio label="Plan" options={PLANS} defaultValue="team" />,
};

export const Horizontal: Story = {
	render: () => (
		<Radio
			label="Billing period"
			direction="row"
			options={["Monthly", "Yearly"]}
			defaultValue="Monthly"
		/>
	),
};

export const Sizes: Story = {
	render: () => (
		<Column>
			<Radio
				label="Small"
				size="sm"
				direction="row"
				options={["Low", "Normal", "High"]}
				defaultValue="Normal"
			/>
			<Radio
				label="Medium"
				size="md"
				direction="row"
				options={["Low", "Normal", "High"]}
				defaultValue="Normal"
			/>
			<Radio
				label="Large"
				size="lg"
				direction="row"
				options={["Low", "Normal", "High"]}
				defaultValue="Normal"
			/>
		</Column>
	),
};

export const States: Story = {
	render: () => (
		<Column>
			<Radio
				label="Invoice delivery"
				required
				error="Choose how invoices reach you."
				options={["Email", "Portal"]}
				defaultValue=""
			/>
			<Radio
				label="Region (locked)"
				disabled
				options={["Europe", "United States"]}
				defaultValue="Europe"
			/>
		</Column>
	),
};

function ControlledDemo() {
	const [plan, setPlan] = useState("starter");
	return (
		<Column>
			<Radio label="Plan" options={PLANS} value={plan} onChange={setPlan} />
			<Note>{`value = "${plan}". onChange gets the value, not an event.`}</Note>
		</Column>
	);
}

export const Controlled: Story = { render: () => <ControlledDemo /> };

export const InANativeForm: Story = {
	render: () => (
		<FormDemo label="Choose a plan" submit="Continue">
			<Radio name="plan" label="Plan" options={PLANS} defaultValue="team" />
		</FormDemo>
	),
};
