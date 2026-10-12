import { AgentRun, Button } from "@optimusfoundry/quiet";

const box = { width: 400 } as const;

const STEPS = [
	{ label: "Read 14 campaigns", tool: "signups.db", duration: "0.4s" },
	{ label: "Compute 7-day bounce rate", tool: "analytics", duration: "1.1s" },
	{ label: "Match 3 above 5%", tool: "filter", duration: "0.1s" },
	{ label: "Draft pause notices", tool: "meerkat", duration: "2.3s" },
	{ label: "Waiting for your approval", tool: "you" },
];

const noop = () => {};

export const Running = () => (
	<div style={box}>
		<AgentRun
			title="Pausing bouncing campaigns"
			meta="Meerkat · Orca · started 4s ago"
			steps={STEPS}
			current={2}
			status="running"
			onPause={noop}
			onTakeOver={noop}
			onStop={noop}
		/>
	</div>
);

export const AwaitingReview = () => (
	<div style={box}>
		<AgentRun
			title="Pausing bouncing campaigns"
			meta="Meerkat · Orca · 3.9s · $0.902049"
			steps={STEPS}
			current={4}
			status="running"
			onStop={noop}
			actions={
				<>
					<Button size="sm">Review 3 notices</Button>
					<Button size="sm" variant="ghost">
						Discard
					</Button>
				</>
			}
		/>
	</div>
);

export const Paused = () => (
	<div style={box}>
		<AgentRun
			title="Rendering launch clips"
			meta="Headless · run 2 of 4 · paused by Ada Park"
			steps={[
				{ label: "Fetch 3 approved scripts", tool: "artifacts", duration: "0.6s" },
				{ label: "Render 1080×1920 clips", tool: "ffmpeg", duration: "48s" },
				{ label: "Add captions", tool: "whisper" },
				{ label: "Upload to the launch folder", tool: "drive" },
				{ label: "Check the cuts", tool: "you" },
			]}
			current={2}
			status="paused"
			onResume={noop}
			onStop={noop}
		/>
	</div>
);

export const Stopped = () => (
	<div style={box}>
		<AgentRun
			title="Researching competitor pricing"
			meta="Research · hit its $40 leash"
			steps={[
				{ label: "Search 12 pricing pages", tool: "web-fetch", duration: "8.2s" },
				{ label: "Extract plan tiers", tool: "parser" },
				{ label: "Compare with our Pro plan", tool: "sheet" },
				{ label: "Read the summary", tool: "you" },
			]}
			current={1}
			status="stopped"
		/>
	</div>
);
