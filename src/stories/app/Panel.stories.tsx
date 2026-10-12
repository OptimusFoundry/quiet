import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Panel } from "../../components/app/Panel";
import { Badge } from "../../components/core/Badge";
import { Button } from "../../components/core/Button";
import { Link } from "../../components/core/Link";
import { Table } from "../../components/data/Table";
import "./Panel.scss";

// App/Panel: the titled surface section that replaces "SectionHeader with an ink rule on top".
// Each block is a state someone designs against, with agentworks data (runs, artifacts, runners).

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

function Block({ id, label, children }: { id: string; label: string; children: ReactNode }) {
	return (
		<div id={id} className="q-sb-panel__block">
			<p className="q-sb-panel__label">{label}</p>
			{children}
		</div>
	);
}

function PanelPage() {
	return (
		<main className="q-sb-panel">
			<h1 className="q-sb-panel__title">Panel</h1>

			<Block id="artifact-rail" label="Artifact page, right rail">
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
						<Panel title="Lineage" as="h2">
							<p className="q-sb-panel__line">
								Produced by <Link href="#run-233f76c2">Run 233f76c2</Link> on Orca
							</p>
						</Panel>
						<Panel title="Inputs" empty="No inputs" />
						<Panel title="Consumed by" empty="Not used yet" />
					</aside>
				</div>
			</Block>

			<Block id="table" label="A table: plain, on the page ground (never on a surface)">
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
			</Block>

			<Block id="actions-count" label="Actions, count, description and footer">
				<Panel
					title="Approvals"
					count={2}
					description="Runs waiting on a person before they continue."
					actions={
						<Button variant="ghost" size="sm">
							Approve all
						</Button>
					}
					footer={<Link href="#approvals">Show resolved approvals</Link>}
				>
					<ul className="q-sb-panel__list">
						<li>
							<Link href="#run-51c0d7f3">Run 51c0d7f3</Link> wants to send 14 emails
						</li>
						<li>
							<Link href="#run-0c4f19be">Run 0c4f19be</Link> wants to merge a pull request
						</li>
					</ul>
				</Panel>
			</Block>

			<Block id="outlined" label="Outlined">
				<Panel variant="outlined" title="Runner" as="h3">
					<p className="q-sb-panel__line">Headless · 2 vCPU · us-east-1</p>
				</Panel>
				<Panel variant="outlined" title="Secrets" as="h3" empty="No secrets in this project" />
			</Block>

			<Block id="plain" label="Plain (lead block of a page)">
				<Panel
					variant="plain"
					title="Support digest"
					description="Project · 12 runs this week · $4.21"
				>
					<p className="q-sb-panel__prose">
						Reads the support inbox every Monday and writes a digest artifact.
					</p>
				</Panel>
			</Block>

			<Block id="padding" label="Padding sm, and untitled">
				<Panel padding="sm" title="Trigger" as="h3">
					<p className="q-sb-panel__line">web-message</p>
				</Panel>
				<Panel>
					<p className="q-sb-panel__line">An untitled panel is a plain grouping surface.</p>
				</Panel>
			</Block>
		</main>
	);
}

const meta: Meta = { title: "App/Panel", parameters: { layout: "fullscreen" } };
export default meta;
export const All: StoryObj = { render: () => <PanelPage /> };
