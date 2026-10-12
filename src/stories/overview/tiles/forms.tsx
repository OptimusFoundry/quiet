import { Icon } from "../../../components/core/Icon";
import { Checkbox } from "../../../components/forms/Checkbox";
import { DatePicker } from "../../../components/forms/DatePicker";
import { Dropdown } from "../../../components/forms/Dropdown";
import { FileUpload } from "../../../components/forms/FileUpload";
import { FormField } from "../../../components/forms/FormField";
import { FormHint } from "../../../components/forms/FormHint";
import { Label } from "../../../components/forms/Label";
import { MultiSelect } from "../../../components/forms/MultiSelect";
import { Radio } from "../../../components/forms/Radio";
import { Select } from "../../../components/forms/Select";
import { Slider } from "../../../components/forms/Slider";
import { Stepper } from "../../../components/forms/Stepper";
import { Switch } from "../../../components/forms/Switch";
import { TextArea } from "../../../components/forms/TextArea";
import { TextField } from "../../../components/forms/TextField";
import type { Tile } from "./types";

export const tiles: Tile[] = [
	{
		name: "TextField",
		blurb: "A labelled text input with icons, a hint and an error.",
		render: () => (
			<div className="q-sb-tile-stack">
				<TextField size="sm" label="Workspace name" defaultValue="Acme research" />
				<TextField
					size="sm"
					label="Search runs"
					hideLabel
					placeholder="Search runs"
					leftIcon={<Icon name="search" />}
				/>
			</div>
		),
	},
	{
		name: "Select",
		blurb: "The native select in a pill field, for short fixed lists.",
		render: () => (
			<div className="q-sb-tile-stack">
				<Select
					size="sm"
					label="Data region"
					defaultValue="eu"
					options={[
						{ value: "eu", label: "Europe (Frankfurt)" },
						{ value: "us", label: "United States" },
					]}
				/>
			</div>
		),
	},
	{
		name: "Checkbox",
		blurb: "Soft checks for choices saved with a form, with an indeterminate state.",
		render: () => (
			<div className="q-sb-tile-stack">
				<Checkbox size="sm" label="All runners" indeterminate />
				<Checkbox size="sm" label="gpu-runner-01" defaultChecked />
				<Checkbox size="sm" label="cpu-runner-07" />
			</div>
		),
	},
	{
		name: "Switch",
		blurb: "A pill toggle for settings that apply at once.",
		render: () => (
			<div className="q-sb-tile-stack">
				<Switch size="sm" label="Email approvals" defaultChecked />
				<Switch size="sm" label="Pause idle runners" />
			</div>
		),
	},
	{
		name: "Radio",
		blurb: "One choice from a few visible options, with arrow-key moves.",
		render: () => (
			<Radio
				size="sm"
				label="Run priority"
				options={["Low", "Normal", "High"]}
				defaultValue="Normal"
			/>
		),
	},
	{
		name: "TextArea",
		blurb: "Multi-line input with a resize handle and an optional counter.",
		render: () => (
			<div className="q-sb-tile-stack">
				<TextArea
					size="sm"
					label="Approval note"
					rows={2}
					maxLength={140}
					defaultValue="Re-run on the larger runner."
				/>
			</div>
		),
	},
	{
		name: "Dropdown",
		blurb: "A custom select with descriptions, icons and type-ahead.",
		render: () => (
			<Dropdown
				size="sm"
				label="Runner"
				defaultValue="gpu-01"
				options={[
					{ value: "gpu-01", label: "gpu-runner-01" },
					{ value: "cpu-07", label: "cpu-runner-07" },
				]}
			/>
		),
	},
	{
		name: "MultiSelect",
		blurb: "Pick several values; they show as removable pills.",
		render: () => (
			<div className="q-sb-tile-stack">
				<MultiSelect
					size="sm"
					label="Run labels"
					options={["eval", "nightly", "billing"]}
					defaultValue={["eval", "nightly"]}
				/>
			</div>
		),
	},
	{
		name: "DatePicker",
		blurb: "A date field that opens a month calendar.",
		render: () => <DatePicker size="sm" label="Invoice due" defaultValue={new Date(2026, 9, 30)} />,
	},
	{
		name: "FormField",
		blurb: "Label, any control and its hint or error, wired for screen readers.",
		render: () => (
			<div className="q-sb-tile-stack">
				<FormField label="Billing email" required error="Enter a full email address." size="sm">
					<TextField size="sm" defaultValue="finance@" />
				</FormField>
			</div>
		),
	},
	{
		name: "Label",
		blurb: "Sentence-case field label with a required mark, sub text and an action.",
		render: () => (
			<div className="q-sb-tile-stack">
				<Label required subText="How long runs keep their artifacts.">
					Retention
				</Label>
			</div>
		),
	},
	{
		name: "FormHint",
		blurb: "The helper, error or success line under a field.",
		render: () => (
			<div className="q-sb-tile-stack">
				<FormHint>Shown on invoices.</FormHint>
				<FormHint variant="error">Enter a full email address.</FormHint>
				<FormHint variant="success">Domain verified.</FormHint>
			</div>
		),
	},
	{
		name: "Slider",
		blurb: "A hairline range slider for a value within bounds.",
		render: () => (
			<div className="q-sb-tile-stack">
				<Slider size="sm" label="Max parallel runs" min={1} max={16} defaultValue={6} />
			</div>
		),
	},
	{
		name: "Stepper",
		blurb: "Minus, value, plus: small counts like seats or retries.",
		render: () => (
			<div className="q-sb-tile-row">
				<Stepper size="sm" label="Seats" defaultValue={3} min={1} />
			</div>
		),
	},
	{
		name: "FileUpload",
		blurb: "A drop zone or button with a file list, validation and progress.",
		render: () => (
			<div className="q-sb-tile-stack">
				<FileUpload
					variant="button"
					aria-label="Artifacts"
					defaultFiles={[{ id: 1, name: "eval-results.csv", size: 482_000 }]}
				/>
			</div>
		),
	},
];
