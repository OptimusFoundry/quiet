import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { Avatar } from "../../components/core/Avatar";
import { Button } from "../../components/core/Button";
import { BudgetLeash } from "../../components/future/BudgetLeash";
import { IntentBar } from "../../components/future/IntentBar";
import { RunScrubber } from "../../components/future/RunScrubber";
import { ScopeGrant } from "../../components/future/ScopeGrant";
import { UndoRiver } from "../../components/future/UndoRiver";
import { Concept, FuturePage, Spec } from "./Concept";

// Future components I, II + IV: handing work to agents — say it, scope it, leash it, replay it,
// and take it back.
const agent = <Avatar name="Meerkat" size="sm" shape="square" />;

const READING = [
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
	{
		key: "range",
		label: "Range",
		value: "this week",
		options: ["this week", "last 30d", "all time"],
	},
];

function IntentDemo() {
	const [status, setStatus] = useState<"idle" | "reading" | "read">("idle");
	const [chips, setChips] = useState(READING);
	const [text, setText] = useState("pause sjocamp campaigns bouncing over 5% this week");
	useEffect(() => {
		if (status !== "reading") return;
		const t = setTimeout(() => setStatus("read"), 700);
		return () => clearTimeout(t);
	}, [status]);
	const action = chips[0]?.value ?? "Pause";
	return (
		<IntentBar
			value={text}
			onChange={(t) => {
				setText(t);
				setStatus("idle");
			}}
			onSubmit={() => setStatus("reading")}
			status={status}
			chips={chips}
			onChipChange={(key, value) =>
				setChips((cs) => cs.map((c) => (c.key === key ? { ...c, value } : c)))
			}
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
						{action} 3 campaigns
					</Button>
				</>
			}
			suggestions={[
				"what bounced this week",
				"draft a launch post from the last 5 commits",
				"move Pro users to the new webhook",
			]}
		/>
	);
}

const SCOPES = [
	{ id: "read", label: "Read signups and analytics", defaultGranted: true },
	{ id: "draft", label: "Draft posts and emails", defaultGranted: true },
	{ id: "publish", label: "Publish to Bluesky, X, Threads", short: "publish", asks: true },
	{ id: "pause", label: "Pause or resume campaigns", defaultGranted: true },
	{ id: "bill", label: "Change plans or billing", short: "billing", asks: true },
];
const DURATIONS = [
	{ value: "1h", label: "1 hour", expires: "expires in 1 hour" },
	{ value: "today", label: "Today", expires: "expires at midnight" },
	{ value: "always", label: "Until revoked", expires: "until you revoke it" },
];

function ScopeDemo() {
	const [granted, setGranted] = useState(false);
	return (
		<ScopeGrant
			agent={agent}
			title="What Meerkat may do on Sjocamp"
			caption="Scoped to this workspace"
			scopes={SCOPES}
			durations={DURATIONS}
			defaultDuration="today"
			granted={granted}
			onGrant={() => setGranted(true)}
			onRevoke={() => setGranted(false)}
		/>
	);
}

function LeashDemo() {
	const [cap, setCap] = useState(40);
	const [spent, setSpent] = useState(8.4);
	const [running, setRunning] = useState(false);
	useEffect(() => {
		if (!running) return;
		const t = setInterval(() => setSpent((s) => Math.min(cap, +(s + 1.9).toFixed(2))), 500);
		return () => clearInterval(t);
	}, [running, cap]);
	return (
		<div style={{ display: "grid", gap: 16, width: "100%" }}>
			<BudgetLeash
				label="Meerkat · research run"
				agent={agent}
				spent={spent}
				cap={cap}
				onCapChange={setCap}
				presets={[20, 40, 80]}
				slack={10}
				atCap="asks before spending more"
			/>
			<div style={{ display: "flex", gap: 8 }}>
				<Button size="sm" variant="secondary" onClick={() => setRunning((r) => !r)}>
					{running ? "Pause spending" : "Let it spend"}
				</Button>
				<Button
					size="sm"
					variant="ghost"
					onClick={() => {
						setRunning(false);
						setSpent(8.4);
					}}
				>
					Reset
				</Button>
			</div>
		</div>
	);
}

const RUN = [
	{
		label: "Read 14 campaigns",
		detail: "I'll check bounce over 7 days — that's the rule from August.",
	},
	{ label: "Compute rates", detail: "Three are over 5%. Beta · EU is 7.9%, unusually high." },
	{
		label: "Look at Beta · EU",
		detail: "212 of 268 bounces are .gov.de. That's a domain problem, not content.",
	},
	{
		label: "Decide",
		detail: "Pausing all three is the rule, but EU might just need a filter. I'll ask.",
	},
	{ label: "Ask you", detail: "Question posted. Holding 3 tasks." },
];

