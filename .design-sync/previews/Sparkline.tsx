import { Sparkline, Text } from "@optimusfoundry/quiet";

const RUNS = [112, 128, 96, 141, 158, 87, 74, 166, 182, 171, 194, 203, 118, 109];

const kpi = { display: "grid", gap: "var(--q-space-0-5)" } as const;
const row = { display: "flex", alignItems: "center", gap: "var(--q-space-stack)" } as const;

export const Default = () => <Sparkline data={RUNS} aria-label="Runs per day, last 14 days" />;

export const KpiRow = () => (
	<div style={{ display: "grid", gap: "var(--q-space-stack)", width: 260 }}>
		{[
			{ label: "Runs today", value: "203", data: RUNS },
			{ label: "Failure rate", value: "2.4%", data: [5.2, 4.8, 4.9, 4.1, 3.8, 3.6, 3.1, 2.4], tone: "ink" as const },
			{ label: "Spend this month", value: "$221.49", data: [12, 31, 48, 70, 96, 131, 168, 221] },
		].map((k) => (
			<div key={k.label} style={kpi}>
				<Text size="sm" color="muted">{k.label}</Text>
				<div style={{ ...row, justifyContent: "space-between" }}>
					<Text size="lg" weight="semibold">{k.value}</Text>
					<Sparkline data={k.data} tone={k.tone} aria-label={`${k.label}, last 8 days`} />
				</div>
			</div>
		))}
	</div>
);

export const Tones = () => (
	<div style={{ display: "grid", gap: "var(--q-space-stack)" }}>
		<Sparkline data={RUNS} tone="accent" aria-label="Runs per day" />
		<Sparkline data={RUNS} tone="ink" aria-label="Runs per day, previous fortnight" />
		<Sparkline data={RUNS} area width={160} height={32} aria-label="Runs per day, with area" />
		<Sparkline data={RUNS} dot={false} tone="ink" aria-label="Runs per day, no end dot" />
	</div>
);

export const Inline = () => (
	<Text size="sm" style={{ display: "inline-flex", alignItems: "center", gap: "var(--q-space-0-75)" }}>
		Runs this week
		<Sparkline data={RUNS.slice(-7)} width={56} height={16} aria-label="Runs this week" />
		<strong>+12%</strong>
	</Text>
);
