// Shared data for the chart stories and tiles: a month of agent runs in an agentworks workspace.

export const DAYS = Array.from({ length: 24 }, (_, i) => `Sep ${i + 1}`);

/** Completed runs per day, this month: the series someone cares about (the accent). */
export const RUNS = [
	42, 51, 38, 64, 72, 58, 80, 91, 77, 102, 96, 120, 88, 134, 141, 126, 150, 162, 148, 171, 180, 166,
	192, 204,
];

/** The same days last month: the comparison (ink). */
export const LAST_MONTH = [
	40, 44, 41, 47, 52, 49, 55, 58, 54, 61, 63, 60, 66, 70, 68, 72, 75, 71, 78, 80, 77, 83, 85, 88,
];

export const usd = (v: number) =>
	`$${v >= 1000 ? `${(v / 1000).toFixed(1).replace(/\.0$/, "")}k` : v}`;
