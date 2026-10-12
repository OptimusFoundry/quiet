import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DatePicker } from "../../../components/forms/DatePicker";
import { Column, Note, Row } from "../Story";
import { FormDemo } from "./FormDemo";

const meta = {
	title: "Components/Forms/DatePicker",
	component: DatePicker,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		label: "Invoice due",
		defaultValue: new Date(2026, 9, 30),
		weekStartsOn: 1,
		size: "md",
	},
	argTypes: {
		label: { control: "text" },
		helperText: { control: "text" },
		error: { control: "text" },
		value: { control: false },
		defaultValue: { control: false },
		min: { control: false },
		max: { control: false },
		format: { control: false },
		onChange: { control: false },
		onBlur: { control: false },
		onFocus: { control: false },
		ref: { table: { disable: true } },
	},
} satisfies Meta<typeof DatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	parameters: {
		docs: {
			description: {
				story: "Arrow keys move by day, Page Up/Down by month; Enter picks, Escape closes.",
			},
		},
	},
};

export const Empty: Story = {
	args: { defaultValue: null, label: "Schedule run", placeholder: "Pick a date" },
};

export const MinAndMax: Story = {
	parameters: {
		docs: { description: { story: "Days outside `min`…`max` can't be picked." } },
	},
	args: {
		label: "Retention ends",
		defaultValue: new Date(2026, 10, 12),
		min: new Date(2026, 9, 12),
		max: new Date(2026, 11, 31),
		helperText: "Between today and the end of the year.",
	},
};

export const Sizes: Story = {
	render: () => (
		<Row>
			<DatePicker size="sm" aria-label="Small" defaultValue={new Date(2026, 9, 30)} />
			<DatePicker size="md" aria-label="Medium" defaultValue={new Date(2026, 9, 30)} />
			<DatePicker size="lg" aria-label="Large" defaultValue={new Date(2026, 9, 30)} />
		</Row>
	),
};

export const States: Story = {
	render: () => (
		<Column>
			<DatePicker label="Invoice due" required error="Pick a due date." />
			<DatePicker
				label="Billing starts"
				disabled
				defaultValue={new Date(2026, 9, 1)}
				helperText="Set by your plan."
			/>
		</Column>
	),
};

function ControlledDemo() {
	const [date, setDate] = useState<Date | null>(new Date(2026, 9, 14));
	return (
		<Column>
			<DatePicker label="Run on" value={date} onChange={setDate} />
			<Note>{date ? `value = ${date.toDateString()}` : "value = null"}</Note>
		</Column>
	);
}

export const Controlled: Story = { render: () => <ControlledDemo /> };

export const InANativeForm: Story = {
	parameters: {
		docs: {
			description: {
				story: 'With `name`, submits the date as local YYYY-MM-DD, like `<input type="date">`.',
			},
		},
	},
	render: () => (
		<FormDemo label="Schedule a run" submit="Schedule">
			<DatePicker name="runOn" label="Run on" required />
		</FormDemo>
	),
};
