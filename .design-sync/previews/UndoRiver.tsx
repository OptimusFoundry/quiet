import { UndoRiver } from "@optimusfoundry/quiet";

const box = { width: 560 } as const;
const HOUR = 3600e3;
const NOW = Date.UTC(2026, 9, 8, 12);

const RIVER = [
	{ id: 1, label: "Refunded $41.99 to Mira Osei", by: "Meerkat", kind: "agent" as const, at: NOW - 2.4 * HOUR },
	{ id: 2, label: "Changed default runner to Headless", by: "Ada Park", kind: "person" as const, at: NOW - 7 * HOUR },
	{ id: 3, label: "Deleted 2 artifacts", kind: "you" as const, at: NOW - 13 * HOUR },
	{ id: 4, label: "Published competitor-pricing.md", by: "Orca", kind: "agent" as const, at: NOW - 19 * HOUR },
	{ id: 5, label: "Rotated API key", by: "Leo Brandt", kind: "person" as const, at: NOW - 22 * HOUR },
];

export const Last24Hours = () => (
	<div style={box}>
		<UndoRiver items={RIVER} now={NOW} />
	</div>
);

export const JustNow = () => (
	<div style={box}>
		<UndoRiver
			items={[
				{ id: 1, label: "Archived Q3 onboarding", kind: "you" as const, at: NOW - 0.1 * HOUR },
				{ id: 2, label: "Paused web-message trigger", by: "Meerkat", kind: "agent" as const, at: NOW - 0.6 * HOUR },
			]}
			now={NOW}
		/>
	</div>
);

export const ShortWindow = () => (
	<div style={box}>
		<UndoRiver
			items={[
				{ id: 1, label: "Reran run-8812", by: "Meerkat", kind: "agent" as const, at: NOW - 0.2 * HOUR },
				{ id: 2, label: "Granted Orca publish", kind: "you" as const, at: NOW - 0.5 * HOUR },
				{ id: 3, label: "Invited Kai Ito", by: "Ada Park", kind: "person" as const, at: NOW - 0.8 * HOUR },
			]}
			now={NOW}
			window={HOUR}
			startLabel="now"
			endLabel="1 hour ago"
			hint="Actions stay undoable for an hour in this project."
		/>
	</div>
);
