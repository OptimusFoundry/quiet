import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { EntityLink } from "../../components/app/EntityLink";
import { Icon } from "../../components/core/Icon";
import { Table } from "../../components/data/Table";
import "./EntityLink.scss";

// App/EntityLink — references to runs, projects, artifacts and tickets that read as links at rest.

const meta = {
	title: "App/EntityLink",
	parameters: { density: "app", layout: "fullscreen" },
} satisfies Meta;
export default meta;

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
	return (
		<section id={id} className="q-sb-entity-link__section" aria-labelledby={`${id}-title`}>
			<h2 id={`${id}-title`} className="q-sb-entity-link__title">
				{title}
			</h2>
			{children}
		</section>
	);
}

type Artifact = {
	id: string;
	name: string;
	run: string;
	project: string;
	cost: string;
};

const ARTIFACTS: Artifact[] = [
	{
		id: "a1",
		name: "weekly-digest.md",
		run: "233f76c2",
		project: "Newsroom",
		cost: "$0.902049",
	},
	{
		id: "a2",
		name: "onboarding-flow-review.pdf",
		run: "9be01a4d",
		project: "Meerkat onboarding and activation",
		cost: "$0.118302",
	},
	{
		id: "a3",
		name: "release-notes-0.7.1.md",
		run: "c4d7e210",
		project: "quiet",
		cost: "$0.047115",
	},
];

const TICKETS = [
	{ ref: "B1", title: "Sign-in loops on Safari", state: "done" },
	{ ref: "B2", title: "Runner Orca drops web-message triggers", state: "default" },
	{ ref: "B3", title: "Headless runner needs a GPU quota", state: "blocked" },
	{ ref: "B4", title: "Cost column rounds to cents", state: "done" },
] as const;

export const All: StoryObj = {
	render: () => (
		<div className="q-sb-entity-link">
			<Section id="in-prose" title="In a sentence">
				<p className="q-sb-entity-link__meta">
					Produced by <EntityLink href="/runs/233f76c2" kind="Run" id="233f76c2" mono size="sm" /> ·
					6 hours ago
				</p>
				<p className="q-sb-entity-link__prose">
					Started from a <code>web-message</code> trigger by{" "}
					<EntityLink href="/agents/assistant" kind="Agent">
						Assistant
					</EntityLink>{" "}
					on the Orca runner, for the project{" "}
					<EntityLink href="/projects/meerkat" icon={<Icon glyph="◇" />} kind="Project">
						Meerkat onboarding and activation
					</EntityLink>
					, which wraps across lines without losing its underline.
				</p>
			</Section>

			<Section id="in-table" title="In a table cell">
				<Table<Artifact>
					label="Artifacts"
					size="sm"
					data={ARTIFACTS}
					columns={[
						{
							key: "name",
							header: "Artifact",
							render: (r) => <EntityLink href={`/artifacts/${r.id}`}>{r.name}</EntityLink>,
						},
						{
							key: "run",
							header: "Run",
							render: (r) => <EntityLink href={`/runs/${r.run}`} id={r.run} mono />,
						},
						{
							key: "project",
							header: "Project",
							render: (r) => (
								<EntityLink href={`/projects/${r.project.toLowerCase().replaceAll(" ", "-")}`}>
									{r.project}
								</EntityLink>
							),
						},
						{ key: "cost", header: "Cost", align: "right" },
					]}
				/>
			</Section>

			<Section id="ticket-refs" title="Ticket refs">
				<ul className="q-sb-entity-link__refs">
					{TICKETS.map((t) => (
						<li key={t.ref} className="q-sb-entity-link__ref">
							<EntityLink
								href={`/tickets/${t.ref}`}
								kind="Ticket"
								id={t.ref}
								mono
								state={t.state}
							/>
							<span>{t.title}</span>
						</li>
					))}
				</ul>
			</Section>

			<Section id="variants" title="Kind, icon, name and ID">
				<div className="q-sb-entity-link__row">
					<EntityLink href="/runs/233f76c2" kind="Run" id="233f76c2" mono />
					<EntityLink href="/runs/233f76c2" id="233f76c2">
						Nightly digest
					</EntityLink>
					<EntityLink href="/projects/newsroom" icon={<Icon glyph="◇" />} kind="Project">
						Newsroom
					</EntityLink>
					<EntityLink href="/runs/9be01a4d" kind="Run" id="9be01a4d" mono size="sm" />
					<EntityLink href="/runs/9be01a4d" kind="Run" id="9be01a4d" mono size="md" />
				</div>
			</Section>

			<Section id="external" title="External">
				<p className="q-sb-entity-link__prose">
					Opened as{" "}
					<EntityLink
						href="https://github.com/OptimusFoundry/quiet/pull/33"
						external
						kind="PR"
						id="#33"
						mono
					/>{" "}
					in{" "}
					<EntityLink href="https://github.com/OptimusFoundry/quiet" external>
						OptimusFoundry/quiet
					</EntityLink>
					.
				</p>
			</Section>
		</div>
	),
};
