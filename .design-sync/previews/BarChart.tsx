import { BarChart } from "@optimusfoundry/quiet";

const usd = (v: number) => `$${v.toFixed(2)}`;
const box = { width: 560 } as const;

export const CostPerProject = () => (
	<div style={box}>
		<BarChart
			title="Cost per project · October"
			categories={["Meerkat", "Tickuptoks", "Research", "Orca site", "Billing"]}
			series={[{ name: "Cost", data: [42.18, 117.64, 18.9, 33.05, 9.72] }]}
			formatValue={usd}
			valueLabels
		/>
	</div>
);

export const GroupedByRunner = () => (
	<div style={box}>
		<BarChart
			title="Runs by runner, per week"
			categories={["W40", "W41", "W42", "W43"]}
			series={[
				{ name: "Orca", data: [538, 561, 590, 624] },
				{ name: "Headless", data: [322, 340, 336, 351] },
				{ name: "Scheduled", data: [171, 168, 180, 184] },
			]}
		/>
	</div>
);

export const StackedHorizontal = () => (
	<div style={box}>
		<BarChart
			title="Spend by kind of work"
			orientation="horizontal"
			stacked
			valueLabels
			formatValue={(v) => `$${Math.round(v)}`}
			categories={["Meerkat", "Tickuptoks", "Research", "Orca site"]}
			series={[
				{ name: "Replying", data: [24, 8, 3, 12] },
				{ name: "Drafting", data: [11, 14, 6, 4] },
				{ name: "Rendering", data: [2, 40, 0, 6] },
			]}
		/>
	</div>
);

export const StackedOutcomes = () => (
	<div style={box}>
		<BarChart
			title="Run outcomes per day"
			stacked
			height={200}
			categories={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
			series={[
				{ name: "Succeeded", data: [151, 172, 164, 188, 195, 80, 71] },
				{ name: "Needs approval", data: [9, 12, 8, 14, 11, 4, 2] },
				{ name: "Failed", data: [3, 5, 2, 6, 4, 3, 1] },
			]}
		/>
	</div>
);
