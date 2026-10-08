import type { Meta, StoryObj } from "@storybook/react-vite";
import { type CSSProperties, useState } from "react";
import { Button } from "../../components/core/Button";
import { type Checkpoint, Checkpoints } from "../../components/future/Checkpoints";
import { DoubtMarker } from "../../components/future/DoubtMarker";
import { LineageChip } from "../../components/future/LineageChip";
import { Receipt } from "../../components/future/Receipt";
import { Concept, FuturePage, Spec } from "./Concept.jsx";

// Future components, trust set — from the Claude Design "Future Components" concepts
// (04 Checkpoints, 66 Doubt marker, 67 Receipt, 122 Lineage chip), rebuilt on quiet tokens.
const mono: CSSProperties = {
	fontFamily: "var(--q-font-mono)",
	fontSize: "var(--q-text-2xs)",
	letterSpacing: "var(--q-tracking-mono)",
	textTransform: "uppercase",
	color: "var(--q-fg-muted)",
};

const HISTORY: Checkpoint[] = [
	{ id: "a", time: "09:12", who: "You", label: "Created Spring waitlist", changes: 0 },
	{ id: "b", time: "10:40", who: "Meerkat", agent: true, label: "Rewrote welcome email" },
	{ id: "c", time: "13:05", who: "You", label: "Enabled referrals" },
	{ id: "d", time: "14:02", who: "Meerkat", agent: true, label: "Paused 3 campaigns", changes: 3 },
	{ id: "e", time: "14:31", who: "Ada Park", label: "Changed domain to join.sjocamp.co" },
];

function CheckpointsDemo() {
	const [points, setPoints] = useState(HISTORY);
	const [sel, setSel] = useState(HISTORY.length - 1);
	return (
		<div style={{ width: "100%", maxWidth: 640 }}>
			<Checkpoints
				label="Spring waitlist history"
				checkpoints={points}
				value={sel}
				onChange={setSel}
				onRestore={(c) => {
					// Restoring is itself a checkpoint: history is never thrown away.
					const next = [
						...points,
						{ id: `r${points.length}`, time: "14:40", who: "You", label: `Restored to ${c.time}` },
					];
					setPoints(next);
					setSel(next.length - 1);
				}}
			/>
		</div>
	);
}

type Doubt = "doubt" | "checking" | "confirmed" | "revised";

function DoubtDemo() {
	const [st, setSt] = useState<Record<number, Doubt>>({});
	const check = (i: number, outcome: Doubt) => {
		setSt((s) => ({ ...s, [i]: "checking" }));
		setTimeout(() => setSt((s) => ({ ...s, [i]: outcome })), 1200);
	};
	return (
		<div style={{ display: "grid", gap: 16, maxWidth: 600 }}>
			<p style={{ margin: 0, fontSize: "var(--q-text-lg)", lineHeight: 1.7 }}>
				Signups rose 12% this month.{" "}
				<DoubtMarker
					status={st[1] ?? "doubt"}
					confidence={0.58}
					reason="Attribution comes from referrer headers; 4 in 10 signups arrived with none."
					revision="About 61% came from the Product Hunt feature; 39% had no referrer."
					onRecheck={() => check(1, "revised")}
				>
					Most came from the Product Hunt feature.
				</DoubtMarker>{" "}
				<DoubtMarker
					status={st[2] ?? "doubt"}
					confidence={0.72}
					reason="Verification ran on a sample of 400, not the full list."
					onRecheck={() => check(2, "confirmed")}
				>
					Verification held at 91%.
				</DoubtMarker>
			</p>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<span style={mono}>Press a claim you doubt</span>
				{Object.keys(st).length > 0 && (
					<Button size="sm" variant="ghost" onClick={() => setSt({})}>
						Reset
					</Button>
				)}
			</div>
		</div>
	);
}

