import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { PageHeader } from "../../components/app/PageHeader";
import { Badge } from "../../components/core/Badge";
import { Button } from "../../components/core/Button";
import { Link } from "../../components/core/Link";
import { Tabs } from "../../components/navigation/Tabs";
import "./PageHeader.scss";

// PageHeader — the top of every agentworks screen: list (title, description, primary action),
// detail (back link, eyebrow, title + status, meta, actions), with tabs, and at phone width.

function Demo({
	id,
	label,
	narrow,
	children,
}: {
	id: string;
	label: string;
	narrow?: boolean;
	children: ReactNode;
}) {
	return (
		<section id={id} aria-label={label} className="q-sb-page-header__demo">
			<div className="q-sb-page-header__label">{label}</div>
			<div
				className={["q-sb-page-header__frame", narrow && "q-sb-page-header__frame--narrow"]
					.filter(Boolean)
					.join(" ")}
			>
				{children}
				<div className="q-sb-page-header__content">Page content starts here.</div>
			</div>
		</section>
	);
}

const RUN_META = [
	"Created 6 hours ago",
	"Cost $0.902049",
	<>
		Project <Link href="/projects/assistant">Assistant</Link>
	</>,
	"Trigger web-message",
	"Runner Orca",
];

const RUN_ACTIONS = (
	<>
		<Button variant="secondary">Close run</Button>
		<Button variant="primary">Restart run</Button>
	</>
);

function AllDemo() {
	return (
		<main className="q-sb-page-header">
			<Demo id="list-page" label="List page">
				<PageHeader
					title="Projects"
					description="A project groups the runs, artifacts and triggers one assistant works on. Everyone in the organisation can see its runs."
					actions={<Button variant="primary">Create project</Button>}
				/>
			</Demo>

			<Demo id="detail-page" label="Detail page">
				<PageHeader
					back={{ label: "Runs", href: "/runs" }}
					eyebrow="Run · Headless"
					title="Run 233f76c2"
					status={<Badge dot>Idle</Badge>}
					meta={RUN_META}
					actions={RUN_ACTIONS}
				/>
			</Demo>

			<Demo id="with-tabs" label="With tabs">
				<PageHeader
					back={{ label: "Artifacts", href: "/artifacts" }}
					eyebrow="Artifact · spreadsheet"
					title="Q3 vendor costs.xlsx"
					status={<Badge variant="success">Ready</Badge>}
					meta={[
						"42 KB",
						<>
							From <Link href="/runs/233f76c2">Run 233f76c2</Link>
						</>,
						"Updated 2 hours ago",
					]}
					actions={<Button variant="secondary">Download</Button>}
					tabs={
						<Tabs
							label="Artifact sections"
							defaultValue="preview"
							tabs={[
								{ value: "preview", label: "Preview" },
								{ value: "versions", label: "Versions", count: 3 },
								{ value: "activity", label: "Activity" },
							]}
						/>
					}
				/>
			</Demo>

			<Demo id="title-only" label="Title only, long title, h2">
				<PageHeader
					as="h2"
					title="Summarise the weekly approvals backlog for the Assistant project and draft replies"
					status={
						<>
							<Badge variant="warning">Needs approval</Badge>
							<Badge variant="outline">Orca</Badge>
						</>
					}
				/>
			</Demo>

			<Demo id="narrow" label="Narrow (390px)" narrow>
				<PageHeader
					back={{ label: "Runs", href: "/runs" }}
					eyebrow="Run · Headless"
					title="Run 233f76c2"
					status={<Badge dot>Idle</Badge>}
					meta={RUN_META}
					actions={RUN_ACTIONS}
				/>
			</Demo>
		</main>
	);
}

const meta: Meta = {
	title: "App/PageHeader",
};
export default meta;

export const All: StoryObj = { render: () => <AllDemo /> };
