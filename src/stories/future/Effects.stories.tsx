import type { Meta, StoryObj } from "@storybook/react-vite";
import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import { Button } from "../../components/core/Button";
import { Slider } from "../../components/forms/Slider";
import {
	MorphingTooltipGroup,
	MorphingTooltipTrigger,
} from "../../components/future/MorphingTooltip";
import { ProgressiveBlur } from "../../components/future/ProgressiveBlur";
import { ThinkingOrb } from "../../components/future/ThinkingOrb";
import { Concept, FuturePage, Spec } from "./Concept.jsx";

// Future components, effects set — ProgressiveBlur, ThinkingOrb and MorphingTooltip, first written
// for Proto (saas-template #32, #33) and rebuilt on quiet tokens. Proto's BorderBeam was not
// ported: BorderProgress `indeterminate` already marks a surface as working.
const mono: CSSProperties = {
	fontFamily: "var(--q-font-mono)",
	fontSize: "var(--q-text-2xs)",
	letterSpacing: "var(--q-tracking-mono)",
	textTransform: "uppercase",
	color: "var(--q-fg-muted)",
};
const card: CSSProperties = {
	width: 240,
	height: 260,
	border: "1px solid var(--q-border)",
	borderRadius: "var(--q-radius-lg)",
	background: "var(--q-bg)",
};

const WORDS = ["Sharp", "Crisp", "Soft", "Softer", "Blurry", "Blurred", "Gone"];

function Words() {
	return (
		<div
			style={{
				display: "grid",
				gap: 2,
				padding: "16px 24px",
				fontSize: "var(--q-text-2xl)",
				fontWeight: 700,
				letterSpacing: "var(--q-tracking-h2)",
				lineHeight: 1.25,
			}}
		>
			{WORDS.map((w) => (
				<span key={w}>{w}</span>
			))}
		</div>
	);
}

function Figure({ caption, children }: { caption: string; children: ReactNode }) {
	return (
		<figure style={{ display: "grid", gap: 8, margin: 0 }}>
			{children}
			<figcaption style={mono}>{caption}</figcaption>
		</figure>
	);
}

function StrengthDemo() {
	const [blur, setBlur] = useState(28);
	return (
		<div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 520 }}>
			<Slider
				label="Blur at the edge"
				min={2}
				max={64}
				value={blur}
				onChange={setBlur}
				formatValue={(v) => `${v}px`}
			/>
			<ProgressiveBlur maxBlur={blur} style={card} data-testid="strength">
				<Words />
			</ProgressiveBlur>
		</div>
	);
}

const STATES = ["Expanding", "Tracing", "Trimming", "Planning"];

function StatusPill() {
	const [i, setI] = useState(0);
	useEffect(() => {
		const id = window.setInterval(() => setI((n) => (n + 1) % STATES.length), 1600);
		return () => window.clearInterval(id);
	}, []);
	return (
		<div
			style={{
				display: "inline-flex",
				alignItems: "center",
				gap: 8,
				padding: "4px 16px 4px 4px",
				border: "1px solid var(--q-border)",
				borderRadius: "var(--q-radius-pill)",
				fontSize: "var(--q-text-sm)",
				color: "var(--q-fg-body)",
			}}
		>
			<ThinkingOrb size={32} dots={60} label="" />
			{/* Fixed to the longest status so the pill never resizes as the text changes. */}
			<span role="status" style={{ minWidth: "12ch" }}>
				{STATES[i]}…
			</span>
		</div>
	);
}

const COLUMNS = [
	{
		id: "spotify",
		label: "Spotify",
		body: "Streams on Spotify in the selected period.",
		share: 38,
	},
	{ id: "youtube", label: "YouTube", body: "Views on YouTube for this episode.", share: 81 },
	{ id: "rss-video", label: "RSS video", body: "Video downloads from the RSS feed.", share: 12 },
	{
		id: "rss-audio",
		label: "RSS audio",
		body: "Audio downloads across podcast apps via RSS.",
		share: 46,
	},
	{ id: "total", label: "Total", body: "All platforms combined.", share: 100 },
];
const EPISODES = [
	["The quiet launch", "58K", "2.32M", "212K", "655K", "3.24M"],
	["Shipping in public", "64K", "1.74M", "199K", "489K", "2.49M"],
	["Pricing by outcome", "53K", "1.48M", "190K", "481K", "2.20M"],
];

function Tip({ label, body, share }: { label: string; body: string; share: number }) {
	return (
		<div style={{ display: "grid", gap: 8 }}>
			<strong style={{ color: "var(--q-fg)", fontWeight: 600 }}>{label}</strong>
			<span>{body}</span>
			<span style={mono}>Share of plays {share}%</span>
		</div>
	);
}

const cell: CSSProperties = {
	padding: "12px 16px",
	borderBottom: "1px solid var(--q-border)",
	textAlign: "left",
	whiteSpace: "nowrap",
};

