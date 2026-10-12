import { FilterTabs } from "@optimusfoundry/quiet";

export const Default = () => (
	<FilterTabs
		label="Run status"
		defaultValue="all"
		items={[
			{ value: "all", label: "All", count: 128 },
			{ value: "working", label: "Working", count: 3 },
			{ value: "awaiting", label: "Awaiting you", count: 2 },
			{ value: "failed", label: "Failed", count: 7 },
		]}
	/>
);

export const SmallNoCounts = () => (
	<FilterTabs label="Range" size="sm" showCounts={false} defaultValue="Week" items={["Day", "Week", "Month", "Year"]} />
);

export const WithDisabled = () => (
	<FilterTabs
		label="Runner"
		size="sm"
		defaultValue="orca"
		items={[
			{ value: "orca", label: "Orca", count: 94 },
			{ value: "headless", label: "Headless", count: 34 },
			{ value: "gpu", label: "GPU pool", count: 0, disabled: true },
		]}
	/>
);
