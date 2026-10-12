import { Card } from "../../../components/display/Card";
import { AgentRun } from "../../../components/future/AgentRun";
import { AnomalyRibbon } from "../../../components/future/AnomalyRibbon";
import { Approval } from "../../../components/future/Approval";
import { BorderProgress } from "../../../components/future/BorderProgress";
import { BudgetLeash } from "../../../components/future/BudgetLeash";
import { Checkpoints } from "../../../components/future/Checkpoints";
import { ConsensusSlider } from "../../../components/future/ConsensusSlider";
import { CostMeter } from "../../../components/future/CostMeter";
import { DecayingBadge } from "../../../components/future/DecayingBadge";
import { DoubtMarker } from "../../../components/future/DoubtMarker";
import { DraftDiff } from "../../../components/future/DraftDiff";
import { ElasticSlider } from "../../../components/future/ElasticSlider";
import { GhostFuture } from "../../../components/future/GhostFuture";
import { HoldButton } from "../../../components/future/HoldButton";
import { HonestButton } from "../../../components/future/HonestButton";
import { IntentBar } from "../../../components/future/IntentBar";
import { LineageChip } from "../../../components/future/LineageChip";
import { ProbabilityToggle } from "../../../components/future/ProbabilityToggle";
import { Receipt } from "../../../components/future/Receipt";
import { RunScrubber } from "../../../components/future/RunScrubber";
import { ScopeGrant } from "../../../components/future/ScopeGrant";
import { StreamingTable } from "../../../components/future/StreamingTable";
import { ThresholdHandles } from "../../../components/future/ThresholdHandles";
import { UncertaintyCell } from "../../../components/future/UncertaintyCell";
import { UndoRiver } from "../../../components/future/UndoRiver";
import type { Tile } from "./types";
import "../../components/future/AnomalyRibbon.scss";
import "../../components/future/Approval.scss";
import "../../components/future/ScopeGrant.scss";
import "../../components/future/ThresholdHandles.scss";
import "../../components/future/UndoRiver.scss";

// The Agent & trust tiles (src/components/future/), approvals and runs first.
const HOUR = 3600e3;
const NOW = Date.UTC(2026, 9, 8, 12);
const SPIKES: Record<number, number> = { 9: 30, 22: -20 };
const SERIES = Array.from({ length: 30 }, (_, i) => 40 + Math.sin(i / 4) * 8 + (SPIKES[i] ?? 0));
const FAILURES = Array.from(
	{ length: 30 },
	(_, i) => 3 + Math.sin(i / 4) * 1.5 + (i % 9 === 0 ? 2.5 : 0),
);
const RUNS = [{ id: 318, name: "build-web #318", took: "42s" }];

