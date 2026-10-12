import { Headline } from "@optimusfoundry/quiet";

export const H2 = () => <Headline size="h2" lead="Runs that" accent="finish themselves" />;

export const Sizes = () => (
	<div style={{ display: "grid", gap: "var(--q-space-stack)" }}>
		<Headline size="h2" lead="Every run," accent="accounted for" />
		<Headline size="h3" lead="Artifacts your" accent="team ships" />
		<Headline size="h4" lead="Approvals" />
	</div>
);

export const Display = () => <Headline size="display" lead="Agents," accent="at work" />;

export const MoltenAccent = () => (
	<Headline size="h3" lead="One queue," accent="every runner" moltenAccent period={false} />
);

export const NoPeriod = () => <Headline size="h4" as="h2" lead="Recent runs" period={false} />;
