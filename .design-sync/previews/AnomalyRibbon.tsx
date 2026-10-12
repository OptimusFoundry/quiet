import { AnomalyRibbon } from "@optimusfoundry/quiet";

// 60 days of signups with three surprises.
const SPIKES: Record<number, number> = { 17: 38, 41: -26, 52: 24 };
const SIGNUPS = Array.from({ length: 60 }, (_, i) => 40 + Math.sin(i / 5) * 8 + (SPIKES[i] ?? 0));
const ANOMALIES = Object.entries(SPIKES).map(([at, d]) => ({
	at: Number(at),
	label: `Sep ${Number(at) + 1}`,
	detail: `${d > 0 ? "+" : "−"}${Math.abs(d)} signups vs expected`,
}));

export const Series = () => (
	<div style={{ width: 560 }}>
		<AnomalyRibbon
			label="Signup anomalies"
			data={SIGNUPS}
			anomalies={ANOMALIES}
			summary="3 anomalies in 60 days"
		/>
	</div>
);

export const Selected = () => (
	<div style={{ width: 560 }}>
		<AnomalyRibbon
			label="Signup anomalies"
			data={SIGNUPS}
			anomalies={ANOMALIES}
			defaultSelected={17}
			summary="3 anomalies in 60 days"
		/>
	</div>
);

// Hourly spend of the web-message trigger, one runaway run and one dead hour.
const COST = Array.from({ length: 48 }, (_, i) => 1.2 + Math.cos(i / 4) * 0.4 + (i === 30 ? 3.1 : 0) - (i === 11 ? 1.1 : 0));

export const RunCost = () => (
	<div style={{ width: 560 }}>
		<AnomalyRibbon
			label="Spend anomalies, web-message"
			data={COST}
			anomalies={[
				{ at: 11, label: "Tue 11:00", detail: "No runs for an hour on Orca" },
				{ at: 30, label: "Wed 06:00", detail: "run_8f2c cost 22× the median" },
			]}
			defaultSelected={30}
			summary="2 anomalies in 48 hours"
		/>
	</div>
);
