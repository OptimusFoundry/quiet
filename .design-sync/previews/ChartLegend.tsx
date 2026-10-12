import { ChartLegend, LineChart, Sparkline } from "@optimusfoundry/quiet";

export const Dots = () => (
	<ChartLegend items={[{ name: "Orca" }, { name: "Headless" }, { name: "Scheduled" }]} />
);

export const Lines = () => (
	<ChartLegend
		kind="line"
		items={[{ name: "Orca" }, { name: "Headless" }, { name: "Scheduled" }, { name: "web-message" }, { name: "Webhook" }]}
	/>
);

// A custom figure (two sparklines) keyed by the same legend the built-in charts use.
export const WithCustomChart = () => (
	<figure style={{ display: "grid", gap: "var(--q-space-1-5)", margin: 0, width: 260 }}>
		<div style={{ display: "grid", gap: "var(--q-space-0-5)" }}>
			<Sparkline data={[112, 128, 96, 141, 158, 87, 74, 166, 182, 171, 194, 203]} width={240} height={36} aria-label="Runs per day, this fortnight" />
			<Sparkline data={[98, 104, 92, 115, 121, 80, 69, 126, 133, 129, 140, 138]} width={240} height={36} tone="ink" dot={false} aria-label="Runs per day, previous fortnight" />
		</div>
		<ChartLegend kind="line" items={[{ name: "This fortnight" }, { name: "Previous fortnight" }]} />
	</figure>
);

export const InLineChart = () => (
	<div style={{ width: 520 }}>
		<LineChart
			title="Runs per week by runner"
			height={180}
			labels={["W40", "W41", "W42", "W43"]}
			series={[
				{ name: "Orca", data: [538, 561, 590, 624] },
				{ name: "Headless", data: [322, 340, 336, 351] },
				{ name: "Scheduled", data: [171, 168, 180, 184] },
			]}
		/>
	</div>
);