function ReceiptDemo() {
	return (
		<Receipt
			actor="Meerkat"
			time="14:02"
			reference="#4f2a"
			reason="Three campaigns bounced above 5% for two days running."
			lines={[
				{ id: "1", verb: "Paused", object: "Spring waitlist" },
				{ id: "2", verb: "Paused", object: "Founding members" },
				{ id: "3", verb: "Paused", object: "Beta · EU" },
				{ id: "4", verb: "Sent", object: "3 owner notices", undoable: false },
				{ id: "5", verb: "Kept", object: "2,481 signups in place", undoable: false },
			]}
			footer="Reversible until tomorrow 14:02"
		/>
	);
}

const MRR_FRESH = [
	{ label: "resend.events" },
	{ label: "stripe.subs" },
	{ label: "signups.raw", detail: "join user_id" },
	{ label: "signups.verified" },
	{ label: "dash.mrr" },
];
const MRR_STALE = MRR_FRESH.map((s) =>
	s.label === "stripe.subs" ? { ...s, stale: true, detail: "40 min late" } : s,
);

const big: CSSProperties = {
	fontSize: "var(--q-text-3xl)",
	fontWeight: 600,
	letterSpacing: "var(--q-tracking-h3)",
	fontVariantNumeric: "tabular-nums",
};

function TrustPage() {
	return (
		<FuturePage
			title="Trust"
			intro="Components that show their working: the history you can return to, the claims the system isn't sure of, what an agent just did, and where a number came from."
		>
			<Concept
				id="checkpoints"
				index={4}
				name="Checkpoints"
				from="Undo stacks, audit logs"
				idea="When people and agents both edit, state needs a timeline you can scrub, not a hidden stack. Agent snapshots are square; human ones are round. Restoring is itself a checkpoint."
			>
				<Spec label="Timeline" col>
					<CheckpointsDemo />
				</Spec>
			</Concept>
			<Concept
				id="doubt-marker"
				index={66}
				name="Doubt marker"
				from="Comment threads"
				idea="Claims the system isn't sure of say so, and say why. Press one and it goes back to the data, then confirms the claim or rewrites it in place with the qualification it should have had."
			>
				<Spec label="In text" col>
					<DoubtDemo />
				</Spec>
				<Spec label="States">
					<DoubtMarker reason="Two sources disagree." confidence={0.4}>
						Unsure
					</DoubtMarker>
					<DoubtMarker status="checking" reason="Going back to the signups table.">
						Re-checking
					</DoubtMarker>
					<DoubtMarker status="confirmed" reason="Matched against 4,812 rows.">
						Confirmed
					</DoubtMarker>
					<DoubtMarker
						status="revised"
						revision="Rewritten"
						reason="The first figure double-counted invites."
					>
						Original
					</DoubtMarker>
				</Spec>
			</Concept>
			<Concept
				id="receipt"
				index={67}
				name="Receipt"
				from="Success toast"
				idea="After anything happens you get a receipt, not a toast. Every line is one effect, and every line that can be undone on its own carries its own undo. The receipt is the undo UI."
			>
				<Spec label="Agent action">
					<ReceiptDemo />
				</Spec>
			</Concept>
			<Concept
				id="lineage-chip"
				index={122}
				name="Lineage chip"
				from="Data catalog"
				idea="Every headline number wears a chip that says whether its upstream is fresh. Press it and the lineage unfolds: tables, joins, and which one is late. Trust the number or know exactly why not."
			>
				<Spec label="Fresh" col>
					<div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
						<span style={big}>$13,204</span>
						<LineageChip label="MRR" steps={MRR_FRESH} freshness="4 min" />
					</div>
				</Spec>
				<Spec label="One source late" col>
					<div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
						<span style={big}>$13,204</span>
						<LineageChip label="MRR" steps={MRR_STALE} defaultOpen />
					</div>
				</Spec>
				<Spec label="Small">
					<span style={{ fontVariantNumeric: "tabular-nums" }}>4,812 signups</span>
					<LineageChip size="sm" label="signups" steps={MRR_FRESH.slice(2, 4)} freshness="1 min" />
				</Spec>
			</Concept>
		</FuturePage>
	);
}

const meta: Meta = { title: "Future/Trust", parameters: { layout: "fullscreen" } };
export default meta;
export const All: StoryObj = { render: () => <TrustPage /> };
