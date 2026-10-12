import { ChartTooltip, Sparkline } from "@optimusfoundry/quiet";

// ChartTooltip positions itself absolutely inside the plot, so each cell gives it a relative box.
const plot = { position: "relative", width: 280, height: 120 } as const;

export const SingleValue = () => (
	<div style={plot}>
		<ChartTooltip x={40} y={50} bounds={{ width: 280 }} title="Oct 12" rows={[{ name: "Runs", value: "203", color: "var(--q-chart-series-1)" }]} />
	</div>
);

export const Comparison = () => (
	<div style={plot}>
		<ChartTooltip
			x={40}
			y={60}
			bounds={{ width: 280 }}
			title="W43"
			rows={[
				{ name: "Orca", value: "624", color: "var(--q-chart-series-1)" },
				{ name: "Headless", value: "351", color: "var(--q-chart-series-2)" },
				{ name: "Scheduled", value: "184", color: "var(--q-chart-series-3)" },
			]}
		/>
	</div>
);

// Near the right edge it flips to the left of its anchor so it stays inside the plot.
export const OverASparkline = () => {
	const data = [112, 128, 96, 141, 158, 87, 74, 166, 182, 171, 194, 203];
	return (
		<div style={{ position: "relative", width: 240, height: 110, display: "grid", alignItems: "end" }}>
			<Sparkline data={data} width={240} height={48} area aria-label="Runs per day" />
			<ChartTooltip
				x={232}
				y={62}
				bounds={{ width: 240 }}
				title="Oct 12"
				rows={[
					{ name: "Runs", value: "203", color: "var(--q-chart-series-1)" },
					{ name: "Cost", value: "$18.402117" },
				]}
			/>
		</div>
	);
};
