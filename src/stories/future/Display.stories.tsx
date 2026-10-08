import type { Meta, StoryObj } from "@storybook/react-vite";
import { type CSSProperties, type ReactNode, useState } from "react";
import { Button } from "../../components/core/Button";
import { Card } from "../../components/display/Card";
import { Slider } from "../../components/forms/Slider";
import { BorderProgress } from "../../components/future/BorderProgress";
import { DecayingBadge } from "../../components/future/DecayingBadge";
import { GhostFuture } from "../../components/future/GhostFuture";
import { Concept, FuturePage, Spec } from "./Concept";

// Future components, display set — from the Claude Design "Future Components II" concepts
// (43 Decaying badge, 45 Ghost future, 46 Border progress), rebuilt on quiet tokens.
const HOUR = 3600e3;
const NOW = Date.UTC(2026, 9, 8, 12);

const row: CSSProperties = {
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	gap: 16,
	height: 48,
	padding: "0 16px",
	border: "1px solid var(--q-border)",
	borderRadius: "var(--q-radius-md)",
	fontSize: "var(--q-text-sm)",
};
const mono: CSSProperties = {
	fontFamily: "var(--q-font-mono)",
	fontSize: "var(--q-text-2xs)",
	letterSpacing: "var(--q-tracking-mono)",
	textTransform: "uppercase",
	color: "var(--q-fg-muted)",
};

function Row({ children }: { children: ReactNode }) {
	return <div style={row}>{children}</div>;
}

function DecayDemo() {
	const domains = ["join.sjocamp.co", "meerkat.protoapp.xyz", "orca.protoapp.xyz"];
	const [later, setLater] = useState(0);
	const [checked, setChecked] = useState([NOW - 2 * HOUR, NOW - 30 * HOUR, NOW - 64 * HOUR]);
	const now = NOW + later * HOUR;
	return (
		<div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 520 }}>
			<Slider
				label="Time passes"
				min={0}
				max={72}
				value={later}
				onChange={setLater}
				formatValue={(v) => `+${v}h`}
			/>
			{domains.map((d, i) => (
				<Row key={d}>
					<span>{d}</span>
					<DecayingBadge
						checkedAt={checked[i]}
						now={now}
						onRecheck={() => setChecked((c) => c.map((x, j) => (j === i ? now : x)))}
					>
						Verified
					</DecayingBadge>
				</Row>
			))}
		</div>
	);
}

function BorderDemo() {
	const [p, setP] = useState(40);
	return (
		<div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 380 }}>
			<BorderProgress
				value={p}
				label="Rendering 3 clips"
				valueText={`${p}%, about ${Math.ceil((100 - p) / 16)} min left`}
			>
				<Card eyebrow="TickUpToks" title="Rendering 3 clips" meta={`${p}%`}>
					1080×1920 · about {Math.ceil((100 - p) / 16)} min left
				</Card>
			</BorderProgress>
			<div style={{ display: "flex", gap: 8 }}>
				<Button
					size="sm"
					variant="secondary"
					onClick={() => setP((x) => Math.min(100, x + 20))}
					disabled={p >= 100}
				>
					Advance
				</Button>
				<Button size="sm" variant="ghost" onClick={() => setP(0)}>
					Restart
				</Button>
			</div>
		</div>
	);
}

const GHOSTS = [
	{ label: "Someone from Product Hunt", hint: "2 min after launch" },
	{ label: "Your first referral", hint: "day 3" },
	{ label: "A bounced address", hint: "day 4, auto-removed" },
	{ label: "Signup #100", hint: "around day 9" },
];
const REAL = ["mira@hey.com", "ada@park.dev", "jon@takeda.jp", "sam@lee.io", "kai@ito.co"];

