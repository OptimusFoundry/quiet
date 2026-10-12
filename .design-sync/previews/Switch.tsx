import { Switch } from "@optimusfoundry/quiet";

const col = { display: "grid", gap: "var(--q-space-stack)", maxWidth: 360 } as const;

export const Default = () => (
	<div style={col}>
		<Switch label="Stream run output" defaultChecked />
		<Switch label="Pause on approval" />
	</div>
);

export const States = () => (
	<div style={col}>
		<Switch label="Off" />
		<Switch label="On" defaultChecked />
		<Switch label="Disabled" disabled />
		<Switch label="Disabled, on" disabled defaultChecked />
	</div>
);

export const Sizes = () => (
	<div style={col}>
		<Switch size="sm" label="Small" defaultChecked />
		<Switch size="md" label="Medium" defaultChecked />
		<Switch size="lg" label="Large" defaultChecked />
	</div>
);

export const SettingsRows = () => (
	<div style={{ display: "grid", gap: "var(--q-space-stack)", maxWidth: 480 }}>
		<Switch
			label="Run failures"
			description="Email Ada Park when a run on Orca fails."
			labelPosition="left"
			defaultChecked
			style={{ width: "100%" }}
		/>
		<Switch
			label="Weekly cost report"
			description="One email, Mondays at 08:00."
			labelPosition="left"
			defaultChecked
			style={{ width: "100%" }}
		/>
		<Switch
			label="New artifacts"
			description="A note every time a run publishes an artifact."
			labelPosition="left"
			style={{ width: "100%" }}
		/>
	</div>
);
