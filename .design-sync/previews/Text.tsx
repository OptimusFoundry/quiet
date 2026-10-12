import { Text } from "@optimusfoundry/quiet";

const col = { display: "grid", gap: "var(--q-space-3)", maxWidth: 520 } as const;
const row = { display: "flex", flexWrap: "wrap", gap: "var(--q-space-5)", alignItems: "baseline" } as const;

export const Headings = () => (
	<div style={col}>
		<Text heading={1}>Runs</Text>
		<Text heading={2}>Artifacts</Text>
		<Text heading={3}>Triggers</Text>
		<Text heading={4}>Approvals</Text>
	</div>
);

export const Scale = () => (
	<div style={col}>
		{(["3xl", "2xl", "xl", "lg", "md", "sm", "xs"] as const).map((s) => (
			<Text key={s} size={s} color="heading">
				{s} · Run #4182 finished on Orca
			</Text>
		))}
	</div>
);

export const WeightsAndColors = () => (
	<div style={{ display: "grid", gap: "var(--q-space-4)" }}>
		<div style={row}>
			{(["normal", "medium", "semibold", "bold"] as const).map((w) => (
				<Text key={w} weight={w} color="heading">
					{w}
				</Text>
			))}
		</div>
		<div style={row}>
			{(["default", "heading", "muted", "quiet", "primary", "success", "warning", "error"] as const).map((c) => (
				<Text key={c} color={c}>
					{c}
				</Text>
			))}
		</div>
	</div>
);

export const Styles = () => (
	<div style={row}>
		<Text mono>web-message</Text>
		<Text italic>Awaiting approval</Text>
		<Text underline>View artifact</Text>
		<Text strike>$1.204000</Text>
		<Text transform="uppercase">Headless</Text>
	</div>
);

export const Clamp = () => (
	<div style={{ display: "grid", gap: "var(--q-space-3)", maxWidth: 360 }}>
		<Text truncate>
			Summarise the onboarding thread from Ada Park and draft a reply with the three open questions.
		</Text>
		<Text lineClamp={2} color="muted">
			Run #4182 read 14 messages from the web-message trigger, called two tools, wrote a draft artifact
			and stopped for approval before sending anything on behalf of the project owner.
		</Text>
	</div>
);

export const InAContext = () => (
	<div style={{ display: "grid", gap: "var(--q-space-1)", maxWidth: 420 }}>
		<Text mono color="muted">Project · Onboarding</Text>
		<Text as="h2" size="xl" weight="semibold" color="heading">
			Reply drafts
		</Text>
		<Text size="sm" color="muted">
			12 runs this week · $4.318204 spent · last run 3 min ago
		</Text>
	</div>
);
