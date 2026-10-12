import { Badge, Button, EntityLink, PageHeader, Tabs } from "@optimusfoundry/quiet";

const frame = { width: 820 } as const;

export const ListPage = () => (
	<div style={frame}>
		<PageHeader
			title="Runs"
			description="Every time a trigger fires, a run starts. Open one to read its transcript and what it produced."
			actions={<Button size="sm" variant="primary">New run</Button>}
		/>
	</div>
);

export const DetailPage = () => (
	<div style={frame}>
		<PageHeader
			back={{ label: "Runs", href: "/runs" }}
			eyebrow="Run 233f76c2 · Orca"
			title="web-message"
			status={<Badge dot>Idle</Badge>}
			meta={[
				"Started Oct 10, 8:32 PM",
				"Cost $0.902049",
				<>
					Project <EntityLink href="/projects/assistant">Assistant</EntityLink>
				</>,
				"Last activity 6 hours ago",
			]}
			actions={
				<>
					<Button size="sm" variant="secondary">Close run</Button>
					<Button size="sm" variant="primary">Restart run</Button>
				</>
			}
		/>
	</div>
);

export const WithTabs = () => (
	<div style={frame}>
		<PageHeader
			back={{ label: "Artifacts", href: "/artifacts" }}
			eyebrow="Artifact · Spreadsheet"
			title="assistant-capabilities.xlsx"
			status={<Badge size="sm">Internal</Badge>}
			description="Capabilities table as an Excel sheet with a styled header and a frozen first row."
			meta={[
				"2.5 KB",
				<>
					From <EntityLink href="/runs/233f76c2" kind="Run" id="233f76c2" mono />
				</>,
				"Updated 6 hours ago",
			]}
			actions={<Button size="sm" variant="primary" href="#download">Download</Button>}
			tabs={
				<Tabs
					label="Artifact sections"
					defaultValue="preview"
					tabs={[
						{ value: "preview", label: "Preview" },
						{ value: "versions", label: "Versions", count: 2 },
						{ value: "activity", label: "Activity" },
					]}
				/>
			}
		/>
	</div>
);

export const SectionHeadingH2 = () => (
	<div style={frame}>
		<PageHeader
			as="h2"
			title="Summarise the weekly approvals backlog and draft replies"
			status={
				<>
					<Badge variant="warning">Needs approval</Badge>
					<Badge variant="outline">Orca</Badge>
				</>
			}
		/>
	</div>
);

export const Narrow = () => (
	<div style={{ width: 360 }}>
		<PageHeader
			back={{ label: "Runs", href: "/runs" }}
			eyebrow="Run 233f76c2 · Orca"
			title="web-message"
			status={<Badge dot>Idle</Badge>}
			meta={["Started Oct 10, 8:32 PM", "Cost $0.902049", "Runner Orca"]}
			actions={
				<>
					<Button size="sm" variant="secondary">Close run</Button>
					<Button size="sm" variant="primary">Restart run</Button>
				</>
			}
		/>
	</div>
);
