import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TextArea } from "../../../components/forms/TextArea";
import { Column, Note } from "../Story";
import { FormDemo } from "./FormDemo";

const meta = {
	title: "Components/Forms/TextArea",
	component: TextArea,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		label: "Approval note",
		placeholder: "What should the reviewer check before approving this run?",
		helperText: "Visible to everyone in the workspace.",
		rows: 4,
		size: "md",
		resize: "vertical",
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
} satisfies Meta<typeof TextArea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithCounter: Story = {
	parameters: {
		docs: { description: { story: "`maxLength` caps the input and shows an n / max counter." } },
	},
	args: { label: "Run summary", maxLength: 280, helperText: undefined, rows: 3 },
};

export const Sizes: Story = {
	render: () => (
		<>
			<TextArea label="Small" size="sm" rows={2} defaultValue="Retry with the larger runner." />
			<TextArea label="Medium" size="md" rows={2} defaultValue="Retry with the larger runner." />
			<TextArea label="Large" size="lg" rows={2} defaultValue="Retry with the larger runner." />
		</>
	),
};

export const States: Story = {
	render: () => (
		<>
			<TextArea
				label="Rejection reason"
				required
				rows={2}
				error="Say why, so the requester can fix it."
			/>
			<TextArea
				label="Archived note"
				disabled
				rows={2}
				defaultValue="Approved by Mira on 3 Oct. Invoice INV-2041 sent."
			/>
			<TextArea
				label="Notes"
				hideLabel
				rows={2}
				placeholder="Notes (the label is for screen readers only)"
			/>
		</>
	),
};

function ControlledDemo() {
	const [value, setValue] = useState("Re-run the eval on gpu-runner-03.");
	return (
		<>
			<TextArea
				label="Instructions"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				rows={3}
				maxLength={200}
			/>
			<Note>{`${value.split(/\s+/).filter(Boolean).length} words. onChange gets the native event.`}</Note>
		</>
	);
}

export const Controlled: Story = { render: () => <ControlledDemo /> };

export const InANativeForm: Story = {
	render: () => (
		<FormDemo label="Request approval" submit="Request approval">
			<TextArea
				name="note"
				label="Approval note"
				required
				rows={3}
				placeholder="What changed since the last run?"
			/>
		</FormDemo>
	),
};
