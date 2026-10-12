import { Input } from "@optimusfoundry/quiet";

const col = { display: "grid", gap: "var(--q-space-stack)", maxWidth: 360 } as const;

export const Default = () => (
	<div style={col}>
		<Input label="Work email" placeholder="you@company.com" />
	</div>
);

export const WithHint = () => (
	<div style={col}>
		<Input label="Project name" defaultValue="Assistant" hint="Shown on every run and artifact" />
	</div>
);

export const Error = () => (
	<div style={col}>
		<Input label="Monthly budget" defaultValue="$4" error="Runs on Orca need at least $10 a month." />
	</div>
);

export const Multiline = () => (
	<div style={col}>
		<Input
			label="Run instructions"
			multiline
			placeholder="What should the agent do when a web-message arrives?"
			hint="Sent as the system prompt for every run"
		/>
	</div>
);