function GhostDemo() {
	const [n, setN] = useState(0);
	return (
		<div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 520 }}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
				<strong style={{ fontWeight: 600 }}>Signups</strong>
				<span style={mono} aria-live="polite">
					{n} so far
				</span>
			</div>
			<GhostFuture
				ghosts={GHOSTS}
				caption="Dashed rows are what the first fortnight looked like for 40 similar campaigns. They fold away as real signups arrive."
			>
				{REAL.slice(0, n).map((e) => (
					<Row key={e}>
						<span>{e}</span>
						<span style={mono}>just now</span>
					</Row>
				))}
			</GhostFuture>
			<div style={{ display: "flex", gap: 8 }}>
				<Button
					size="sm"
					variant="secondary"
					onClick={() => setN((x) => Math.min(REAL.length, x + 1))}
					disabled={n >= REAL.length}
				>
					Add a signup
				</Button>
				<Button size="sm" variant="ghost" onClick={() => setN(0)}>
					Reset
				</Button>
			</div>
		</div>
	);
}

function DisplayPage() {
	return (
		<FuturePage
			title="Display"
			intro="Surfaces that tell you more than their contents: how old a fact is, how far along the work is, and what an empty list is about to become."
		>
			<Concept
				id="decaying-badge"
				index={43}
				name="Decaying badge"
				from="Status badge"
				idea="“Verified” was true when someone looked. The badge fades toward grey, then strikes itself through, so the age of a fact is visible and re-checking is the obvious gesture."
			>
				<Spec label="States">
					<DecayingBadge checkedAt={NOW - HOUR} now={NOW}>
						Verified
					</DecayingBadge>
					<DecayingBadge checkedAt={NOW - 40 * HOUR} now={NOW}>
						Verified
					</DecayingBadge>
					<DecayingBadge checkedAt={NOW - 70 * HOUR} now={NOW}>
						Verified
					</DecayingBadge>
					<DecayingBadge checkedAt={NOW - 96 * HOUR} now={NOW}>
						Verified
					</DecayingBadge>
					<DecayingBadge now={NOW}>Verified</DecayingBadge>
				</Spec>
				<Spec label="Sizes">
					<DecayingBadge size="sm" checkedAt={NOW - 5 * HOUR} now={NOW}>
						Synced
					</DecayingBadge>
					<DecayingBadge size="md" checkedAt={NOW - 5 * HOUR} now={NOW}>
						Synced
					</DecayingBadge>
					<DecayingBadge size="lg" checkedAt={NOW - 5 * HOUR} now={NOW}>
						Synced
					</DecayingBadge>
				</Spec>
				<Spec label="Re-check" col>
					<DecayDemo />
				</Spec>
			</Concept>
			<Concept
				id="ghost-future"
				index={45}
				name="Ghost future"
				from="Empty state"
				idea="Instead of “nothing here yet”, dashed rows show what the first fortnight looked like for similar lists. Each folds away as a real row arrives."
			>
				<Spec label="Filling up" col>
					<GhostDemo />
				</Spec>
			</Concept>
			<Concept
				id="border-progress"
				index={46}
				name="Border progress"
				from="Progress bar"
				idea="No bar inside the card. The container's own edge draws clockwise as the work completes, so any card tells you at a glance whether it has finished becoming itself."
			>
				<Spec label="Running" col>
					<BorderDemo />
				</Spec>
				<Spec label="States">
					<BorderProgress value={0} aria-label="Queued export">
						<Card eyebrow="Queued" title="Export" />
					</BorderProgress>
					<BorderProgress indeterminate aria-label="Syncing contacts">
						<Card eyebrow="Unknown length" title="Syncing" />
					</BorderProgress>
					<BorderProgress value={100} aria-label="Import">
						<Card eyebrow="Done" title="Import" />
					</BorderProgress>
				</Spec>
			</Concept>
		</FuturePage>
	);
}

const meta: Meta = { title: "Future/Display", parameters: { layout: "fullscreen" } };
export default meta;
export const All: StoryObj = { render: () => <DisplayPage /> };
