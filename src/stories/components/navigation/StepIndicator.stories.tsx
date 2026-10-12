import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../../components/core/Button";
import { StepIndicator } from "../../../components/navigation/StepIndicator";
import { Column, Note, Row } from "../Story";

const SETUP = [
	{ label: "Connect", description: "GitHub" },
	{ label: "Configure runner" },
	{ label: "Review" },
	{ label: "Launch" },
];

const meta = {
	title: "Components/Navigation/StepIndicator",
	component: StepIndicator,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		steps: SETUP,
		current: 2,
		label: "Workspace setup",
		orientation: "horizontal",
		size: "md",
	},
	argTypes: { onStepClick: { control: false } },
} satisfies Meta<typeof StepIndicator>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Vertical: Story = {
	args: {
		orientation: "vertical",
		current: 1,
		label: "Invoice import",
		steps: [
			{ label: "Upload", description: "invoices-october.csv" },
			{ label: "Map columns", description: "Match the file to invoice fields" },
			{ label: "Import", description: "312 rows" },
		],
	},
};

export const WithError: Story = {
	parameters: {
		docs: {
			description: { story: "A step's own `status` overrides the one `current` implies." },
		},
	},
	args: {
		orientation: "vertical",
		size: "sm",
		current: 1,
		label: "Invoice import",
		steps: [
			{ label: "Upload" },
			{ label: "Map columns", status: "error", description: "Two columns unmatched" },
			{ label: "Import" },
		],
	},
};

export const Sizes: Story = {
	render: (args) => (
		<Column wide>
			<StepIndicator {...args} size="sm" label="Workspace setup, small" />
			<StepIndicator {...args} size="md" label="Workspace setup, medium" />
			<StepIndicator {...args} size="lg" label="Workspace setup, large" />
		</Column>
	),
};

export const RomanNumerals: Story = { args: { numerals: "roman" } };

function ClickableDemo() {
	const [current, setCurrent] = useState(2);
	return (
		<Column wide>
			<StepIndicator
				label="Workspace setup"
				steps={SETUP}
				current={current}
				onStepClick={setCurrent}
			/>
			<Row>
				<Button
					size="sm"
					variant="secondary"
					disabled={current === 0}
					onClick={() => setCurrent((c) => Math.max(0, c - 1))}
				>
					Back
				</Button>
				<Button
					size="sm"
					disabled={current === SETUP.length - 1}
					onClick={() => setCurrent((c) => Math.min(SETUP.length - 1, c + 1))}
				>
					Next
				</Button>
			</Row>
			<Note>`onStepClick` makes completed steps buttons that go back to them.</Note>
		</Column>
	);
}

export const ClickableSteps: Story = { render: () => <ClickableDemo /> };
