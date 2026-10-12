// Shared content for the chat stories and tiles: a workspace talking to Claude about its runs.

/** A small placeholder screenshot, so image attachments have something to show without network. */
export const IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" width="480" height="300" viewBox="0 0 480 300"><rect width="480" height="300" fill="#f4f4f5"/><rect x="40" y="40" width="240" height="18" rx="9" fill="#18181b"/><rect x="40" y="76" width="380" height="10" rx="5" fill="#d4d4d8"/><rect x="40" y="98" width="320" height="10" rx="5" fill="#d4d4d8"/><rect x="40" y="150" width="120" height="100" rx="14" fill="#e4e4e7"/><rect x="180" y="150" width="120" height="100" rx="14" fill="#e4e4e7"/><rect x="320" y="150" width="120" height="100" rx="14" fill="#e0531a"/></svg>',
)}`;

export const STARTERS = [
	{
		label: "Summarise this week’s runs",
		description: "Failures first, then the slowest",
		prompt: "Summarise this week’s runs, failures first.",
	},
	{
		label: "Draft a release note",
		description: "From the merged changes",
		prompt: "Draft a release note from this week’s merged changes.",
	},
	{
		label: "Explain an invoice",
		description: "Attach the PDF",
		prompt: "Explain the line items on this invoice.",
	},
	{
		label: "Review an approval",
		description: "What the agent wants to do, and why",
		prompt: "Review the pending approval for the billing runner.",
	},
];

export const REPLY = [
	"Here’s the shape of it. Runs were steady until Thursday, then the scheduled backfill carried most of the week:",
	"412 runs, 61% scheduled, and failures stayed under 3%. The one outlier is the self-hosted runner in eu-west, which queued twice as long as the rest.",
	"If you want this as a weekly brief, the query below is what I ran; you can schedule it as is.",
];

export const SQL = `select date_trunc('day', started_at) as day,
       count(*)                                  as runs,
       avg((trigger = 'schedule')::int)          as scheduled_share
from runs
where started_at > now() - interval '7 days'
group by 1
order by 1;`;
