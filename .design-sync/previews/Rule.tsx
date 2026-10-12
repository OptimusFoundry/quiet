import { Rule, Stack, Text } from "@optimusfoundry/quiet";

export const Default = () => (
	<div style={{ display: "grid", gap: "var(--q-space-stack)", maxWidth: 420 }}>
		<Text size="sm" color="heading">Run #4182 · web-message</Text>
		<Rule />
		<Text size="sm" color="muted">Finished on Orca in 42s · $0.902049</Text>
	</div>
);

export const Variants = () => (
	<div style={{ display: "grid", gap: "var(--q-space-stack)", maxWidth: 420 }}>
		<Text mono>Solid</Text>
		<Rule variant="solid" />
		<Text mono>Dashed</Text>
		<Rule variant="dashed" />
		<Text mono>Dotted</Text>
		<Rule variant="dotted" />
	</div>
);

export const WithLabel = () => (
	<div style={{ display: "grid", gap: "var(--q-space-stack)", maxWidth: 420 }}>
		<Rule label="Today" />
		<Rule label="Earlier runs" labelAlign="start" />
		<Rule label="or" variant="dashed" />
	</div>
);

export const Vertical = () => (
	<Stack direction="row" gap="md" align="center" style={{ height: 24 }}>
		<Text size="sm">Ada Park</Text>
		<Rule orientation="vertical" />
		<Text size="sm" color="muted">Owner</Text>
		<Rule orientation="vertical" />
		<Text size="sm" color="muted">3 projects</Text>
	</Stack>
);
