import type { Meta, StoryObj } from "@storybook/react-vite";
import { Panel } from "../../../components/app/Panel";
import { Badge } from "../../../components/core/Badge";
import { Button } from "../../../components/core/Button";
import { Link } from "../../../components/core/Link";
import { Table } from "../../../components/data/Table";
import "./Panel.scss";

type Run = {
	id: string;
	trigger: string;
	runner: string;
	status: "success" | "warning" | "error";
	label: string;
	cost: string;
};

const RUNS: Run[] = [
	{
		id: "233f76c2",
		trigger: "web-message",
		runner: "Orca",
		status: "success",
		label: "Succeeded",
		cost: "$0.902049",
	},
	{
		id: "9b1e04aa",
		trigger: "schedule",
		runner: "Headless",
		status: "success",
		label: "Succeeded",
		cost: "$0.118320",
	},
	{
		id: "51c0d7f3",
		trigger: "web-message",
		runner: "Orca",
		status: "warning",
		label: "Awaiting approval",
		cost: "$0.064511",
	},
	{
		id: "e7a2c915",
		trigger: "webhook",
		runner: "Headless",
		status: "error",
		label: "Failed",
		cost: "$0.010204",
	},
];

const meta = {
	title: "Components/App/Panel",
	component: Panel,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	decorators: [
		(Story) => (
			<div className="q-sb-panel">
				<Story />
			</div>
		),
	],
	args: {
		title: "Approvals",
		count: 2,
		description: "Runs waiting on a person before they continue.",
		actions: (
			<Button variant="ghost" size="sm">
				Approve all
			</Button>
		),
		footer: <Link href="#approvals">Show resolved approvals</Link>,
		variant: "surface",
		padding: "md",
		children: (
			<ul className="q-sb-panel__list">
				<li>
					<Link href="#run-51c0d7f3">Run 51c0d7f3</Link> wants to send 14 emails
				</li>
				<li>
					<Link href="#run-0c4f19be">Run 0c4f19be</Link> wants to merge a pull request
				</li>
			</ul>
		),
	},
	argTypes: {
		title: { control: "text" },
		description: { control: "text" },
		count: { control: "text" },
		empty: { control: "text" },
		actions: { control: false },
		footer: { control: false },
		children: { control: false },
	},
} satisfies Meta<typeof Panel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	parameters: {
		docs: {
			description: { story: "Title with a muted count, a description, actions and a footer." },
		},
	},
};

export const Variants: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Surface (subtle ground, the default), outlined (a hairline on the page ground), plain (no ground: the lead block of a page).",
			},
		},
	},
	render: () => (
		<div className="q-sb-panel__stack">
			<Panel title="Runner" as="h3">
				<p className="q-sb-panel__line">Headless · 2 vCPU · us-east-1</p>
			</Panel>
			<Panel variant="outlined" title="Runner" as="h3">
				<p className="q-sb-panel__line">Orca · 4 vCPU · eu-west-1</p>
			</Panel>
			<Panel
				variant="plain"
				title="Support digest"
				description="Project · 12 runs this week · $4.21"
			>
				<p className="q-sb-panel__prose">
					Reads the support inbox every Monday and writes a digest artifact.
				</p>
			</Panel>
		</div>
	),
};

export const Empty: Story = {
	parameters: {
		docs: {
			description: {
				story: "With no children, `empty` shows as one muted line and the panel collapses to it.",
			},
		},
	},
	render: () => (
		<div className="q-sb-panel__stack">
			<Panel title="Inputs" empty="No inputs" />
			<Panel variant="outlined" title="Secrets" as="h3" empty="No secrets in this project" />
		</div>
	),
};

export const WithATable: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'A table goes plain, on the page ground (never on a surface), with `padding="none"` so it sits edge to edge.',
			},
		},
	},
	render: () => (
		<Panel
			title="Recent runs"
			count={RUNS.length}
			variant="plain"
			padding="none"
			actions={<Link href="#runs">View all</Link>}
		>
			<Table<Run>
				label="Recent runs"
				rowKey="id"
				data={RUNS}
				columns={[
					{
						key: "id",
						header: "Run",
						render: (r) => <Link href={`#run-${r.id}`}>{r.id}</Link>,
					},
					{ key: "trigger", header: "Trigger" },
					{ key: "runner", header: "Runner" },
					{
						key: "status",
						header: "Status",
						render: (r) => <Badge variant={r.status}>{r.label}</Badge>,
					},
					{ key: "cost", header: "Cost", align: "right" },
				]}
			/>
		</Panel>
	),
};

export const PaddingAndUntitled: Story = {
	parameters: {
		docs: {
			description: { story: '`padding="sm"`; untitled, a panel is a plain grouping surface.' },
		},
	},
	render: () => (
		<div className="q-sb-panel__stack">
			<Panel padding="sm" title="Trigger" as="h3">
				<p className="q-sb-panel__line">web-message</p>
			</Panel>
			<Panel>
				<p className="q-sb-panel__line">An untitled panel is a plain grouping surface.</p>
			</Panel>
		</div>
	),
};

export const ArtifactPage: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"An artifact page: the content in a plain panel, its lineage in surface panels down a right rail.",
			},
		},
	},
	render: () => (
		<div className="q-sb-panel__page">
			<Panel
				variant="plain"
				title="weekly-digest.md"
				description="Markdown · 4.2 KB · created 11 Oct 2026, 14:02"
				actions={
					<Button variant="secondary" size="sm" href="#download">
						Download
					</Button>
				}
			>
				<p className="q-sb-panel__prose">
					Summary of last week's support threads, grouped by product area, with the three issues
					that need an owner.
				</p>
			</Panel>
			<aside className="q-sb-panel__rail" aria-label="Artifact details">
				<Panel title="Lineage">
					<p className="q-sb-panel__line">
						Produced by <Link href="#run-233f76c2">Run 233f76c2</Link> on Orca
					</p>
				</Panel>
				<Panel title="Inputs" empty="No inputs" />
				<Panel title="Consumed by" empty="Not used yet" />
			</aside>
		</div>
	),
};
