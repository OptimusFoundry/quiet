import { ProbabilityToggle } from "@optimusfoundry/quiet";

const box = { width: 420 } as const;

const POLICY = [
	{ upTo: 4, label: "Off", description: "Meerkat never approves a refund without asking." },
	{ upTo: 34, label: "Rarely", description: "Approves alone only for refunds under $10." },
	{ upTo: 64, label: "Sometimes", description: "Approves alone when the order is under 30 days old." },
	{ upTo: 95, label: "Mostly", description: "Approves alone unless the customer has disputed before." },
	{ upTo: 100, label: "Always", description: "Approves alone. Ada Park sees it in the daily brief." },
];

export const Policy = () => (
	<div style={box}>
		<ProbabilityToggle label="Approve refunds without asking" levels={POLICY} defaultValue={80} />
	</div>
);

export const DefaultLevels = () => (
	<div style={{ ...box, display: "grid", gap: "var(--q-space-stack)" }}>
		<ProbabilityToggle label="Reply to web-message triggers" defaultValue={30} />
		<ProbabilityToggle label="Retry failed runs on Headless" defaultValue={100} />
	</div>
);

export const Off = () => (
	<div style={box}>
		<ProbabilityToggle label="Approve refunds without asking" levels={POLICY} defaultValue={0} />
	</div>
);

export const Disabled = () => (
	<div style={box}>
		<ProbabilityToggle label="Spend above the project budget" defaultValue={50} disabled />
	</div>
);
