import { FormHint } from "@optimusfoundry/quiet";

const col = { display: "grid", gap: "var(--q-space-stack)", maxWidth: 420 } as const;

export const Default = () => <FormHint>Lowercase letters, numbers and dashes only.</FormHint>;

export const Variants = () => (
	<div style={col}>
		<FormHint>Runs on the Headless runner unless set.</FormHint>
		<FormHint icon>Each run costs about $0.902049.</FormHint>
		<FormHint variant="error">A project named "agentworks" already exists.</FormHint>
		<FormHint variant="success">Webhook verified.</FormHint>
	</div>
);

export const WithIcons = () => (
	<div style={col}>
		<FormHint icon>Ada Park will be asked to approve.</FormHint>
		<FormHint variant="error" icon>Budget must be above $1.00.</FormHint>
		<FormHint variant="success" icon>Domain verified.</FormHint>
	</div>
);
