import type { Meta, StoryObj } from "@storybook/react-vite";
import { EntityLink } from "../../../components/app/EntityLink";
import { Icon } from "../../../components/core/Icon";
import { Table } from "../../../components/data/Table";
import { Column, Row } from "../Story";
import "./EntityLink.scss";

type Artifact = { id: string; name: string; run: string; project: string; cost: string };

const ARTIFACTS: Artifact[] = [
	{ id: "a1", name: "weekly-digest.md", run: "233f76c2", project: "Newsroom", cost: "$0.902049" },
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

const meta = {
	title: "Components/App/EntityLink",
	component: EntityLink,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { href: "/runs/233f76c2", kind: "Run", id: "233f76c2", mono: true },
	argTypes: {
		children: { control: "text" },
		icon: { control: false },
	},
} satisfies Meta<typeof EntityLink>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Kind and mono ID; name and ID; an icon standing for the kind (read by screen readers only); sm and md sizes.",
			},
		},
	},
	render: () => (
		<Row>
			<EntityLink href="/runs/233f76c2" kind="Run" id="233f76c2" mono />
			<EntityLink href="/runs/233f76c2" id="233f76c2">
				Nightly digest
			</EntityLink>
			<EntityLink href="/projects/newsroom" icon={<Icon name="folder" />} kind="Project">
				Newsroom
			</EntityLink>
			<EntityLink href="/runs/9be01a4d" kind="Run" id="9be01a4d" mono size="sm" />
			<EntityLink href="/runs/9be01a4d" kind="Run" id="9be01a4d" mono size="md" />
		</Row>
	),
};

export const InASentence: Story = {
	parameters: {
		docs: { description: { story: "Inline: it wraps across lines without losing its underline." } },
	},
	render: () => (
		<Column>
			<p className="q-sb-entity-link__meta">
				Produced by <EntityLink href="/runs/233f76c2" kind="Run" id="233f76c2" mono size="sm" /> · 6
				hours ago
			</p>
			<p className="q-sb-entity-link__prose">
				Started from a <code>web-message</code> trigger by{" "}
				<EntityLink href="/agents/assistant" kind="Agent">
					Assistant
				</EntityLink>{" "}
				on the Orca runner, for the project{" "}
				<EntityLink href="/projects/meerkat" icon={<Icon name="folder" />} kind="Project">
					Meerkat onboarding and activation
				</EntityLink>
				, which wraps across lines without losing its underline.
			</p>
		</Column>
	),
};

export const InATableCell: Story = {
	render: () => (
		<div className="q-sb-entity-link__table">
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
		</div>
	),
};

export const States: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`done` strikes through in muted text; `blocked` shows a hollow dot. Both are announced.",
			},
		},
	},
	render: () => (
		<ul className="q-sb-entity-link__refs">
			{TICKETS.map((t) => (
				<li key={t.ref} className="q-sb-entity-link__ref">
					<EntityLink href={`/tickets/${t.ref}`} kind="Ticket" id={t.ref} mono state={t.state} />
					<span>{t.title}</span>
				</li>
			))}
		</ul>
	),
};

export const External: Story = {
	parameters: {
		docs: {
			description: {
				story: "Opens in a new tab: a trailing arrow, and “(opens in new tab)” for screen readers.",
			},
		},
	},
	render: () => (
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
	),
};
