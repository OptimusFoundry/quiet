import { Badge, Button, EntityLink, Headline, Panel, QuietRoot, Text, TextField } from "@optimusfoundry/quiet";

const frame = {
	padding: "var(--q-space-2-5)",
	minWidth: 0,
	borderRadius: "var(--q-radius-lg)",
	display: "grid",
	gap: "var(--q-space-stack)",
	alignContent: "start",
} as const;

const label = { display: "block", marginBottom: "var(--q-space-1)" } as const;

function RunCard() {
	return (
		<Panel title="Run 233f76c2" description="web-message · Orca · $0.902049" actions={<Badge variant="warning">Awaiting you</Badge>}>
			<div style={{ display: "grid", gap: "var(--q-space-stack)" }}>
				<Text size="sm">
					<EntityLink href="/runs/233f76c2" kind="Run" id="233f76c2" mono /> wants to send 14 emails for Ada Park.
				</Text>
				<div style={{ display: "flex", gap: "var(--q-space-1)" }}>
					<Button size="sm" variant="secondary">Deny</Button>
					<Button size="sm" variant="primary">Approve</Button>
				</div>
			</div>
		</Panel>
	);
}

export const ThemeIsland = () => (
	<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--q-space-stack)", width: 760 }}>
		<div style={frame}>
			<Text size="xs" color="muted" style={label}>Default (foundry)</Text>
			<RunCard />
		</div>
		<QuietRoot theme="foundry-dark" density="app" style={frame}>
			<Text size="xs" color="muted" style={label}>{'<QuietRoot theme="foundry-dark">'}</Text>
			<RunCard />
		</QuietRoot>
	</div>
);

function DensitySample() {
	return (
		<div style={{ display: "grid", gap: "var(--q-space-stack)" }}>
			<Headline as="h3" size="h3" lead="Support triage" />
			<Text>Reads new Jira issues, drafts a reply and asks you before refunding.</Text>
			<TextField label="Project name" defaultValue="Support triage" />
			<div style={{ display: "flex", flexWrap: "wrap", gap: "var(--q-space-1)" }}>
				<Button variant="secondary">Cancel</Button>
				<Button variant="primary">Save</Button>
			</div>
		</div>
	);
}

export const Density = () => (
	<div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "var(--q-space-stack)", width: 780, alignItems: "start" }}>
		{(["marketing", "app", "compact"] as const).map((d) => (
			<QuietRoot key={d} density={d} style={{ ...frame, border: "1px solid var(--q-border)" }}>
				<Text size="xs" color="muted" style={label}>{`density="${d}"`}</Text>
				<DensitySample />
			</QuietRoot>
		))}
	</div>
);

export const AccentOverride = () => (
	<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--q-space-stack)", width: 760 }}>
		<div style={frame}>
			<Text size="xs" color="muted" style={label}>Theme accent (molten)</Text>
			<RunCard />
		</div>
		<QuietRoot density="app" accent="#2563eb" style={frame}>
			<Text size="xs" color="muted" style={label}>{'accent="#2563eb"'}</Text>
			<RunCard />
		</QuietRoot>
	</div>
);
