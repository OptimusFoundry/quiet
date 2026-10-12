// Shared rows for the Table and DataGrid stories: agent runs in one workspace.

export type Run = {
	id: string;
	name: string;
	runner: string;
	status: "Succeeded" | "Running" | "Failed" | "Waiting for approval";
	started: string;
	duration: string;
	cost: number;
};

const NAMES = [
	"Reconcile March invoices",
	"Draft vendor replies",
	"Summarise support backlog",
	"Classify contract clauses",
	"Refresh pricing sheet",
	"Export audit trail",
	"Triage failed payments",
];
const RUNNERS = ["eu-west-2", "us-east-1", "ap-south-1"];
const STATUSES: Run["status"][] = [
	"Succeeded",
	"Running",
	"Succeeded",
	"Failed",
	"Waiting for approval",
];

export const RUNS: Run[] = Array.from({ length: 23 }, (_, i) => ({
	id: `run-${482 - i}`,
	name: NAMES[i % NAMES.length] ?? "",
	runner: RUNNERS[i % RUNNERS.length] ?? "",
	status: STATUSES[i % STATUSES.length] ?? "Succeeded",
	started: `${(i % 12) + 1} Oct, ${String(8 + (i % 10)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
	duration: `${(i * 3) % 14}m ${(i * 17) % 60}s`,
	cost: Math.round(((i * 37) % 180) + 12) / 10,
}));

export const money = (n: number) => `$${n.toFixed(2)}`;
