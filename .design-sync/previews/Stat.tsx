import { Stat } from "@optimusfoundry/quiet";

export const Single = () => <Stat value="1,284" label="Runs this month" />;

export const Row = () => (
	<div style={{ display: "flex", gap: "var(--q-space-10)", flexWrap: "wrap" }}>
		<Stat value="128" label="Runs today" />
		<Stat value="$41.20" label="Spend this week" />
		<Stat value="97.9%" label="Completed" />
	</div>
);
