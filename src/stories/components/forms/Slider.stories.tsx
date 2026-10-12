import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Slider } from "../../../components/forms/Slider";
import { Column, Note } from "../Story";
import { FormDemo } from "./FormDemo";

const meta = {
	title: "Components/Forms/Slider",
	component: Slider,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		label: "Max parallel runs",
		defaultValue: 4,
		min: 1,
		max: 16,
		step: 1,
		showValue: true,
		size: "md",
	},
	argTypes: {
		label: { control: "text" },
		formatValue: { control: false },
		onChange: { control: false },
		ref: { table: { disable: true } },
	},
	decorators: [
		(Story) => (
			<Column>
				<Story />
			</Column>
		),
	],
} satisfies Meta<typeof Slider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	parameters: {
		docs: {
			description: {
				story: "Arrows step, Page Up/Down step by ten, Home and End jump to the ends.",
			},
		},
	},
};

export const FormattedValue: Story = {
	parameters: {
		docs: { description: { story: "`formatValue` sets the shown value and `aria-valuetext`." } },
	},
	args: {
		label: "Monthly spend cap",
		defaultValue: 400,
		min: 0,
		max: 2000,
		step: 50,
		formatValue: (v: number) => `$${v.toLocaleString("en-US")}`,
	},
};

export const Sizes: Story = {
	render: () => (
		<>
			<Slider size="sm" label="Small" defaultValue={30} />
			<Slider size="md" label="Medium" defaultValue={50} />
			<Slider size="lg" label="Large" defaultValue={70} />
		</>
	),
};

export const Disabled: Story = {
	args: {
		disabled: true,
		label: "Runner memory (GB)",
		defaultValue: 32,
		min: 8,
		max: 128,
		step: 8,
	},
};

function ControlledDemo() {
	const [value, setValue] = useState(60);
	return (
		<>
			<Slider
				label="Artifact retention (days)"
				min={7}
				max={365}
				value={value}
				onChange={setValue}
			/>
			<Note>{`Artifacts older than ${value} days are deleted. onChange gets the number.`}</Note>
		</>
	);
}

export const Controlled: Story = { render: () => <ControlledDemo /> };

export const InANativeForm: Story = {
	render: () => (
		<FormDemo label="Runner limits" submit="Save">
			<Slider name="parallel" label="Max parallel runs" min={1} max={16} defaultValue={4} />
		</FormDemo>
	),
};
