import { GhostFuture } from "@optimusfoundry/quiet";

const box = { width: 340, display: "grid", gap: "var(--q-space-stack)" } as const;
const row = {
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	gap: "var(--q-space-inline)",
	height: 38,
	padding: "0 var(--q-space-3)",
	border: "1px solid var(--q-border)",
	borderRadius: "var(--q-radius-md)",
	fontSize: "var(--q-text-sm)",
} as const;
const mono = {
	fontFamily: "var(--q-font-mono)",
	fontSize: "var(--q-text-2xs)",
	letterSpacing: "var(--q-tracking-mono)",
	textTransform: "uppercase",
	color: "var(--q-fg-muted)",
} as const;

const GHOSTS = [
	{ label: "Someone from Product Hunt", hint: "2 min after launch" },
	{ label: "Your first referral", hint: "day 3" },
	{ label: "A bounced address", hint: "day 4, auto-removed" },
	{ label: "Signup #100", hint: "around day 9" },
];
const CAPTION =
	"Dashed rows are what the first fortnight looked like for 40 similar campaigns. They fold away as real signups arrive.";

export const Empty = () => (
	<div style={box}>
		<GhostFuture ghosts={GHOSTS} caption={CAPTION} />
	</div>
);

export const FillingUp = () => (
	<div style={box}>
		<GhostFuture ghosts={GHOSTS} caption={CAPTION}>
			{["mira@hey.com", "ada@park.dev"].map((e) => (
				<div key={e} style={row}>
					<span>{e}</span>
					<span style={mono}>just now</span>
				</div>
			))}
		</GhostFuture>
	</div>
);

export const FirstRuns = () => (
	<div style={box}>
		<GhostFuture
			ghosts={[
				{ label: "A web-message trigger", hint: "within the hour" },
				{ label: "First artifact from Orca", hint: "after ~3 runs" },
				{ label: "A run that asks for approval", hint: "day 2" },
			]}
			caption="Ghosts show how new projects usually start on agentworks."
		>
			<div style={row}>
				<span>Run #1 · web-message</span>
				<span style={mono}>$0.902049</span>
			</div>
		</GhostFuture>
	</div>
);
