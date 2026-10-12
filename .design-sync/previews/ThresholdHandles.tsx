import { ThresholdHandles } from "@optimusfoundry/quiet";

const box = { width: 520 } as const;

// 40 days of run failure rate (%), with a few spikes and a late drift.
const FAILURES = Array.from(
	{ length: 40 },
	(_, i) => 3 + Math.sin(i / 4) * 1.5 + (i % 9 === 0 ? 2.5 : 0) + (i > 30 ? 1.2 : 0),
);

export const Band = () => (
	<div style={box}>
		<ThresholdHandles
			label="Run failure rate · alert band"
			data={FAILURES}
			defaultValue={{ low: 1.8, high: 5.5 }}
			max={8}
			formatValue={(v) => `${v.toFixed(1)}%`}
			summary={(n, t) => `Would have fired ${n}× in ${t} days`}
		/>
	</div>
);

export const HighOnly = () => (
	<div style={box}>
		<ThresholdHandles
			label="Project spend per day"
			data={FAILURES.map((v) => Math.round(v * 9))}
			defaultValue={{ high: 50 }}
			step={1}
			formatValue={(v) => `$${v}`}
			summary={(n, t) => `Would have fired ${n}× in ${t} days`}
		/>
	</div>
);

export const LowOnly = () => (
	<div style={box}>
		<ThresholdHandles
			label="Runs per hour on Orca"
			data={FAILURES.map((v) => Math.round(60 - v * 6))}
			defaultValue={{ low: 28 }}
			min={0}
			max={70}
			step={1}
			summary={(n, t) => `Would have fired ${n}× in ${t} hours`}
		/>
	</div>
);
