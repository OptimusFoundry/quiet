import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef } from "react";
import { Button } from "../../../components/core/Button";
import { Checkbox } from "../../../components/forms/Checkbox";
import { DatePicker } from "../../../components/forms/DatePicker";
import { Dropdown } from "../../../components/forms/Dropdown";
import { FileUpload } from "../../../components/forms/FileUpload";
import { FormField } from "../../../components/forms/FormField";
import { MultiSelect } from "../../../components/forms/MultiSelect";
import { Radio } from "../../../components/forms/Radio";
import { Select } from "../../../components/forms/Select";
import { Slider } from "../../../components/forms/Slider";
import { Stepper } from "../../../components/forms/Stepper";
import { Switch } from "../../../components/forms/Switch";
import { TextArea } from "../../../components/forms/TextArea";
import { TextField } from "../../../components/forms/TextField";
import { Column, Note, Row } from "../Story";
import { FormDemo } from "./FormDemo";

const REGIONS = [
	{ value: "eu", label: "Europe (Frankfurt)" },
	{ value: "us", label: "United States (Virginia)" },
];
const RUNNERS = ["gpu-runner-01", "gpu-runner-02", "cpu-runner-07"];
const APPROVERS = ["Mira Chen", "Jonas Weber", "Priya Raman"];

const meta = {
	title: "Components/Forms/FormField",
	component: FormField,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		label: "Workspace name",
		helperText: "Shown on invoices and in the workspace switcher.",
		required: false,
		size: "md",
		children: <TextField placeholder="Acme research" />,
	},
	argTypes: {
		label: { control: "text" },
		subText: { control: "text" },
		helperText: { control: "text" },
		error: { control: "text" },
		children: { control: false },
	},
	decorators: [
		(Story) => (
			<Column>
				<Story />
			</Column>
		),
	],
} satisfies Meta<typeof FormField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`error` replaces the helper text and sets `aria-invalid` on the control; `required` adds the mark, `aria-required` and the control's native `required`.",
			},
		},
	},
	render: () => (
		<>
			<FormField label="Billing email" required error="Enter a full email address.">
				<TextField type="email" defaultValue="finance@" />
			</FormField>
			<FormField label="Workspace ID" subText="Set when the workspace was created.">
				<TextField defaultValue="ws_7h2k9" disabled />
			</FormField>
		</>
	),
};

export const WithWidgets: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Widgets that aren't native inputs (Dropdown, DatePicker, Stepper…) are named through `aria-labelledby` pointing at the label.",
			},
		},
	},
	render: () => (
		<>
			<FormField label="Runner" helperText="Where the run executes.">
				<Dropdown fullWidth options={RUNNERS} placeholder="Choose a runner" />
			</FormField>
			<FormField label="Run on">
				<DatePicker />
			</FormField>
			<FormField label="Retries" error="At most 5 retries per run.">
				<Stepper label="Retries" defaultValue={5} min={0} />
			</FormField>
		</>
	),
};

export const NativeForm: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Every field in one native `<form>`: `name` submits, FormField's `required` blocks submit (it passes `required` to the control), disabled fields aren't sent.",
			},
		},
	},
	render: () => (
		<FormDemo label="New workspace" submit="Create workspace" multipart>
			<FormField label="Workspace name" required helperText="Shown on invoices.">
				<TextField name="workspace" placeholder="Acme research" />
			</FormField>
			<FormField label="Data region" required>
				<Select name="region" placeholder="Choose a region" options={REGIONS} />
			</FormField>
			<FormField label="Default runner" required>
				<Dropdown name="runner" fullWidth options={RUNNERS} placeholder="Choose a runner" />
			</FormField>
			<FormField label="Approvers" helperText="Runs over $50 wait for one of them.">
				<MultiSelect name="approvers" fullWidth options={APPROVERS} defaultValue={["Mira Chen"]} />
			</FormField>
			<FormField label="Billing starts">
				<DatePicker name="billingStart" defaultValue={new Date(2026, 10, 1)} />
			</FormField>
			<FormField label="Seats">
				<Stepper name="seats" label="Seats" defaultValue={3} min={1} max={50} />
			</FormField>
			<Slider name="parallel" label="Max parallel runs" min={1} max={16} defaultValue={4} />
			<Radio
				name="plan"
				label="Plan"
				direction="row"
				options={["Starter", "Team"]}
				defaultValue="Team"
			/>
			<FormField label="Notes">
				<TextArea name="notes" rows={2} placeholder="Anything the team should know?" />
			</FormField>
			<FileUpload name="contract" label="Signed contract" accept=".pdf" />
			<Switch name="digest" label="Weekly run digest" defaultChecked />
			<Switch name="audit" label="Audit log (set by your admin)" defaultChecked disabled />
			<Checkbox name="terms" value="accepted" label="Accept the data processing terms" required />
		</FormDemo>
	),
};

function RefsDemo() {
	const refs = {
		TextField: useRef<HTMLInputElement>(null),
		TextArea: useRef<HTMLTextAreaElement>(null),
		Select: useRef<HTMLSelectElement>(null),
		Dropdown: useRef<HTMLButtonElement>(null),
		MultiSelect: useRef<HTMLSpanElement>(null),
		DatePicker: useRef<HTMLButtonElement>(null),
		Stepper: useRef<HTMLInputElement>(null),
		Slider: useRef<HTMLSpanElement>(null),
		Radio: useRef<HTMLSpanElement>(null),
		Checkbox: useRef<HTMLSpanElement>(null),
		Switch: useRef<HTMLSpanElement>(null),
	};
	return (
		<>
			<TextField ref={refs.TextField} label="Run name" />
			<TextArea ref={refs.TextArea} label="Brief" rows={2} />
			<Select ref={refs.Select} label="Region" options={REGIONS} />
			<Dropdown ref={refs.Dropdown} label="Runner" options={RUNNERS} />
			<MultiSelect ref={refs.MultiSelect} label="Approvers" options={APPROVERS} />
			<DatePicker ref={refs.DatePicker} label="Run on" />
			<Stepper ref={refs.Stepper} label="Seats" defaultValue={3} />
			<Slider ref={refs.Slider} label="Parallel runs" />
			<Radio ref={refs.Radio} label="Plan" options={["Starter", "Team"]} />
			<Checkbox ref={refs.Checkbox} label="Accept the terms" />
			<Switch ref={refs.Switch} label="Weekly digest" />
			<Row>
				{Object.entries(refs).map(([name, r]) => (
					<Button key={name} size="sm" variant="secondary" onClick={() => r.current?.focus()}>
						{name}
					</Button>
				))}
			</Row>
			<Note>
				Every field's `ref` reaches its focusable control, so react-hook-form's `Controller` can
				focus it on error.
			</Note>
		</>
	);
}

export const FocusFromRefs: Story = { render: () => <RefsDemo /> };
