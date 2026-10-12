import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Checkbox } from "../../../components/forms/Checkbox";
import { Column, Note, Row } from "../Story";
import { FormDemo } from "./FormDemo";

const meta = {
	title: "Components/Forms/Checkbox",
	component: Checkbox,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { label: "Notify me when a run needs approval", size: "md" },
	argTypes: {
		label: { control: "text" },
		description: { control: "text" },
		error: { control: "text" },
		onChange: { control: false },
		ref: { table: { disable: true } },
	},
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
	render: () => (
		<Column>
			<Checkbox label="Unchecked" />
			<Checkbox label="Checked" defaultChecked />
			<Checkbox label="Some runners selected" indeterminate />
			<Checkbox label="Disabled" disabled />
			<Checkbox label="Disabled and checked" disabled defaultChecked />
		</Column>
	),
};

export const Sizes: Story = {
	render: () => (
		<Row>
			<Checkbox size="sm" label="Small" defaultChecked />
			<Checkbox size="md" label="Medium" defaultChecked />
			<Checkbox size="lg" label="Large" defaultChecked />
		</Row>
	),
};

export const WithDescription: Story = {
	render: () => (
		<Column>
			<Checkbox
				label="Keep artifacts for 90 days"
				description="After that, logs and outputs are deleted. Invoices are kept."
				defaultChecked
			/>
		</Column>
	),
};

export const Invalid: Story = {
	parameters: {
		docs: { description: { story: "`error` as text adds the message under the label." } },
	},
	render: () => (
		<Column>
			<Checkbox
				label="I've read the data processing terms"
				required
				error="Accept the terms to continue."
			/>
		</Column>
	),
};

const RUNNERS = ["gpu-runner-01", "gpu-runner-02", "cpu-runner-07"];

function SelectAllDemo() {
	const [on, setOn] = useState<string[]>(["gpu-runner-01"]);
	const all = on.length === RUNNERS.length;
	return (
		<Column>
			<Checkbox
				label="All runners"
				checked={all}
				indeterminate={on.length > 0 && !all}
				onChange={() => setOn(all ? [] : RUNNERS)}
			/>
			{RUNNERS.map((r) => (
				<Checkbox
					key={r}
					label={r}
					checked={on.includes(r)}
					onChange={(c) => setOn(c ? [...on, r] : on.filter((x) => x !== r))}
				/>
			))}
			<Note>
				Controlled: `checked` + `onChange(checked)`. The parent is indeterminate while some are on.
			</Note>
		</Column>
	);
}

export const Controlled: Story = { render: () => <SelectAllDemo /> };

export const InANativeForm: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"With `name`, a hidden input submits `value` (default `on`) while checked. `required` blocks submit while unchecked.",
			},
		},
	},
	render: () => (
		<FormDemo label="Accept terms">
			<Checkbox name="terms" value="accepted" label="Accept the data processing terms" required />
			<Checkbox name="digest" label="Send me the weekly run digest" defaultChecked />
		</FormDemo>
	),
};
