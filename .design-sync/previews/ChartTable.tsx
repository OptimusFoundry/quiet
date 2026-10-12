import { ChartLegend, ChartTable, Sparkline, Text } from "@optimusfoundry/quiet";

// ChartTable renders visually hidden (q-sr-only): it's the data behind a custom figure, for screen
// readers and copy-out. Each cell shows the figure it belongs to; the table itself is in the DOM.
const DAYS = ["Oct 8", "Oct 9", "Oct 10", "Oct 11", "Oct 12", "Oct 13", "Oct 14"];
const RUNS = [166, 182, 171, 194, 203, 118, 109];

export const BehindASparkline = () => (
	<figure style={{ display: "grid", gap: "var(--q-space-0-75)", margin: 0, width: 240 }}>
		<Text size="sm" color="muted">Runs per day, last 7 days</Text>
		<Sparkline data={RUNS} width={240} height={40} area aria-label="Runs per day, last 7 days" />
		<ChartTable caption="Runs per day, last 7 days" columns={["Day", "Runs"]} rows={DAYS.map((d, i) => [d, RUNS[i]])} />
	</figure>
);

export const BehindAComparison = () => (
	<figure style={{ display: "grid", gap: "var(--q-space-1-5)", margin: 0, width: 260 }}>
		<Text size="sm" color="muted">Cost per day, by runner</Text>
		<div style={{ display: "grid", gap: "var(--q-space-0-5)" }}>
			<Sparkline data={[14.2, 16.8, 15.1, 18.4, 19.9, 9.3, 8.7]} width={240} height={32} aria-label="Orca cost per day" />
			<Sparkline data={[6.1, 6.4, 5.9, 7.2, 7.5, 3.8, 3.4]} width={240} height={32} tone="ink" dot={false} aria-label="Headless cost per day" />
		</div>
		<ChartLegend kind="line" items={[{ name: "Orca" }, { name: "Headless" }]} />
		<ChartTable
			caption="Cost per day, by runner"
			columns={["Day", "Orca", "Headless"]}
			rows={[
				["Oct 8", "$14.20", "$6.10"],
				["Oct 9", "$16.80", "$6.40"],
				["Oct 10", "$15.10", "$5.90"],
				["Oct 11", "$18.40", "$7.20"],
				["Oct 12", "$19.90", "$7.50"],
				["Oct 13", "$9.30", "$3.80"],
				["Oct 14", "$8.70", "$3.40"],
			]}
		/>
	</figure>
);
