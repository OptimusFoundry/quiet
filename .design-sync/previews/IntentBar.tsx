import { Button, IntentBar } from "@optimusfoundry/quiet";

const box = { width: 520 } as const;
const TEXT = "pause sjocamp campaigns bouncing over 5% this week";
const CHIPS = [
	{ key: "action", label: "Action", value: "Pause", options: ["Pause", "Archive", "Notify owner"] },
	{
		key: "target",
		label: "Target",
		value: "Campaigns · Sjocamp",
		options: ["Campaigns · Sjocamp", "Campaigns · all", "Signups · Sjocamp"],
	},
	{
		key: "where",
		label: "Where",
		value: "bounce rate > 5%",
		options: ["bounce rate > 5%", "bounce rate > 2%", "no signups"],
	},
	{ key: "range", label: "Range", value: "this week", options: ["this week", "last 30d", "all time"] },
];

export const Read = () => (
	<div style={box}>
		<IntentBar
			defaultValue={TEXT}
			status="read"
			chips={CHIPS}
			summary={
				<>
					Matches <strong>3 campaigns</strong> · 2,481 people keep their place
				</>
			}
			actions={
				<>
					<Button size="sm" variant="ghost">
						Preview
					</Button>
					<Button size="sm" arrow>
						Pause 3 campaigns
					</Button>
				</>
			}
		/>
	</div>
);

export const Idle = () => (
	<div style={box}>
		<IntentBar
			placeholder="Say what you want done"
			suggestions={[
				"what bounced this week",
				"draft a launch post from the last 5 commits",
				"rerun Orca on yesterday's web-message triggers",
			]}
		/>
	</div>
);

export const Reading = () => (
	<div style={box}>
		<IntentBar defaultValue="rerun failed Orca runs from yesterday under $1 each" status="reading" />
	</div>
);
