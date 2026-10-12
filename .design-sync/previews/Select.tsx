import { Select } from "@optimusfoundry/quiet";

const col = { display: "grid", gap: "var(--q-space-stack)", maxWidth: 360 } as const;

export const Default = () => (
	<div style={col}>
		<Select label="Runner" options={["Orca", "Headless", "Local"]} helperText="Where new runs execute." />
	</div>
);

export const Placeholder = () => (
	<div style={col}>
		<Select
			label="Trigger"
			placeholder="Choose a trigger"
			options={[
				{ value: "web-message", label: "web-message" },
				{ value: "schedule", label: "schedule" },
				{ value: "webhook", label: "webhook" },
				{ value: "email", label: "email (coming soon)", disabled: true },
			]}
		/>
	</div>
);

export const Sizes = () => (
	<div style={col}>
		<Select size="sm" label="Small" options={["Last 7 days", "Last 30 days"]} />
		<Select size="md" label="Medium" options={["Last 7 days", "Last 30 days"]} />
		<Select size="lg" label="Large" options={["Last 7 days", "Last 30 days"]} />
	</div>
);

export const Error = () => (
	<div style={col}>
		<Select
			label="Region"
			placeholder="Choose a region"
			options={["EU (Frankfurt)", "US (Virginia)"]}
			error="Pick a region before creating the project."
		/>
	</div>
);
