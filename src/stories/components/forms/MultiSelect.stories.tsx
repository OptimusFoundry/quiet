import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { MultiSelect } from "../../../components/forms/MultiSelect";
import { Column, Note } from "../Story";
import { FormDemo } from "./FormDemo";

const LABELS = [
	{ value: "eval", label: "eval" },
	{ value: "nightly", label: "nightly" },
	{ value: "billing", label: "billing" },
	{ value: "flaky", label: "flaky", description: "Retried at least twice" },
];

const REVIEWERS = [
	"Mira Chen",
	"Jonas Weber",
	"Priya Raman",
	"Tomás Ortega",
	"Aiko Sato",
	"Lena Fischer",
	"Sam Okafor",
	"Ines Duarte",
	"Noah Klein",
	"Ruth Abebe",
];

const meta = {
	title: "Components/Forms/MultiSelect",
	component: MultiSelect,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		label: "Run labels",
		options: LABELS,
		defaultValue: ["eval", "nightly"],
		placeholder: "Add labels",
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
	decorators: [
		(Story) => (
			<Column>
				<Story />
			</Column>
		),
	],
} satisfies Meta<typeof MultiSelect>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Searchable: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Above 8 options the menu gets a filter box; past `maxDisplay` pills collapse to +n.",
			},
		},
	},
	render: () => (
		<MultiSelect
			label="Approvers"
			fullWidth
			options={REVIEWERS}
			defaultValue={["Mira Chen", "Jonas Weber", "Priya Raman", "Aiko Sato"]}
			maxDisplay={2}
		/>
	),
};

export const Empty: Story = {
	render: () => (
		<MultiSelect
			label="Run labels"
			fullWidth
			options={LABELS}
			placeholder="No labels yet"
			helperText="Labels filter the runs list."
		/>
	),
};

export const States: Story = {
	render: () => (
		<>
			<MultiSelect
				label="Approvers"
				required
				fullWidth
				options={REVIEWERS}
				error="Add at least one approver."
			/>
			<MultiSelect label="Run labels" disabled fullWidth options={LABELS} defaultValue={["eval"]} />
		</>
	),
};

function ControlledDemo() {
	const [value, setValue] = useState<string[]>(["billing"]);
	return (
		<>
			<MultiSelect
				label="Run labels"
				fullWidth
				options={LABELS}
				value={value}
				onChange={setValue}
			/>
			<Note>{`value = [${value.map((v) => `"${v}"`).join(", ")}]`}</Note>
		</>
	);
}

export const Controlled: Story = { render: () => <ControlledDemo /> };

export const InANativeForm: Story = {
	parameters: {
		docs: {
			description: {
				story: "One hidden input per chosen value; read them with `FormData.getAll(name)`.",
			},
		},
	},
	render: () => (
		<FormDemo label="Approval policy" submit="Save policy">
			<MultiSelect
				name="approvers"
				label="Approvers"
				required
				fullWidth
				options={REVIEWERS}
				defaultValue={["Mira Chen"]}
			/>
		</FormDemo>
	),
};
