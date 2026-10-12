import type { Meta, StoryObj } from "@storybook/react-vite";
import { type SubmitEvent, useRef, useState } from "react";
import {
	Button,
	Checkbox,
	DatePicker,
	Dropdown,
	FileUpload,
	FormHint,
	MultiSelect,
	Radio,
	Select,
	Slider,
	Stepper,
	Switch,
	TextArea,
	TextField,
} from "../../index";
import "./Forms.scss";

// Additions on top of the Claude Design catalog: native form participation and refs (G10),
// Select field chrome and TextArea hideLabel (G11).
const meta: Meta = { title: "Extensions/Forms", parameters: { layout: "padded" } };
export default meta;

const entries = (form: HTMLFormElement) =>
	[...new FormData(form).entries()].map(([k, v]) => [k, String(v)] as const);

function NativeFormDemo() {
	const [sent, setSent] = useState<ReadonlyArray<readonly [string, string]> | null>(null);
	const submit = (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSent(entries(e.currentTarget));
	};
	return (
		<form id="native-form" aria-label="Project brief" onSubmit={submit} className="q-sb-forms">
			<Checkbox name="terms" value="accepted" label="Accept the terms" required />
			<Checkbox name="news" label="Send the journal" defaultChecked />
			<Switch name="digest" label="Weekly digest" defaultChecked />
			<Slider name="budget" label="Budget" defaultValue={40} />
			<Radio name="platform" label="Platform" options={["Web", "iOS", "Both"]} />
			<Dropdown
				name="practice"
				label="Practice"
				required
				options={["Full-stack apps", "iOS apps", "Backends"]}
			/>
			<MultiSelect
				name="stack"
				label="Stack"
				defaultValue={["go", "react"]}
				options={[
					{ value: "go", label: "Go" },
					{ value: "react", label: "React" },
					{ value: "swift", label: "Swift" },
				]}
			/>
			<DatePicker name="start" label="Start" defaultValue={new Date(2026, 9, 12)} />
			<Switch name="locked" label="Locked (disabled, not submitted)" defaultChecked disabled />
			<div className="q-sb-forms__row">
				<Button type="submit">Submit</Button>
			</div>
			<output aria-label="Submitted data">
				{sent ? sent.map(([k, v]) => `${k}=${v}`).join("\n") : "Nothing submitted yet."}
			</output>
		</form>
	);
}

export const NativeForm: StoryObj = { render: () => <NativeFormDemo /> };

function RefsDemo() {
	const refs = {
		textField: useRef<HTMLInputElement>(null),
		textArea: useRef<HTMLTextAreaElement>(null),
		select: useRef<HTMLSelectElement>(null),
		input: useRef<HTMLInputElement>(null),
		checkbox: useRef<HTMLSpanElement>(null),
		switch: useRef<HTMLSpanElement>(null),
		slider: useRef<HTMLSpanElement>(null),
		radio: useRef<HTMLSpanElement>(null),
		dropdown: useRef<HTMLButtonElement>(null),
		multiSelect: useRef<HTMLSpanElement>(null),
		datePicker: useRef<HTMLButtonElement>(null),
	};
	return (
		<div id="refs" className="q-sb-forms">
			<TextField ref={refs.textField} label="Name" />
			<TextArea ref={refs.textArea} label="Brief" rows={2} />
			<Select ref={refs.select} label="Region" options={["EU", "US"]} />
			<TextField ref={refs.input} label="Email" />
			<Checkbox ref={refs.checkbox} label="Terms" />
			<Switch ref={refs.switch} label="Digest" />
			<Slider ref={refs.slider} label="Budget" />
			<Radio ref={refs.radio} label="Platform" options={["Web", "iOS"]} />
			<Dropdown ref={refs.dropdown} label="Practice" options={["Apps", "Backends"]} />
			<MultiSelect ref={refs.multiSelect} label="Stack" options={["Go", "React"]} />
			<DatePicker ref={refs.datePicker} label="Start" />
			<div className="q-sb-forms__row">
				{Object.entries(refs).map(([name, r]) => (
					<Button key={name} size="sm" variant="secondary" onClick={() => r.current?.focus()}>
						{`Focus ${name}`}
					</Button>
				))}
			</div>
		</div>
	);
}

