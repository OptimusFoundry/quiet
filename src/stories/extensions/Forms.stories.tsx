import type { Meta, StoryObj } from "@storybook/react-vite";
import { type FormEvent, useRef, useState } from "react";
import {
	Button,
	Checkbox,
	DatePicker,
	Dropdown,
	Input,
	MultiSelect,
	Radio,
	Select,
	Slider,
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
	const submit = (e: FormEvent<HTMLFormElement>) => {
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
			<Input ref={refs.input} label="Email" />
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
