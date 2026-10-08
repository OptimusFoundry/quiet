import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { Button } from "../../components/core/Button";
import { AgentRun } from "../../components/future/AgentRun";
import { Approval } from "../../components/future/Approval";
import { CostMeter } from "../../components/future/CostMeter";
import { DraftDiff } from "../../components/future/DraftDiff";
import { HoldButton } from "../../components/future/HoldButton";
import { Concept, FuturePage, Spec } from "./Concept.jsx";

// Future components I + IV: interfaces for apps that act on your behalf.
const STEPS = [
	{ label: "Read 14 campaigns", tool: "signups.db", duration: "0.4s" },
	{ label: "Compute 7-day bounce rate", tool: "analytics", duration: "1.1s" },
	{ label: "Match 3 above 5%", tool: "filter", duration: "0.1s" },
	{ label: "Draft pause notices", tool: "meerkat", duration: "2.3s" },
	{ label: "Waiting for your approval", tool: "you" },
];

type RunStatus = "running" | "paused" | "stopped" | "done";

function AgentRunDemo() {
	const [current, setCurrent] = useState(0);
	const [status, setStatus] = useState<RunStatus>("running");
	useEffect(() => {
		if (status !== "running" || current >= STEPS.length - 1) return;
		const t = setTimeout(() => setCurrent((i) => i + 1), 1300);
		return () => clearTimeout(t);
	}, [current, status]);
	const restart = () => {
		setCurrent(0);
		setStatus("running");
	};
	return (
		<AgentRun
			title="Pausing bouncing campaigns"
			meta="Meerkat · started 4s ago"
			steps={STEPS}
			current={current}
			status={status}
			onPause={() => setStatus("paused")}
			onResume={() => setStatus("running")}
			onTakeOver={() => setStatus("paused")}
			onStop={() => setStatus("stopped")}
			actions={
				<>
					<Button size="sm">Review 3 notices</Button>
					<Button size="sm" variant="ghost" onClick={restart}>
						Discard
					</Button>
				</>
			}
		/>
	);
}

const HUNKS = [
	{ keep: "We just opened the ", before: "wait list", after: "waitlist", tail: " for Sjocamp. " },
	{
		before: "Signups are verified by email so the list stays clean and real.",
		after: "Every signup confirms by email, so the list stays real.",
		tail: " ",
	},
	{ keep: "First 500 get ", before: "lifetime Pro.", after: "Pro free for a year." },
];

function CostDemo() {
	const [t, setT] = useState(0);
	useEffect(() => {
		const id = setInterval(() => setT((x) => (x < 40 ? x + 1 : x)), 900);
		return () => clearInterval(id);
	}, []);
	return (
		<CostMeter
			label="Agents · today"
			budget={20}
			items={[
				{ label: "Replying to signups", value: 2.4 + t * 0.03, cap: 4 },
				{ label: "Drafting posts", value: 1.1 + t * 0.012, cap: 3 },
				{ label: "Rendering clips", value: 6.8 + t * 0.09, cap: 8 },
			]}
		/>
	);
}

function Agents() {
	const [shipped, setShipped] = useState(false);
	return (
		<FuturePage
			title="Agents"
			intro="Interfaces for apps that act on your behalf: work you can watch and interrupt, plans you approve by seeing them, edits you keep word by word, and spend you can read at a glance."
		>
			<Concept
				id="agent-run"
				index={2}
				name="Agent run"
				from="Spinners, progress bars, toasts"
				idea="Work that takes seconds and touches real data can't hide behind a spinner. Every step is named, timed and interruptible, and the last step is always a person."
			>
				<Spec label="Run" col>
					<AgentRunDemo />
				</Spec>
				<Spec label="Paused" col>
					<AgentRun
						title="Rendering launch clips"
						meta="Tickuptoks · 2 of 4"
						steps={STEPS}
						current={2}
						status="paused"
						onResume={() => {}}
					/>
				</Spec>
				<Spec label="Stopped" col>
					<AgentRun
						title="Researching competitors"
						meta="Research · hit its $40 leash"
						steps={STEPS}
						current={1}
						status="stopped"
					/>
				</Spec>
			</Concept>
			<Concept
				id="approval"
				index={3}
				name="Approval"
				from="Confirm dialogs"
				idea="“Are you sure?” asks a question nobody can answer. This shows the exact before → after, how far it reaches and how long it stays undoable. Holding the key is the one control that asks for effort."
			>
				<Spec label="Plan" col>
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
				</Spec>
				<Spec label="Hold button">
					<HoldButton confirmedLabel="Deleted">Delete workspace</HoldButton>
					<HoldButton variant="destructive" size="sm" duration={1400} confirmedLabel="Revoked">
						Revoke all keys
					</HoldButton>
				</Spec>
			</Concept>
			<Concept
				id="draft-diff"
				index={5}
				name="Draft diff"
				from="Textarea + regenerate"
				idea="Regenerating throws away what was right. Suggestions land inline as word-level hunks you accept or keep one at a time, and nothing ships while a hunk is open."
			>
				<Spec label="Suggestions" col>
					<DraftDiff
						hunks={HUNKS}
						label="Meerkat suggests 3 edits"
						note="shorter, one claim per sentence"
						shipLabel={shipped ? "Scheduled" : "Schedule post"}
						onShip={() => setShipped(true)}
					/>
				</Spec>
			</Concept>
			<Concept
				id="cost-meter"
				index={110}
				name="Cost meter"
				from="Usage page, billing alerts"
				idea="A meter that ticks in real money as agents work, split by what they're doing. Caps per kind of work, not per agent, because the question is always “is this worth it?”, never “who spent it?”."
			>
				<Spec label="Live" col>
					<CostDemo />
				</Spec>
			</Concept>
		</FuturePage>
	);
}

const meta: Meta = {
	title: "Future/Agents",
	component: Agents,
	parameters: { layout: "fullscreen" },
};
export default meta;
export const All: StoryObj = {};