function Breakdown() {
	return (
		<MorphingTooltipGroup data-testid="breakdown">
			<table style={{ borderCollapse: "collapse", fontSize: "var(--q-text-sm)" }}>
				<thead>
					<tr>
						<th style={{ ...cell, ...mono }}>Episode</th>
						{COLUMNS.map((c) => (
							<th key={c.id} style={{ ...cell, ...mono }}>
								<MorphingTooltipTrigger id={c.id} content={<Tip {...c} />}>
									{c.label}
								</MorphingTooltipTrigger>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{EPISODES.map(([name, ...cells]) => (
						<tr key={name}>
							<td style={cell}>{name}</td>
							{cells.map((v, i) => (
								<td key={COLUMNS[i]?.id} style={{ ...cell, fontVariantNumeric: "tabular-nums" }}>
									{v}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</MorphingTooltipGroup>
	);
}

const ACTIONS = [
	{ id: "draft", label: "Draft", tip: "Saved for you only." },
	{ id: "schedule", label: "Schedule", tip: "Sends at 09:00 in each subscriber's own time zone." },
	{ id: "send", label: "Send now", tip: "Goes to 4,120 subscribers. You can't unsend." },
];

function Actions() {
	return (
		<MorphingTooltipGroup placement="top" data-testid="actions" style={{ paddingTop: 96 }}>
			<div style={{ display: "flex", gap: 8 }}>
				{ACTIONS.map((a) => (
					<MorphingTooltipTrigger key={a.id} id={a.id} content={a.tip}>
						<Button size="sm" variant={a.id === "send" ? "primary" : "secondary"}>
							{a.label}
						</Button>
					</MorphingTooltipTrigger>
				))}
			</div>
		</MorphingTooltipGroup>
	);
}

function EffectsPage() {
	return (
		<FuturePage
			title="Effects"
			intro="Motion and depth with a job: fading what has scrolled past, showing that something is working, and keeping one tooltip steady while you read across a row."
		>
			<Concept
				id="progressive-blur"
				index={1}
				name="Progressive blur"
				from="Fade-out mask"
				idea="A masked blur only fades a fixed blur in. Stacked bands of rising blur make the strength itself ramp toward the edge, so content softens the way it does through a lens."
			>
				<Spec label="Compare">
					<Figure caption="One masked blur">
						<ProgressiveBlur mode="masked" style={card} data-testid="masked">
							<Words />
						</ProgressiveBlur>
					</Figure>
					<Figure caption="Progressive blur">
						<ProgressiveBlur style={card} data-testid="progressive">
							<Words />
						</ProgressiveBlur>
					</Figure>
				</Spec>
				<Spec label="Directions">
					<Figure caption="Top">
						<ProgressiveBlur direction="top" style={card}>
							<Words />
						</ProgressiveBlur>
					</Figure>
					<Figure caption="Right, from 50%">
						<ProgressiveBlur direction="right" start={50} style={card}>
							<Words />
						</ProgressiveBlur>
					</Figure>
				</Spec>
				<Spec label="Strength" col>
					<StrengthDemo />
				</Spec>
			</Concept>
			<Concept
				id="thinking-orb"
				index={2}
				name="Thinking orb"
				from="Spinner"
				idea="A dotted sphere turning once every six seconds, a few dots in molten. It says “working” without the urgency of a spinner, and holds still when motion is reduced."
			>
				<Spec label="Sizes">
					<ThinkingOrb size={24} dots={40} />
					<ThinkingOrb size={40} />
					<ThinkingOrb size={96} dots={140} label="Planning" />
				</Spec>
				<Spec label="Density">
					<ThinkingOrb size={96} dots={60} accent={0.1} label="Sparse" />
					<ThinkingOrb size={96} dots={160} label="Dense" />
					<ThinkingOrb size={96} dots={280} accent={0.3} depthFade={0.6} label="Packed" />
				</Spec>
				<Spec label="Still">
					<ThinkingOrb size={64} speed={0} label="Paused" />
				</Spec>
				<Spec label="Status">
					<StatusPill />
				</Spec>
			</Concept>
			<Concept
				id="morphing-tooltip"
				index={3}
				name="Morphing tooltip"
				from="Tooltip"
				idea="One tooltip for a whole row of triggers. Moving between them glides it to the new anchor and resizes it, and the content slides in from the side you moved toward, so reading across headers feels like one surface."
			>
				<Spec label="Table headers" col>
					<Breakdown />
				</Spec>
				<Spec label="On buttons, above">
					<Actions />
				</Spec>
			</Concept>
		</FuturePage>
	);
}

const meta: Meta = { title: "Future/Effects", parameters: { layout: "fullscreen" } };
export default meta;
export const All: StoryObj = { render: () => <EffectsPage /> };
