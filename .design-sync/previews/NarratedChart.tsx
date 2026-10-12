import { NarratedChart } from "@optimusfoundry/quiet";

const DAYS = Array.from({ length: 14 }, (_, i) => `Oct ${i + 1}`);
const RUNS = [112, 128, 96, 141, 158, 87, 74, 166, 182, 171, 194, 203, 118, 109];

export const RunsPerDay = () => (
	<div style={{ width: 600 }}>
		<NarratedChart
			title="Runs per day · October"
			labels={DAYS}
			series={[{ name: "Runs", data: RUNS }]}
			area
			xTicks={7}
			beats={[
				{ text: "Steady first week, around 120 runs a day.", range: [0, 4] },
				{ text: "Weekend dip: scheduled runs paused on the 6th and 7th.", range: [5, 6] },
				{ text: "Tickuptoks went live on the 8th and lifted every day after.", index: 7 },
				{ text: "Best day on the 12th: 203 runs.", index: 11 },
			]}
		/>
	</div>
);

export const SecondBeat = () => (
	<div style={{ width: 600 }}>
		<NarratedChart
			title="Run success rate"
			labels={DAYS}
			formatValue={(v) => `${v.toFixed(1)}%`}
			reference={{ value: 95, label: "SLO 95%" }}
			series={[{ name: "Success rate", data: [96.2, 97.1, 95.8, 97.4, 98.0, 96.9, 91.3, 94.6, 97.2, 98.1, 97.7, 98.4, 98.2, 98.6] }]}
			defaultBeat={1}
			beats={[
				{ text: "Above the SLO most days.", range: [0, 5] },
				{ text: "The 7th fell to 91.3% when the Headless runner timed out.", index: 6 },
				{ text: "Back above 98% since the retry fix.", range: [9, 13] },
			]}
		/>
	</div>
);
