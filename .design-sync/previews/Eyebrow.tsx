import { Eyebrow, Headline } from "@optimusfoundry/quiet";

export const Indexed = () => (
	<div style={{ display: "grid", gap: "var(--q-space-stack)" }}>
		<Eyebrow index="01">Runs</Eyebrow>
		<Eyebrow index="02">Artifacts</Eyebrow>
	</div>
);

export const Tones = () => (
	<div style={{ display: "grid", gap: "var(--q-space-stack)" }}>
		<Eyebrow>Project · agentworks-web</Eyebrow>
		<Eyebrow tone="ink">Billing · October 2026</Eyebrow>
	</div>
);

export const AboveATitle = () => (
	<div style={{ display: "grid", gap: "var(--q-space-stack)" }}>
		<Eyebrow index="03">Approvals</Eyebrow>
		<Headline size="h3" lead="Waiting on" accent="you" />
	</div>
);
