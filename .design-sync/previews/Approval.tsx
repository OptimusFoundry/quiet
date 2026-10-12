import { Approval, Button } from "@optimusfoundry/quiet";

const box = { width: 460 } as const;

export const Plan = () => (
	<div style={box}>
		<Approval
			title="Pause 3 campaigns on Sjocamp"
			description="Signups stay saved and keep their place. Each owner gets one notice. Nothing is deleted."
			changes={[
				{ label: "Spring waitlist", before: "Live", after: "Paused", meta: "1,240 people" },
				{ label: "Founding members", before: "Live", after: "Paused", meta: "862 people" },
				{ label: "Beta · EU", before: "Live", after: "Paused", meta: "379 people" },
			]}
			consequences={[
				{ glyph: "↺", label: "Reversible for 24h" },
				{ glyph: "→", label: "3 notices" },
			]}
			confirmLabel="Pause 3 campaigns"
			confirmedLabel="Paused · undo for 24h"
			secondaryAction={
				<Button size="sm" variant="ghost">
					Edit plan
				</Button>
			}
		/>
	</div>
);

export const Confirmed = () => (
	<div style={box}>
		<Approval
			title="Move 2 triggers to the Headless runner"
			description="New web-message runs start on Headless. Runs already in flight finish on Orca."
			changes={[
				{ label: "web-message", before: "Orca", after: "Headless", meta: "~420 runs/day" },
				{ label: "pricing-watch", before: "Orca", after: "Headless", meta: "24 runs/day" },
			]}
			consequences={["Undo for 24 hours", "Ada Park notified"]}
			confirmLabel="Move 2 triggers"
			confirmedLabel="Moved · undo for 24h"
			confirmed
		/>
	</div>
);

export const Minimal = () => (
	<div style={box}>
		<Approval
			title="Archive the Q3 launch project"
			description="Its 38 artifacts become read-only. Scheduled runs stop."
			consequences={["Restorable for 30 days"]}
			confirmLabel="Archive project"
			confirmedLabel="Archived"
		/>
	</div>
);
