import { Container, Text } from "@optimusfoundry/quiet";

const band = {
	background: "var(--q-bg-subtle)",
	border: "1px dashed var(--q-border)",
	borderRadius: "var(--q-radius-sm)",
	padding: "var(--q-space-3)",
} as const;

export const Sizes = () => (
	<div style={{ display: "grid", gap: "var(--q-space-2)", width: 760 }}>
		<Container size="sm" padded={false} style={band}>
			<Text mono size="sm">size="sm" · 640px — forms</Text>
		</Container>
		<Container size={480} padded={false} style={band}>
			<Text mono size="sm">size={"{480}"}</Text>
		</Container>
		<Container size={320} padded={false} style={band}>
			<Text mono size="sm">size={"{320}"}</Text>
		</Container>
	</div>
);

export const Padded = () => (
	<div style={{ width: 760, background: "var(--q-bg-subtle)", padding: "var(--q-space-3) 0" }}>
		<Container size="md">
			<div style={{ ...band, background: "var(--q-bg)" }}>
				<Text size="sm">Settings · Workspace “Agentworks” — padded with 32px side gutters</Text>
			</div>
		</Container>
	</div>
);

export const StartAligned = () => (
	<div style={{ width: 760 }}>
		<Container size={420} padded={false} centered={false} style={band}>
			<Text size="sm">420px, start-aligned — a run detail column next to a log</Text>
		</Container>
	</div>
);
