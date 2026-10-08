import type { Meta, StoryObj } from "@storybook/react-vite";
import { type CSSProperties, useEffect, useState } from "react";
import { Button } from "../../components/core/Button";
import { Table } from "../../components/data/Table";
import { Switch } from "../../components/forms/Switch";
import { AnomalyRibbon } from "../../components/future/AnomalyRibbon";
import { StreamingTable } from "../../components/future/StreamingTable";
import { ThresholdHandles } from "../../components/future/ThresholdHandles";
import { UncertaintyCell } from "../../components/future/UncertaintyCell";
import { Concept, FuturePage, Spec } from "./Concept";

// Future components, data set — from the Claude Design "Future Components IV" concepts
// (115 Anomaly ribbon, 117 Streaming table, 121 Threshold handles, 123 Uncertainty cells),
// rebuilt on quiet tokens. Demo data lives here, never in the components.
const wide: CSSProperties = { display: "grid", gap: 16, width: "100%", maxWidth: 640 };

const FIGURES = [
	{ id: "waitlist", name: "Spring waitlist", value: 4812 },
	{ id: "forecast", name: "Forecast · Oct", value: 5400, error: 620 },
	{ id: "eu", name: "EU after filter", value: 1760, error: 140 },
	{ id: "pro", name: "Pro conversions", value: 412, low: 380, high: 470 },
];

function UncertaintyDemo() {
	const [bands, setBands] = useState(true);
	return (
		<div style={wide}>
			<Switch label="Show bands" checked={bands} onChange={setBands} />
			<Table
				label="Signups, measured and forecast"
				columns={[
					{ key: "name", header: "Figure" },
					{
						key: "value",
						header: "Count",
						align: "right",
						width: 220,
						render: (r) => (
							<UncertaintyCell
								value={r.value}
								error={r.error}
								low={r.low}
								high={r.high}
								domain={[0, 6500]}
								showBand={bands}
							/>
						),
					},
				]}
				data={FIGURES}
			/>
		</div>
	);
}

// 40 days of bounce rate (%), with a few spikes and a late drift.
const BOUNCE = Array.from(
	{ length: 40 },
	(_, i) => 3 + Math.sin(i / 4) * 1.5 + (i % 9 === 0 ? 2.5 : 0) + (i > 30 ? 1.2 : 0),
);

// 60 days of signups with three surprises.
const SPIKES: Record<number, number> = { 17: 38, 41: -26, 52: 24 };
const SIGNUPS = Array.from({ length: 60 }, (_, i) => 40 + Math.sin(i / 5) * 8 + (SPIKES[i] ?? 0));
const ANOMALIES = Object.entries(SPIKES).map(([at, d]) => ({
	at: Number(at),
	label: `Sep ${Number(at) + 1}`,
	detail: `${d > 0 ? "+" : "−"}${Math.abs(d)} signups vs expected`,
}));

const NAMES = [
	"Ada Park",
	"Leo Brandt",
	"Mira Osei",
	"Jon Takeda",
	"Sam Lee",
	"Kai Ito",
	"Noor Haddad",
	"Tove Berg",
];
const COUNTRIES = ["DE", "NL", "GH", "JP", "US", "JP", "AE", "SE"];
type Signup = { id: number; name: string; country: string; score: number };
const signup = (n: number): Signup => ({
	id: n,
	name: NAMES[n % NAMES.length] ?? "",
	country: COUNTRIES[n % COUNTRIES.length] ?? "",
	score: 60 + ((n * 37) % 40),
});

function StreamDemo() {
	const [rows, setRows] = useState(() => [4, 3, 2, 1].map(signup));
	const [auto, setAuto] = useState(false);
	const arrive = () => setRows((r) => [signup((r[0]?.id ?? 0) + 1), ...r].slice(0, 40));
	useEffect(() => {
		if (!auto) return;
		const t = setInterval(arrive, 1600);
		return () => clearInterval(t);
	});
	return (
		<div style={wide}>
			<div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
				<Button size="sm" variant="secondary" onClick={arrive}>
					A signup arrives
				</Button>
				<Switch label="Stream every 1.6s" checked={auto} onChange={setAuto} />
			</div>
			<StreamingTable
				label="Signups, newest first"
				rows={rows}
				rowKey="id"
				maxRows={8}
				maxHeight={300}
				size="sm"
				columns={[
					{ key: "name", header: "Name", render: (r) => `${r.name} ${r.id}` },
					{ key: "country", header: "Country" },
					{ key: "score", header: "Fit", align: "right", render: (r) => `${r.score}%` },
				]}
			/>
		</div>
	);
}

function DataPage() {
	return (
		<FuturePage
			title="Data"
			intro="Tables and series that carry their own shape: doubt in the cells, alerts set on the chart, anomalies handed to you, and live rows that wait while you read."
		>
			<Concept
				id="anomaly-ribbon"
				index={115}
				name="Anomaly ribbon"
				from="Manual scanning"
				idea="A thin ribbon along any series marks where the model found something it didn't expect. You don't scan for the needle; the ribbon hands it to you, and choosing a mark takes you there."
			>
				<Spec label="Series" col>
					<div style={wide}>
						<AnomalyRibbon
							label="Signup anomalies"
							data={SIGNUPS}
							anomalies={ANOMALIES}
							summary="3 anomalies in 60 days"
						/>
					</div>
				</Spec>
			</Concept>
			<Concept
				id="streaming-table"
				index={117}
				name="Streaming table"
				from="Auto-refresh"
				idea="Live tables move under your finger. Pause, scroll down or put focus in the table and new rows wait behind a counter at the top; let them in when you're ready. Reading and watching stop fighting."
			>
				<Spec label="Live" col>
					<StreamDemo />
				</Spec>
			</Concept>
			<Concept
				id="threshold-handles"
				index={121}
				name="Threshold handles"
				from="Alert rule form"
				idea="Alert thresholds are lines you drag on the chart itself, and the count of historical firings updates as you move them. You set sensitivity by feel, with the false positives in view."
			>
				<Spec label="Band" col>
					<div style={wide}>
						<ThresholdHandles
							label="Bounce rate · alert band"
							data={BOUNCE}
							defaultValue={{ low: 1.8, high: 5.5 }}
							max={8}
							formatValue={(v) => `${v.toFixed(1)}%`}
							summary={(n, t) => `Would have fired ${n}× in ${t} days`}
						/>
					</div>
				</Spec>
				<Spec label="High only" col>
					<div style={wide}>
						<ThresholdHandles
							label="Spend per day"
							data={BOUNCE.map((v) => Math.round(v * 9))}
							defaultValue={{ high: 50 }}
							step={1}
							formatValue={(v) => `$${v}`}
							summary={(n, t) => `Would have fired ${n}× in ${t} days`}
						/>
					</div>
				</Spec>
			</Concept>
			<Concept
				id="uncertainty-cells"
				index={123}
				name="Uncertainty cells"
				from="Plain numeric cells"
				idea="A forecast and a count shouldn't look the same. Uncertain cells carry a small range beside the number, shaded on the column's scale, and measured ones are set heavier."
			>
				<Spec label="In a table" col>
					<UncertaintyDemo />
				</Spec>
			</Concept>
		</FuturePage>
	);
}

const meta: Meta = {
	title: "Future/Data",
	component: DataPage,
	parameters: { layout: "fullscreen" },
};
export default meta;
export const All: StoryObj = {};
