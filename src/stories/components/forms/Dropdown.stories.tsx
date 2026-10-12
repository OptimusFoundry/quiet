import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Icon } from "../../../components/core/Icon";
import { Dropdown } from "../../../components/forms/Dropdown";
import { Column, Note, Row } from "../Story";
import { FormDemo } from "./FormDemo";

const RUNNERS = [
	{ value: "gpu-01", label: "gpu-runner-01", description: "A100 · Frankfurt" },
	{ value: "gpu-02", label: "gpu-runner-02", description: "A100 · Virginia" },
	{ value: "cpu-07", label: "cpu-runner-07", description: "32 vCPU · Frankfurt" },
	{ divider: true as const },
	{ value: "gpu-03", label: "gpu-runner-03", description: "Draining", disabled: true },
];

const meta = {
	title: "Components/Forms/Dropdown",
	component: Dropdown,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		label: "Runner",
		options: RUNNERS,
		placeholder: "Choose a runner",
		size: "md",
		variant: "default",
	},
	argTypes: {
		label: { control: "text" },
		helperText: { control: "text" },
		error: { control: "text" },
		options: { control: false },
		onChange: { control: false },
		onBlur: { control: false },
		onFocus: { control: false },
		ref: { table: { disable: true } },
	},
} satisfies Meta<typeof Dropdown>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Arrow keys move, Enter picks, typing jumps to a match, Escape closes and returns focus.",
			},
		},
	},
};

export const WithIcons: Story = {
	render: () => (
		<Dropdown
			label="Notify"
			defaultValue="approvals"
			options={[
				{ value: "approvals", label: "Approvals", icon: <Icon name="approvals" /> },
				{ value: "runs", label: "Every run", icon: <Icon name="runs" /> },
				{ value: "none", label: "Nothing", icon: <Icon name="close" /> },
			]}
		/>
	),
};

export const Sizes: Story = {
	render: () => (
		<Row>
			<Dropdown
				size="sm"
				options={["Last 7 days", "Last 30 days"]}
				defaultValue="Last 7 days"
				aria-label="Range"
			/>
			<Dropdown
				size="md"
				options={["Last 7 days", "Last 30 days"]}
				defaultValue="Last 7 days"
				aria-label="Range"
			/>
			<Dropdown
				size="lg"
				options={["Last 7 days", "Last 30 days"]}
				defaultValue="Last 7 days"
				aria-label="Range"
			/>
		</Row>
	),
};

export const Variants: Story = {
	render: () => (
		<Row>
			<Dropdown label="Default" options={RUNNERS} defaultValue="gpu-01" />
			<Dropdown label="Filled" variant="filled" options={RUNNERS} defaultValue="gpu-01" />
		</Row>
	),
};

export const States: Story = {
	render: () => (
		<Column>
			<Dropdown
				label="Runner"
				required
				fullWidth
				options={RUNNERS}
				error="Pick a runner for this run."
			/>
			<Dropdown
				label="Runner"
				disabled
				fullWidth
				options={RUNNERS}
				defaultValue="gpu-01"
				helperText="Locked while the run is in progress."
			/>
		</Column>
	),
};

function ControlledDemo() {
	const [runner, setRunner] = useState("cpu-07");
	return (
		<Column>
			<Dropdown label="Runner" fullWidth options={RUNNERS} value={runner} onChange={setRunner} />
			<Note>{`value = "${runner}". onChange gets the value.`}</Note>
		</Column>
	);
}

export const Controlled: Story = { render: () => <ControlledDemo /> };

export const InANativeForm: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"With `name`, a hidden input submits the value. `required` blocks submit while empty.",
			},
		},
	},
	render: () => (
		<FormDemo label="Start a run" submit="Start run">
			<Dropdown
				name="runner"
				label="Runner"
				required
				fullWidth
				options={RUNNERS}
				placeholder="Choose a runner"
			/>
		</FormDemo>
	),
};
