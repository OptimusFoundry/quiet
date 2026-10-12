import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { FormField } from "../../../components/forms/FormField";
import { Stepper } from "../../../components/forms/Stepper";
import { Column, Note, Row } from "../Story";
import { FormDemo } from "./FormDemo";

const meta = {
	title: "Components/Forms/Stepper",
	component: Stepper,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { label: "Seats", defaultValue: 3, min: 1, max: 50, step: 1, size: "md" },
	argTypes: {
		onChange: { control: false },
		onBlur: { control: false },
		onFocus: { control: false },
		ref: { table: { disable: true } },
	},
} satisfies Meta<typeof Stepper>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`label` is the accessible name only; give a visible label with FormField. Arrow keys step, Page Up/Down by ten.",
			},
		},
	},
};

export const Sizes: Story = {
	render: () => (
		<Row>
			<Stepper size="sm" label="Small" defaultValue={2} min={0} />
			<Stepper size="md" label="Medium" defaultValue={2} min={0} />
			<Stepper size="lg" label="Large" defaultValue={2} min={0} />
		</Row>
	),
};

export const AtTheLimits: Story = {
	parameters: {
		docs: { description: { story: "At `min` or `max` the button at that end goes quiet." } },
	},
	render: () => (
		<Row>
			<Stepper label="Runners" defaultValue={1} min={1} max={8} />
			<Stepper label="Runners" defaultValue={8} min={1} max={8} />
			<Stepper label="Retries" disabled defaultValue={2} />
		</Row>
	),
};

export const InAFormField: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"FormField gives it a visible label, a hint or error, and wires `id` and `aria-*` onto the field.",
			},
		},
	},
	render: () => (
		<Column>
			<FormField label="Runners" helperText="Billed per runner-hour.">
				<Stepper label="Runners" defaultValue={2} min={1} max={8} />
			</FormField>
			<FormField label="Retries" error="At most 5 retries per run.">
				<Stepper label="Retries" defaultValue={5} min={0} />
			</FormField>
		</Column>
	),
};

function ControlledDemo() {
	const [seats, setSeats] = useState(5);
	return (
		<Column>
			<Stepper label="Seats" value={seats} onChange={setSeats} min={1} max={50} />
			<Note>{`${seats} seats × $12 = $${seats * 12} a month on the next invoice.`}</Note>
		</Column>
	);
}

export const Controlled: Story = { render: () => <ControlledDemo /> };

export const InANativeForm: Story = {
	render: () => (
		<FormDemo label="Seats" submit="Update plan">
			<FormField label="Seats" required>
				<Stepper name="seats" label="Seats" defaultValue={3} min={1} max={50} required />
			</FormField>
		</FormDemo>
	),
};
