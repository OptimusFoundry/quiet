import { LineageChip } from "@optimusfoundry/quiet";

const MRR_FRESH = [
	{ label: "resend.events" },
	{ label: "stripe.subs" },
	{ label: "signups.raw", detail: "join user_id" },
	{ label: "signups.verified" },
	{ label: "dash.mrr" },
];
const MRR_STALE = MRR_FRESH.map((s) =>
	s.label === "stripe.subs" ? { ...s, stale: true, detail: "40 min late" } : s,
);
const figure = {
	display: "flex",
	alignItems: "baseline",
	gap: "var(--q-space-inline)",
	flexWrap: "wrap",
	width: 300,
} as const;
const big = {
	fontSize: "var(--q-text-2xl)",
	fontWeight: 600,
	fontVariantNumeric: "tabular-nums",
} as const;

export const Fresh = () => (
	<div style={figure}>
		<span style={big}>$13,204</span>
		<LineageChip label="MRR" steps={MRR_FRESH} freshness="4 min" />
	</div>
);

export const OneSourceLate = () => (
	<div style={{ ...figure, minHeight: 260, alignContent: "start" }}>
		<span style={big}>$13,204</span>
		<LineageChip label="MRR" steps={MRR_STALE} defaultOpen />
	</div>
);

export const Small = () => (
	<div style={figure}>
		<span>4,812 signups</span>
		<LineageChip size="sm" label="signups" steps={MRR_FRESH.slice(2, 4)} freshness="1 min" />
	</div>
);

export const RunCost = () => (
	<div style={{ ...figure, minHeight: 220, alignContent: "start" }}>
		<span style={big}>$0.902049</span>
		<LineageChip
			label="run cost"
			defaultOpen
			freshness="just now"
			steps={[
				{ label: "orca.tokens", detail: "per step" },
				{ label: "runs.cost", detail: "join run_id" },
				{ label: "run #4f2a" },
			]}
		/>
	</div>
);
