import { DonutChart } from "@optimusfoundry/quiet";

const usd = (v: number) => `$${v.toFixed(2)}`;

export const CostByProject = () => (
	<div style={{ width: 460 }}>
		<DonutChart
			title="Cost by project · October"
			formatValue={usd}
			data={[
				{ label: "Tickuptoks", value: 117.64 },
				{ label: "Meerkat", value: 42.18 },
				{ label: "Orca site", value: 33.05 },
				{ label: "Research", value: 18.9 },
				{ label: "Billing", value: 9.72 },
			]}
		/>
	</div>
);

export const RunsByTrigger = () => (
	<div style={{ width: 400 }}>
		<DonutChart
			title="Runs by trigger"
			size={160}
			thickness={18}
			centerLabel="Runs"
			data={[
				{ label: "web-message", value: 1284 },
				{ label: "Schedule", value: 612 },
				{ label: "Webhook", value: 233 },
			]}
		/>
	</div>
);

export const Compact = () => (
	<div style={{ width: 180 }}>
		<DonutChart
			aria-label="Run success rate"
			size={140}
			thickness={14}
			legend={false}
			centerLabel="Success"
			centerValue="97.6%"
			sort={false}
			data={[
				{ label: "Succeeded", value: 976 },
				{ label: "Failed", value: 24 },
			]}
		/>
	</div>
);
