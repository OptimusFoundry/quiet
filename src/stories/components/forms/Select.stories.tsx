import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Select } from "../../../components/forms/Select";
import { Column, Note, Row } from "../Story";
import { FormDemo } from "./FormDemo";

const REGIONS = [
	{ value: "eu", label: "Europe (Frankfurt)" },
	{ value: "us", label: "United States (Virginia)" },
	{ value: "apac", label: "Asia-Pacific (waitlist)", disabled: true },
];

const meta = {
	title: "Components/Forms/Select",
	component: Select,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		label: "Data region",
		options: REGIONS,
		placeholder: "Choose a region",
		helperText: "Where runs and artifacts are stored.",
		size: "md",
	},
	argTypes: {
		label: { control: "text" },
		helperText: { control: "text" },
		error: { control: "text" },
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
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
	render: () => (
		<Row>
			<Select label="Small" size="sm" options={REGIONS} defaultValue="eu" />
			<Select label="Medium" size="md" options={REGIONS} defaultValue="eu" />
			<Select label="Large" size="lg" options={REGIONS} defaultValue="eu" />
		</Row>
	),
};

export const States: Story = {
	parameters: {
		docs: {
			description: {
				story: "`error` as text shows the message; `error` as `true` marks the edge only.",
			},
		},
	},
	render: () => (
		<>
			<Select
				label="Data region"
				placeholder="Choose a region"
				error="Pick a region."
				options={REGIONS}
			/>
			<Select label="Flagged" error options={REGIONS} defaultValue="us" />
			<Select
				label="Locked region"
				disabled
				options={REGIONS}
				defaultValue="eu"
				helperText="Regions can't change after the first run."
			/>
		</>
	),
};

function ControlledDemo() {
	const [region, setRegion] = useState("eu");
	return (
		<>
			<Select
				label="Data region"
				options={REGIONS}
				value={region}
				onChange={(e) => setRegion(e.target.value)}
			/>
			<Note>{`value = "${region}". A native select: onChange gets the event.`}</Note>
		</>
	);
}

export const Controlled: Story = { render: () => <ControlledDemo /> };

export const InANativeForm: Story = {
	render: () => (
		<FormDemo label="Workspace region">
			<Select
				name="region"
				label="Data region"
				required
				placeholder="Choose a region"
				options={REGIONS}
			/>
		</FormDemo>
	),
};
