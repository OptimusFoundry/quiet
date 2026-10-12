import { Tabs, Text } from "@optimusfoundry/quiet";

export const RunSections = () => (
	<div style={{ width: 360 }}>
		<Tabs
			label="Run sections"
			defaultValue="transcript"
			tabs={[
				{ value: "transcript", label: "Transcript" },
				{ value: "artifacts", label: "Artifacts", count: 3 },
				{ value: "logs", label: "Logs" },
			]}
			panels={{
				transcript: <Text size="sm">Ada Park asked for the weekly approvals digest at 09:12.</Text>,
				artifacts: <Text size="sm">weekly-digest.md, approvals.csv, summary.json</Text>,
				logs: <Text size="sm">Orca runner · 41 tool calls · $0.902049</Text>,
			}}
		/>
	</div>
);

export const Pill = () => (
	<Tabs
		label="Run filter"
		variant="pill"
		size="sm"
		defaultValue="working"
		tabs={[
			{ value: "working", label: "Working", count: 3 },
			{ value: "awaiting", label: "Awaiting you", count: 2 },
			{ value: "archived", label: "Archived", disabled: true },
		]}
	/>
);

export const Enclosed = () => (
	<Tabs label="Cost range" variant="enclosed" size="sm" defaultValue="Week" tabs={["Day", "Week", "Month"]} />
);

export const Sizes = () => (
	<div style={{ display: "grid", gap: "var(--q-space-stack)" }}>
		<Tabs label="Small" size="sm" tabs={["Runs", "Artifacts", "Triggers"]} />
		<Tabs label="Medium" size="md" tabs={["Runs", "Artifacts", "Triggers"]} />
		<Tabs label="Large" size="lg" tabs={["Runs", "Artifacts", "Triggers"]} />
	</div>
);

export const FullWidth = () => (
	<div style={{ width: 320 }}>
		<Tabs label="Approval" variant="enclosed" fullWidth defaultValue="pending" tabs={[{ value: "pending", label: "Pending", count: 4 }, { value: "done", label: "Done" }]} />
	</div>
);