export const tiles: Tile[] = [
	{
		name: "Approval",
		blurb: "Replaces the confirm dialog: each change as before → after, committed by a hold.",
		wide: true,
		render: () => (
			<div className="q-sb-tile-stack q-sb-approval--fit">
				<Approval
					title="Pause the nightly export"
					changes={[
						{ label: "Nightly export", before: "Live", after: "Paused", meta: "1,240 runs" },
					]}
					consequences={[{ icon: "undo", label: "Reversible for 24h" }]}
					confirmLabel="Pause export"
				/>
			</div>
		),
	},
	{
		name: "HoldButton",
		blurb: "Hold to confirm, for the actions that can't be taken back.",
		render: () => (
			<div className="q-sb-tile-row">
				<HoldButton size="sm">Delete workspace</HoldButton>
				<HoldButton size="sm" variant="destructive">
					Revoke keys
				</HoldButton>
			</div>
		),
	},
	{
		name: "AgentRun",
		blurb: "An agent's run as named, timed steps you can pause, take over or stop.",
		wide: true,
		render: () => (
			<AgentRun
				title="Reconciling October invoices"
				meta="runner-07 · started 4s ago"
				steps={[
					{ label: "Read 42 open invoices", tool: "billing.db", duration: "0.4s" },
					{ label: "Match bank payments", tool: "ledger" },
				]}
				current={1}
				status="running"
			/>
		),
	},
	{
		name: "CostMeter",
		blurb: "Live agent spend in real money, split by kind of work, each against its cap.",
		render: () => (
			<CostMeter
				label="Runners · today"
				budget={20}
				items={[
					{ label: "Invoices", value: 2.4, cap: 4 },
					{ label: "Artifacts", value: 7.6, cap: 8 },
				]}
			/>
		),
	},
	{
		name: "BudgetLeash",
		blurb: "A spend cap drawn as a leash that pulls taut as the agent spends.",
		render: () => (
			<BudgetLeash label="runner-11 · research" agent="runner-11" spent={31} cap={40} />
		),
	},
	{
		name: "DraftDiff",
		blurb: "Suggestions land inline as word-level edits you accept or keep one by one.",
		wide: true,
		render: () => (
			<DraftDiff
				label="runner-07 suggests 2 edits"
				hunks={[
					{ keep: "Your invoice is ", before: "now available to view", after: "ready", tail: ". " },
					{ keep: "Payment is due ", before: "within 30 days.", after: "by November 30." },
				]}
				defaultValue={["accepted", "pending"]}
				shipLabel="Send"
			/>
		),
	},
	{
		name: "Checkpoints",
		blurb: "Shared history you can scrub and restore; agent snapshots square, human ones round.",
		wide: true,
		render: () => (
			<div className="q-sb-tile-stack">
				<Checkpoints
					label="Workspace history"
					checkpoints={[
						{ time: "09:12", who: "You", label: "Created the workspace", changes: 0 },
						{ time: "10:40", who: "runner-07", agent: true, label: "Rewrote the template" },
						{ time: "14:31", who: "Ada Park", label: "Moved billing to the EU" },
					]}
				/>
			</div>
		),
	},
	{
		name: "DoubtMarker",
		blurb: "Marks a claim the system isn't sure of, says why, and re-checks it on demand.",
		render: () => (
			<span>
				Spend rose 12%.{" "}
				<DoubtMarker reason="4 in 10 runs had no tag." confidence={0.58}>
					Most came from the EU backfill.
				</DoubtMarker>
			</span>
		),
	},
	{
		name: "DecayingBadge",
		blurb: "A status badge that fades as its fact ages, then strikes itself through.",
		render: () => (
			<div className="q-sb-tile-row">
				<DecayingBadge size="sm" checkedAt={NOW - HOUR} now={NOW}>
					Verified
				</DecayingBadge>
				<DecayingBadge size="sm" checkedAt={NOW - 50 * HOUR} now={NOW}>
					Verified
				</DecayingBadge>
				<DecayingBadge size="sm" checkedAt={NOW - 96 * HOUR} now={NOW}>
					Verified
				</DecayingBadge>
			</div>
		),
	},
	{
		name: "BorderProgress",
		blurb: "The container's own edge is the progress bar, drawing clockwise as work completes.",
		render: () => (
			<BorderProgress value={65} aria-label="Invoice sync">
				<Card eyebrow="runner-02" title="Invoice sync" meta="65%" />
			</BorderProgress>
		),
	},
	{
		name: "GhostFuture",
		blurb: "An empty state that shows the likely first rows, each folding away as one arrives.",
		render: () => (
			<GhostFuture
				ghosts={[
					{ label: "Your first scheduled run", hint: "tonight" },
					{ label: "A run waiting for approval", hint: "day 2" },
				]}
			/>
		),
	},
	{
		name: "ElasticSlider",
		blurb: "A slider that resists past its safe line instead of showing an error.",
		render: () => (
			<ElasticSlider
				label="Daily run limit"
				safe={60}
				defaultValue={40}
				formatValue={(n) => `${n * 100} / day`}
			/>
		),
	},
	{
		name: "ConsensusSlider",
		blurb: "A shared setting that shows where teammates and agents set theirs.",
		render: () => (
			<ConsensusSlider
				label="Pro seat price"
				min={9}
				max={79}
				defaultValue={29}
				showMeet={false}
				formatValue={(n) => `$${n}`}
				others={[
					{ name: "Ada Park", value: 24 },
					{ name: "runner-07", value: 35, agent: true },
				]}
			/>
		),
	},
	{
		name: "AnomalyRibbon",
		blurb: "Marks where a series did something unexpected, so you don't have to scan for it.",
		wide: true,
		render: () => (
			<div className="q-sb-tile-stack q-sb-anomaly-ribbon--fit">
				<AnomalyRibbon
					label="Run volume anomalies"
					data={SERIES}
					anomalies={[
						{ at: 9, label: "Sep 10", detail: "+30 runs vs expected" },
						{ at: 22, label: "Sep 23", detail: "−20 runs vs expected" },
					]}
				/>
			</div>
		),
	},
	{
		name: "Receipt",
		blurb:
			"What an agent did, one line per effect, with an undo on each line that can be taken back.",
		render: () => (
			<Receipt
				actor="Meerkat"
				time="14:02"
				lines={[
					{ id: "1", verb: "Paused", object: "Runner eu-west-2", undoable: true },
					{ id: "2", verb: "Sent", object: "1 owner notice" },
				]}
			/>
		),
	},
	{
		name: "IntentBar",
		blurb: "Say what you want; how it was read comes back as editable chips before anything runs.",
		wide: true,
		render: () => (
			<IntentBar
				defaultValue="pause eu-west runners failing over 5%"
				status="read"
				chips={[
					{ key: "action", label: "Action", value: "Pause" },
					{ key: "target", label: "Target", value: "Runners · eu-west" },
					{ key: "where", label: "Where", value: "failure rate > 5%" },
				]}
			/>
		),
	},
	{
		name: "ScopeGrant",
		blurb: "Narrow, time-boxed permission for an agent, in plain words, with what it can't do.",
		render: () => (
			<ScopeGrant
				title="What Meerkat may do"
				onGrant={() => {}}
				className="q-sb-scope-grant--tile"
				scopes={[{ id: "publish", label: "Publish changelog", short: "publish", asks: true }]}
			/>
		),
	},
	{
		name: "UndoRiver",
		blurb:
			"Everything anyone did today drifts downstream, dimming; pull anything back while it's there.",
		wide: true,
		render: () => (
			<div className="q-sb-tile-stack">
				<UndoRiver
					className="q-sb-undo-river--tile"
					now={NOW}
					hint={null}
					items={[
						{ id: 1, label: "Paused eu-west-2", by: "Meerkat", kind: "agent", at: NOW - 2 * HOUR },
						{ id: 2, label: "Changed webhook", by: "Ada Park", kind: "person", at: NOW - 9 * HOUR },
						{ id: 3, label: "Deleted 2 artifacts", kind: "you", at: NOW - 17 * HOUR },
					]}
				/>
			</div>
		),
	},
	{
		name: "RunScrubber",
		blurb: "Replay an agent's run step by step, with what it was thinking at each one.",
		wide: true,
		render: () => (
			<RunScrubber
				label="Meerkat's run"
				defaultValue={1}
				caption={() => null}
				steps={[
					{ label: "Read runners", detail: "Checking failures over 7 days." },
					{ label: "Compute rates", detail: "Three are over 5%; eu-west-2 is 7.9%." },
					{ label: "Ask you", detail: "Holding 3 runs." },
				]}
			/>
		),
	},
	{
		name: "LineageChip",
		blurb: "A freshness chip on a number that unfolds where it came from and which source is late.",
		render: () => (
			<div className="q-sb-tile-row">
				<LineageChip
					label="MRR"
					freshness="4 min"
					steps={[{ label: "stripe.invoices" }, { label: "dash.mrr" }]}
				/>
				<LineageChip
					size="sm"
					label="Runs"
					steps={[
						{ label: "runs.events", stale: true, detail: "40 min late" },
						{ label: "dash.runs" },
					]}
				/>
			</div>
		),
	},
	{
		name: "HonestButton",
		blurb: "A button whose length is its expected wait; pressed, it becomes its own progress bar.",
		render: () => (
			<div className="q-sb-tile-stack">
				<HonestButton size="sm" expected={0.3}>
					Save
				</HonestButton>
				<HonestButton size="sm" expected={42}>
					Render 3 clips
				</HonestButton>
			</div>
		),
	},
	{
		name: "ProbabilityToggle",
		blurb: "A switch that rests between off and always, read back as a policy in words.",
		render: () => (
			<div className="q-sb-tile-stack">
				<ProbabilityToggle label="Publish alone" defaultValue={80} />
			</div>
		),
	},
	{
		name: "StreamingTable",
		blurb: "A live table that holds new rows behind a counter while you read.",
		wide: true,
		render: () => (
			<div className="q-sb-tile-stack">
				<StreamingTable
					label="Runs, newest first"
					size="sm"
					rows={RUNS}
					columns={[
						{ key: "name", header: "Run" },
						{ key: "took", header: "Took", align: "right" },
					]}
				/>
			</div>
		),
	},
	{
		name: "UncertaintyCell",
		blurb: "A table number that carries its doubt: forecasts show a range, counts are set heavier.",
		render: () => (
			<div className="q-sb-tile-stack">
				<UncertaintyCell value={4812} domain={[0, 6500]} />
				<UncertaintyCell value={5400} error={620} domain={[0, 6500]} />
			</div>
		),
	},
	{
		name: "ThresholdHandles",
		blurb: "Alert thresholds dragged on the chart, with the alerts they'd have fired in view.",
		wide: true,
		render: () => (
			<div className="q-sb-tile-stack">
				<ThresholdHandles
					className="q-sb-threshold-handles--tile"
					label="Failure rate"
					data={FAILURES}
					defaultValue={{ low: 1.8, high: 5.5 }}
					max={8}
					formatValue={(v) => `${v.toFixed(1)}%`}
				/>
			</div>
		),
	},
];
