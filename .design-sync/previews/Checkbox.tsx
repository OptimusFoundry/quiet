import { Checkbox } from "@optimusfoundry/quiet";

const col = { display: "grid", gap: "var(--q-space-stack)", maxWidth: 360 } as const;

export const Default = () => (
	<div style={col}>
		<Checkbox label="Notify me when a run finishes" defaultChecked />
		<Checkbox label="Include failed runs in the weekly digest" />
	</div>
);

export const States = () => (
	<div style={col}>
		<Checkbox label="Unchecked" />
		<Checkbox label="Checked" defaultChecked />
		<Checkbox label="Some artifacts selected" indeterminate />
		<Checkbox label="Archived projects (locked by admin)" disabled />
		<Checkbox label="Disabled, checked" disabled defaultChecked />
	</div>
);

export const WithDescription = () => (
	<div style={col}>
		<Checkbox
			label="Allow Orca to open pull requests"
			description="The runner pushes to a branch; a human still merges."
			defaultChecked
		/>
		<Checkbox
			label="Run on every web-message trigger"
			description="Costs about $0.902049 per run on the Headless runner."
		/>
	</div>
);

export const Error = () => (
	<div style={col}>
		<Checkbox label="I understand this deletes all 14 artifacts" error="Confirm before deleting the project." />
	</div>
);

export const Sizes = () => (
	<div style={col}>
		<Checkbox size="sm" label="Small — dense tables and filters" defaultChecked />
		<Checkbox size="md" label="Medium — forms" defaultChecked />
		<Checkbox size="lg" label="Large — onboarding" defaultChecked />
	</div>
);
