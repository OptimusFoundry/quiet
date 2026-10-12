import { Table, UncertaintyCell } from "@optimusfoundry/quiet";

const box = { width: 480 } as const;

const FIGURES = [
	{ id: "runs", name: "Runs this month", value: 4812 },
	{ id: "forecast", name: "Forecast · Nov", value: 5400, error: 620 },
	{ id: "headless", name: "Headless share", value: 1760, error: 140 },
	{ id: "approvals", name: "Approvals needed", value: 412, low: 380, high: 470 },
];

const table = (showBand: boolean) => (
	<Table
		label="Runs, measured and forecast"
		columns={[
			{ key: "name", header: "Figure" },
			{
				key: "value",
				header: "Count",
				align: "right",
				width: 220,
				render: (r: (typeof FIGURES)[number]) => (
					<UncertaintyCell
						value={r.value}
						error={r.error}
						low={r.low}
						high={r.high}
						domain={[0, 6500]}
						showBand={showBand}
					/>
				),
			},
		]}
		data={FIGURES}
	/>
);

export const InTable = () => <div style={box}>{table(true)}</div>;

export const WithoutBands = () => <div style={box}>{table(false)}</div>;

export const Cost = () => (
	<div style={box}>
		<Table
			label="Cost per run, by runner"
			columns={[
				{ key: "runner", header: "Runner" },
				{
					key: "cost",
					header: "Cost per run",
					align: "right",
					width: 220,
					render: (r: { runner: string; cost: number; error?: number }) => (
						<UncertaintyCell
							value={r.cost}
							error={r.error}
							domain={[0, 1.2]}
							format={(v) => `$${Number(v).toFixed(4)}`}
						/>
					),
				},
			]}
			data={[
				{ id: 1, runner: "Orca · measured", cost: 0.9020 },
				{ id: 2, runner: "Headless · estimate", cost: 0.6412, error: 0.18 },
				{ id: 3, runner: "Orca · Nov forecast", cost: 0.8800, error: 0.25 },
			]}
		/>
	</div>
);
