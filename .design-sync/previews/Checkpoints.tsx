import { Checkpoints } from "@optimusfoundry/quiet";

const box = { width: 420 } as const;

const HISTORY = [
	{ id: "a", time: "09:12", who: "You", label: "Created Spring waitlist", changes: 0 },
	{ id: "b", time: "10:40", who: "Meerkat", agent: true, label: "Rewrote welcome email" },
	{ id: "c", time: "13:05", who: "You", label: "Enabled referrals" },
	{ id: "d", time: "14:02", who: "Meerkat", agent: true, label: "Paused 3 campaigns", changes: 3 },
	{ id: "e", time: "14:31", who: "Ada Park", label: "Changed domain to join.sjocamp.co" },
];

export const Current = () => (
	<div style={box}>
		<Checkpoints label="Spring waitlist history" checkpoints={HISTORY} onRestore={() => {}} />
	</div>
);

export const EarlierSelected = () => (
	<div style={box}>
		<Checkpoints
			label="Spring waitlist history"
			checkpoints={HISTORY}
			defaultValue={2}
			onRestore={() => {}}
		/>
	</div>
);

export const ArtifactHistory = () => (
	<div style={box}>
		<Checkpoints
			label="pricing-page.md history"
			changeWord="edit"
			restoreLabel="Restore draft"
			checkpoints={[
				{ id: "1", time: "Mon 11:02", who: "Ada Park", label: "First draft", changes: 0 },
				{ id: "2", time: "Mon 16:48", who: "Meerkat", agent: true, label: "Tightened the intro", changes: 4 },
				{ id: "3", time: "Tue 09:20", who: "Leo Brandt", label: "Added the Team tier" },
				{ id: "4", time: "Tue 10:05", who: "Meerkat", agent: true, label: "Rewrote FAQ answers", changes: 6 },
			]}
			defaultValue={1}
			onRestore={() => {}}
		/>
	</div>
);
