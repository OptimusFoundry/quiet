import { Radio } from "@optimusfoundry/quiet";

export const Default = () => (
	<Radio label="Runner" options={["Orca", "Headless", "Local"]} defaultValue="Orca" />
);

export const Row = () => (
	<Radio
		label="Trigger"
		direction="row"
		options={["web-message", "schedule", "webhook"]}
		defaultValue="web-message"
	/>
);

export const WithDescriptions = () => (
	<div style={{ maxWidth: 420 }}>
		<Radio
			label="Approval policy"
			defaultValue="ask"
			options={[
				{ value: "ask", label: "Ask before acting", description: "Ada Park approves every write." },
				{ value: "auto", label: "Act within budget", description: "Up to $5.00 per run, then pause." },
				{ value: "full", label: "Full autonomy", description: "Requires an Enterprise plan.", disabled: true },
			]}
		/>
	</div>
);

export const Error = () => (
	<Radio label="Region" options={["us-east-1", "eu-west-1", "ap-south-1"]} error="Pick a region for this project." />
);

export const Disabled = () => (
	<Radio label="Retention" options={["7 days", "30 days", "90 days"]} defaultValue="30 days" disabled />
);
