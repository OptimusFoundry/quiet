import { LineChart } from "@optimusfoundry/quiet";

const DAYS = Array.from({ length: 14 }, (_, i) => `Oct ${i + 1}`);
const RUNS = [112, 128, 96, 141, 158, 87, 74, 166, 182, 171, 194, 203, 118, 109];
const LAST = [98, 104, 92, 115, 121, 80, 69, 126, 133, 129, 140, 138, 95, 90];
const box = { width: 560 } as const;

export const RunsPerDay = () => (
	<div style={box}>
		<LineChart
			title="Runs per day · October"
			labels={DAYS}
			series={[
				{ name: "This fortnight", data: RUNS },
				{ name: "Previous fortnight", data: LAST },
			]}
			area
			xTicks={7}
			reference={{ value: 150, label: "Capacity 150/day" }}
		/>
	</div>
);

export const SuccessRate = () => (
	<div style={box}>
		<LineChart
			title="Run success rate"
			labels={DAYS}
			series={[{ name: "Success rate", data: [96.2, 97.1, 95.8, 97.4, 98.0, 96.9, 91.3, 94.6, 97.2, 98.1, 97.7, 98.4, 98.2, 98.6] }]}
			formatValue={(v) => `${v.toFixed(1)}%`}
			xTicks={7}
			reference={{ value: 95, label: "SLO 95%" }}
			highlight={{ index: 6 }}
		/>
	</div>
);

export const ByRunner = () => (
	<div style={box}>
		<LineChart
			title="Runs per week by runner"
			height={200}
			xTicks={8}
			labels={["W36", "W37", "W38", "W39", "W40", "W41", "W42", "W43"]}
			series={[
				{ name: "Orca", data: [412, 455, 470, 502, 538, 561, 590, 624] },
				{ name: "Headless", data: [280, 291, 305, 298, 322, 340, 336, 351] },
				{ name: "Scheduled", data: [150, 154, 160, 158, 171, 168, 180, 184] },
				{ name: "web-message", data: [64, 90, 81, 97, 120, 104, 118, 131] },
			]}
		/>
	</div>
);

export const InAPanel = () => (
	<div style={{ width: 420 }}>
		<LineChart
			aria-label="Spend per day, October"
			height={160}
			labels={DAYS}
			series={[{ name: "Spend", data: [12.4, 14.1, 9.8, 15.2, 17.9, 8.1, 6.6, 18.4, 19.9, 18.7, 21.3, 22.8, 13.2, 11.9] }]}
			formatValue={(v) => `$${v.toFixed(0)}`}
			area
			xTicks={4}
		/>
	</div>
);
