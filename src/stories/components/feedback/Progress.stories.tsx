import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../../components/core/Button";
import { Progress } from "../../../components/feedback/Progress";
import { Column, Note, Row } from "../Story";

const meta = {
	title: "Components/Feedback/Progress",
	component: Progress,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		label: "Uploading 3 artifacts",
		value: 42,
		max: 100,
		size: "md",
		variant: "default",
		showValue: true,
		indeterminate: false,
	},
	argTypes: {
		label: { control: "text" },
		value: { control: { type: "range", min: 0, max: 100 } },
	},
	render: (args) => (
		<Column>
			<Progress {...args} />
		</Column>
	),
} satisfies Meta<typeof Progress>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Statuses: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"The accent fills by default. Variants read `--q-status-*`: success is ink and shows a check at 100%, warning and error are the accent (error colours the value too). `heat` stays the accent whatever a product theme does to status, for spend and quotas.",
			},
		},
	},
	render: () => (
		<Column>
			<Progress label="Indexing workspace" value={64} showValue />
			<Progress label="Import complete" value={100} variant="success" showValue />
			<Progress label="Monthly runner budget" value={84} variant="warning" showValue />
			<Progress label="Upload failed" value={37} variant="error" showValue />
			<Progress label="Seats used" value={9} max={10} variant="heat" showValue />
		</Column>
	),
};

export const Sizes: Story = {
	parameters: { docs: { description: { story: "1px, 2px and 4px tracks." } } },
	render: () => (
		<Column>
			<Progress label="Small" size="sm" value={60} />
			<Progress label="Medium" size="md" value={60} />
			<Progress label="Large" size="lg" value={60} />
		</Column>
	),
};

export const Indeterminate: Story = {
	parameters: {
		docs: { description: { story: "When there's no measure yet; no value is announced." } },
	},
	render: () => (
		<Column>
			<Progress label="Waiting for a runner" indeterminate />
		</Column>
	),
};

export const WithoutLabel: Story = {
	parameters: {
		docs: {
			description: {
				story: "A bare bar for tight rows; give it an `aria-label` so it still has a name.",
			},
		},
	},
	render: () => (
		<Column>
			<Progress aria-label="Run #4182 progress" value={30} size="sm" />
		</Column>
	),
};

function UploadDemo() {
	const [value, setValue] = useState(0);
	const done = value >= 100;
	return (
		<Column>
			<Progress
				label={done ? "invoice-batch.csv uploaded" : "Uploading invoice-batch.csv"}
				value={value}
				variant={done ? "success" : "default"}
				showValue
			/>
			<Row>
				<Button
					size="sm"
					variant="secondary"
					disabled={done}
					onClick={() => setValue((v) => Math.min(100, v + 25))}
				>
					Advance 25%
				</Button>
				<Button size="sm" variant="ghost" onClick={() => setValue(0)}>
					Reset
				</Button>
			</Row>
			<Note>Switch to `variant="success"` when the work finishes, so the check appears.</Note>
		</Column>
	);
}

export const Controlled: Story = { render: () => <UploadDemo /> };
