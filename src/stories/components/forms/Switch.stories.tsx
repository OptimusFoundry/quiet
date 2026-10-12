import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Switch } from "../../../components/forms/Switch";
import { Column, Note, Row } from "../Story";
import { FormDemo } from "./FormDemo";

const meta = {
	title: "Components/Forms/Switch",
	component: Switch,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { label: "Auto-approve runs under $5", size: "md", labelPosition: "right" },
	argTypes: {
		label: { control: "text" },
		description: { control: "text" },
		onChange: { control: false },
		ref: { table: { disable: true } },
	},
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
	parameters: {
		docs: {
			description: {
				story: "For settings that apply at once. For a choice saved with a form, prefer Checkbox.",
			},
		},
	},
	render: () => (
		<Column>
			<Switch label="Off" />
			<Switch label="On" defaultChecked />
			<Switch label="Disabled" disabled />
			<Switch label="Disabled and on" disabled defaultChecked />
		</Column>
	),
};

export const Sizes: Story = {
	render: () => (
		<Row>
			<Switch size="sm" label="Small" defaultChecked />
			<Switch size="md" label="Medium" defaultChecked />
			<Switch size="lg" label="Large" defaultChecked />
		</Row>
	),
};

export const SettingsRows: Story = {
	parameters: {
		docs: {
			description: { story: '`labelPosition="left"` with a description: the settings-row layout.' },
		},
	},
	render: () => (
		<Column>
			<Switch
				labelPosition="left"
				label="Email approvals"
				description="Send an email when a run waits for your approval."
				defaultChecked
			/>
			<Switch
				labelPosition="left"
				label="Pause idle runners"
				description="Stops a runner after 30 minutes without work."
			/>
		</Column>
	),
};

function ControlledDemo() {
	const [on, setOn] = useState(true);
	return (
		<Column>
			<Switch label="Nightly evals" checked={on} onChange={setOn} />
			<Note>{on ? "Runs every night at 02:00 UTC." : "Paused. Nothing is scheduled."}</Note>
		</Column>
	);
}

export const Controlled: Story = { render: () => <ControlledDemo /> };

export const InANativeForm: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"With `name`, submits `value` (default `on`) while on. Disabled switches aren't submitted.",
			},
		},
	},
	render: () => (
		<FormDemo label="Notification settings" submit="Save">
			<Switch name="digest" label="Weekly digest" defaultChecked />
			<Switch name="alerts" value="failures" label="Alert on failed runs" />
			<Switch name="locked" label="Audit log (set by your admin)" defaultChecked disabled />
		</FormDemo>
	),
};
