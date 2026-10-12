import { useEffect, useRef } from "react";
import { Dropdown } from "@optimusfoundry/quiet";

const col = { display: "grid", gap: "var(--q-space-stack)", maxWidth: 360 } as const;

const runners = [
	{ value: "orca", label: "Orca", description: "Hosted sandbox, scales to zero" },
	{ value: "headless", label: "Headless", description: "Browser runner for web tasks" },
	{ value: "local", label: "Local", description: "Your machine, via the CLI" },
	{ divider: true as const },
	{ value: "gpu", label: "GPU pool", description: "Enterprise plan only", disabled: true },
];

export const Default = () => (
	<div style={col}>
		<Dropdown label="Runner" options={runners} defaultValue="orca" helperText="Where new runs execute." />
	</div>
);

// The menu is absolutely positioned under the trigger; the wrapper gives it room in the card.
export const Open = () => {
	const ref = useRef<HTMLButtonElement>(null);
	useEffect(() => {
		ref.current?.click();
	}, []);
	return (
		<div style={{ ...col, minHeight: 360, alignContent: "start" }}>
			<Dropdown ref={ref} label="Runner" options={runners} defaultValue="headless" />
		</div>
	);
};

export const Sizes = () => (
	<div style={col}>
		<Dropdown size="sm" label="Small" options={["Last 7 days", "Last 30 days"]} defaultValue="Last 7 days" />
		<Dropdown size="md" label="Medium" options={["Last 7 days", "Last 30 days"]} defaultValue="Last 7 days" />
		<Dropdown size="lg" label="Large" options={["Last 7 days", "Last 30 days"]} defaultValue="Last 7 days" />
	</div>
);

export const Variants = () => (
	<div style={col}>
		<Dropdown label="Default" placeholder="Choose a trigger" options={["web-message", "schedule", "webhook"]} />
		<Dropdown
			variant="filled"
			label="Filled"
			placeholder="Choose a trigger"
			options={["web-message", "schedule", "webhook"]}
		/>
	</div>
);

export const States = () => (
	<div style={col}>
		<Dropdown
			label="Project"
			placeholder="Choose a project"
			required
			options={["Assistant", "Support triage", "Release notes"]}
			error="Pick a project for this trigger."
		/>
		<Dropdown label="Plan" options={["Team", "Enterprise"]} defaultValue="Team" disabled helperText="Billing owners change the plan." />
	</div>
);