export const Refs: StoryObj = { render: () => <RefsDemo /> };

const REGIONS = [
	{ value: "eu", label: "Europe" },
	{ value: "us", label: "United States" },
	{ value: "apac", label: "Asia-Pacific (waitlist)", disabled: true },
];

export const SelectChrome: StoryObj = {
	render: () => (
		<div id="select-chrome" className="q-sb-forms">
			<Select label="Region" placeholder="Choose a region" options={REGIONS} />
			<Select
				label="Region with help"
				helperText="Where your data is stored."
				options={REGIONS}
				defaultValue="eu"
			/>
			<Select
				label="Region required"
				error="Pick a region."
				placeholder="Choose"
				options={REGIONS}
			/>
			<Select label="Region flagged" error options={REGIONS} />
			<div className="q-sb-forms__row">
				<Select label="Small" size="sm" options={REGIONS} />
				<Select label="Medium" size="md" options={REGIONS} />
				<Select label="Large" size="lg" options={REGIONS} />
			</div>
			<TextArea label="Notes" hideLabel placeholder="Notes (label hidden)" rows={2} />
		</div>
	),
};

const TEAMS = [
	{ value: "design", label: "Design" },
	{ value: "eng", label: "Engineering" },
	{ value: "ops", label: "Operations", description: "Billing and vendors" },
	{ value: "research", label: "Research" },
];

// Every form control at the dense field height: pill fields, accent fills, icons from the set.
export const Overview: StoryObj = {
	render: () => (
		<div className="q-sb-forms">
			<TextField label="Name" placeholder="Ada Lovelace" helperText="As it appears on invoices." />
			<TextField label="Email" defaultValue="ada@" error="Enter a full email address." />
			<div className="q-sb-forms__row">
				<Select label="Region" options={REGIONS} defaultValue="eu" />
				<Dropdown label="Team" options={TEAMS} defaultValue="design" />
			</div>
			<div className="q-sb-forms__row">
				<MultiSelect label="Teams" options={TEAMS} defaultValue={["design", "eng"]} />
				<DatePicker label="Due date" />
			</div>
			<TextArea label="Notes" placeholder="Anything else?" maxLength={200} rows={3} />
			<div className="q-sb-forms__row">
				<Checkbox label="Email me" defaultChecked />
				<Checkbox label="Some teams" indeterminate />
				<Checkbox label="Unchecked" />
				<Switch label="Auto-renew" defaultChecked />
				<Switch label="Off" />
			</div>
			<Radio
				label="Plan"
				direction="row"
				defaultValue="pro"
				options={[
					{ value: "free", label: "Free" },
					{ value: "pro", label: "Pro" },
					{ value: "team", label: "Team" },
				]}
			/>
			<div className="q-sb-forms__row">
				<Slider label="Volume" defaultValue={40} showValue />
				<Stepper label="Seats" defaultValue={3} min={1} />
			</div>
			<div className="q-sb-forms__row">
				<FormHint>Helper text.</FormHint>
				<FormHint variant="error">Something went wrong.</FormHint>
				<FormHint variant="success">Saved.</FormHint>
			</div>
			<FileUpload
				label="Attachments"
				multiple
				hint="PDF or PNG, up to 10 MB"
				defaultFiles={[
					{ id: 1, name: "contract.pdf", size: 240000 },
					{ id: 2, name: "scan.png", size: 1200000, error: "Too large" },
				]}
			/>
			<FileUpload label="Logo" variant="button" hint="PNG, square" />
		</div>
	),
};
