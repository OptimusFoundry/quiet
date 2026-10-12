import { DraftDiff } from "@optimusfoundry/quiet";

const box = { width: 460 } as const;
const HUNKS = [
	{ keep: "We just opened the ", before: "wait list", after: "waitlist", tail: " for Sjocamp. " },
	{
		before: "Signups are verified by email so the list stays clean and real.",
		after: "Every signup confirms by email, so the list stays real.",
		tail: " ",
	},
	{ keep: "First 500 get ", before: "lifetime Pro.", after: "Pro free for a year." },
];

export const Suggestions = () => (
	<div style={box}>
		<DraftDiff
			hunks={HUNKS}
			label="Meerkat suggests 3 edits"
			note="shorter, one claim per sentence"
			shipLabel="Schedule post"
			onShip={() => {}}
		/>
	</div>
);

export const PartlyReviewed = () => (
	<div style={box}>
		<DraftDiff
			hunks={HUNKS}
			defaultValue={["accepted", "rejected", "pending"]}
			label="Meerkat suggests 3 edits"
			note="shorter, one claim per sentence"
			shipLabel="Schedule post"
			onShip={() => {}}
		/>
	</div>
);

export const AllDecided = () => (
	<div style={box}>
		<DraftDiff
			hunks={[
				{
					keep: "Orca runs ",
					before: "every hour",
					after: "on every web-message trigger",
					tail: " and posts the summary to #ops. ",
				},
				{ keep: "Budget is capped at ", before: "$40 a day.", after: "$20 a day, then it asks." },
			]}
			defaultValue={["accepted", "accepted"]}
			label="Orca suggests 2 edits"
			note="match the new trigger and leash"
			shipLabel="Save runbook"
			onShip={() => {}}
		/>
	</div>
);