const HOUR = 3600e3;
const NOW = Date.UTC(2026, 9, 8, 12);
const RIVER = [
	{
		id: 1,
		label: "Paused Founding members",
		by: "Meerkat",
		kind: "agent" as const,
		at: NOW - 2.4 * HOUR,
	},
	{ id: 2, label: "Changed domain", by: "Ada Park", kind: "person" as const, at: NOW - 7 * HOUR },
	{ id: 3, label: "Deleted 2 drafts", kind: "you" as const, at: NOW - 13 * HOUR },
	{
		id: 4,
		label: "Published launch thread",
		by: "Meerkat",
		kind: "agent" as const,
		at: NOW - 19 * HOUR,
	},
	{
		id: 5,
		label: "Rotated API key",
		by: "Leo Brandt",
		kind: "person" as const,
		at: NOW - 22 * HOUR,
	},
];

function RiverDemo() {
	const [items, setItems] = useState(RIVER);
	return (
		<div style={{ display: "grid", gap: 12, width: "100%" }}>
			<UndoRiver
				items={items}
				now={NOW}
				onUndo={(it) => setItems((xs) => xs.filter((x) => x.id !== it.id))}
			/>
			<div style={{ display: "flex", gap: 8 }}>
				<Button
					size="sm"
					variant="secondary"
					onClick={() =>
						setItems((xs) => [
							{
								id: Date.now(),
								label: "Archived Q4 promo",
								kind: "you" as const,
								at: NOW - 0.2 * HOUR,
							},
							...xs,
						])
					}
				>
					Do something
				</Button>
				<Button size="sm" variant="ghost" onClick={() => setItems(RIVER)}>
					Reset
				</Button>
			</div>
		</div>
	);
}

function Delegation() {
	return (
		<FuturePage
			title="Delegation"
			intro="Handing work to agents without handing over the keys: say what you want and check how it was read, grant narrow scopes for a while, leash the spend, replay what it thought, and take back anything still in the river."
		>
			<Concept
				id="intent-bar"
				index={1}
				name="Intent bar"
				from="Search, ⌘K, and most forms"
				idea="People say what they want; the system shows how it understood it as editable chips before anything runs. The chips are the form, written for you."
			>
				<Spec label="Say it" col>
					<IntentDemo />
				</Spec>
			</Concept>
			<Concept
				id="scope-grant"
				index={9}
				name="Scope grant"
				from="OAuth permission walls, tool settings"
				idea="Agents need narrow, time-boxed permission in plain words. The footer says what it can't do, because that is the part people actually want to read."
			>
				<Spec label="Permissions" col>
					<ScopeDemo />
				</Spec>
			</Concept>
			<Concept
				id="undo-river"
				index={40}
				name="Undo river"
				from="Toast · ⌘Z"
				idea="Every action by anyone drifts downstream for 24 hours, dimming as it ages. Pick anything still visible to pull it back. Undo becomes a place, not a keystroke."
			>
				<Spec label="Last 24 hours" col>
					<RiverDemo />
				</Spec>
			</Concept>
			<Concept
				id="budget-leash"
				index={99}
				name="Budget leash"
				from="Budget cap"
				idea="Spend as a leash, not a hard stop. The slack line goes taut as the agent spends; it slows before it stops, and you can see the tension from across the room."
			>
				<Spec label="Research run" col>
					<LeashDemo />
				</Spec>
			</Concept>
			<Concept
				id="run-scrubber"
				index={109}
				name="Run scrubber"
				from="Agent logs"
				idea="Scrub an agent's run like a video, with its reasoning at each step. Branch from any step with a correction and it reruns from there, keeping everything before."
			>
				<Spec label="Replay" col>
					<RunScrubber
						steps={RUN}
						defaultValue={2}
						label="Meerkat's run"
						agent={agent}
						caption={(i) => `Step ${i + 1} · what it was thinking`}
						actions={(i) => (
							<>
								<Button size="sm" variant="secondary">
									Branch from step {i + 1}
								</Button>
								<Button size="sm" variant="ghost">
									Correct this thought
								</Button>
							</>
						)}
					/>
				</Spec>
			</Concept>
		</FuturePage>
	);
}

const meta: Meta = {
	title: "Future/Delegation",
	component: Delegation,
	parameters: { layout: "fullscreen" },
};
export default meta;
export const All: StoryObj = {};
