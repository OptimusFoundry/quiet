import { Icon, StatCard } from "@optimusfoundry/quiet";

const grid = { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--q-space-stack)", width: 460 } as const;

export const Default = () => (
	<div style={{ width: 240 }}>
		<StatCard label="Spend this month" value="$412.38" delta={12.4} period="vs Sep" />
	</div>
);

export const Variants = () => (
	<div style={{ display: "grid", gap: "var(--q-space-stack)", width: 240 }}>
		<StatCard label="Runs" value={1284} delta={8.1} period="vs last week" variant="outlined" />
		<StatCard label="Failure rate" value="2.1%" delta={-0.3} period="vs last week" variant="filled" />
		<StatCard label="Median cost" value="$0.064512" delta="0.00%" trend="neutral" variant="plain" />
	</div>
);

export const Trends = () => (
	<div style={grid}>
		<StatCard label="Approvals" value={46} delta={18} period="vs Sep" />
		<StatCard label="Avg. run time" value="3m 12s" delta={-6.5} trend="up" period="faster" />
		<StatCard label="Artifacts" value={312} icon={<Icon name="arrow-up" />} previousValue={270} />
		<StatCard label="Awaiting you" value={2} onClick={() => {}} period="Open approvals" />
	</div>
);
