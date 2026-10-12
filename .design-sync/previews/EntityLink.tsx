import { EntityLink, Icon, Table, Text } from "@optimusfoundry/quiet";

export const InProse = () => (
	<div style={{ width: 520, display: "grid", gap: "var(--q-space-stack)" }}>
		<Text size="sm" color="muted">
			Produced by <EntityLink href="/runs/233f76c2" kind="Run" id="233f76c2" mono size="sm" /> · 6 hours ago
		</Text>
		<Text>
			Started from a <code>web-message</code> trigger by{" "}
			<EntityLink href="/agents/assistant" kind="Agent">
				Assistant
			</EntityLink>{" "}
			on the Orca runner, for the project{" "}
			<EntityLink href="/projects/meerkat" icon={<Icon glyph="◇" />} kind="Project">
				Meerkat onboarding and activation
			</EntityLink>
			.
		</Text>
	</div>
);

export const Forms = () => (
	<div style={{ display: "grid", gap: "var(--q-space-stack)", justifyItems: "start", width: 300 }}>
		<EntityLink href="/runs/233f76c2" kind="Run" id="233f76c2" mono />
		<EntityLink href="/runs/233f76c2" id="233f76c2">
			Nightly digest
		</EntityLink>
		<EntityLink href="/projects/newsroom" icon={<Icon glyph="◇" />} kind="Project">
			Newsroom
		</EntityLink>
		<EntityLink href="https://github.com/OptimusFoundry/quiet/pull/33" external kind="PR" id="#33" mono />
	</div>
);

const TICKETS = [
	{ ref: "B1", title: "Sign-in loops on Safari", state: "done" },
	{ ref: "B2", title: "Orca drops web-message triggers", state: "default" },
	{ ref: "B3", title: "Headless runner needs a GPU quota", state: "blocked" },
	{ ref: "B4", title: "Cost column rounds to cents", state: "done" },
] as const;

export const TicketStates = () => (
	<ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "var(--q-space-1)", width: 340 }}>
		{TICKETS.map((t) => (
			<li key={t.ref} style={{ display: "flex", gap: "var(--q-space-inline)", alignItems: "baseline" }}>
				<EntityLink href={`/tickets/${t.ref}`} kind="Ticket" id={t.ref} mono state={t.state} />
				<Text size="sm">{t.title}</Text>
			</li>
		))}
	</ul>
);

const ARTIFACTS = [
	{ id: "a1", name: "weekly-digest.md", run: "233f76c2", project: "Newsroom", cost: "$0.902049" },
	{ id: "a2", name: "onboarding-flow-review.pdf", run: "9be01a4d", project: "Meerkat onboarding", cost: "$0.118302" },
	{ id: "a3", name: "release-notes-0.7.1.md", run: "c4d7e210", project: "quiet", cost: "$0.047115" },
];

export const InTable = () => (
	<div style={{ width: 640 }}>
		<Table
			label="Artifacts"
			size="sm"
			rowKey="id"
			data={ARTIFACTS}
			columns={[
				{ key: "name", header: "Artifact", render: (r: (typeof ARTIFACTS)[number]) => <EntityLink href={`/artifacts/${r.id}`}>{r.name}</EntityLink> },
				{ key: "run", header: "Run", render: (r: (typeof ARTIFACTS)[number]) => <EntityLink href={`/runs/${r.run}`} id={r.run} mono /> },
				{ key: "project", header: "Project", render: (r: (typeof ARTIFACTS)[number]) => <EntityLink href="/projects/x">{r.project}</EntityLink> },
				{ key: "cost", header: "Cost", align: "right" },
			]}
		/>
	</div>
);
