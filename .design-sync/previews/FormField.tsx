import { Dropdown, FormField, Stepper, TextField } from "@optimusfoundry/quiet";

export const Default = () => (
	<div style={{ maxWidth: 360 }}>
		<FormField label="Runner" helperText="Orca keeps a warm sandbox between runs.">
			<Dropdown fullWidth defaultValue="Orca" options={["Orca", "Headless", "Local"]} />
		</FormField>
	</div>
);

export const Error = () => (
	<div style={{ maxWidth: 360 }}>
		<FormField label="Seats" required error="At least one seat.">
			<Stepper min={0} defaultValue={0} label="Seats" />
		</FormField>
	</div>
);

export const SubText = () => (
	<div style={{ maxWidth: 360 }}>
		<FormField label="Concurrent runs" subText="Per project." helperText="Extra runs queue until one finishes.">
			<Stepper min={1} max={16} defaultValue={4} label="Concurrent runs" />
		</FormField>
	</div>
);

export const Form = () => (
	<div style={{ display: "grid", gap: "var(--q-space-stack)", maxWidth: 400 }}>
		<FormField label="Trigger" required helperText="Fires when a message arrives on the web channel.">
			<Dropdown fullWidth defaultValue="web-message" options={["web-message", "schedule", "webhook"]} />
		</FormField>
		<FormField label="Retries" helperText="Before the run is marked failed.">
			<Stepper min={0} max={5} defaultValue={2} label="Retries" />
		</FormField>
		<TextField label="Approver" defaultValue="Ada Park" helperText="Gets a request before any write." />
	</div>
);
