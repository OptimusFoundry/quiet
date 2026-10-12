import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	AppIcon,
	Badge,
	Button,
	DescriptionList,
	EntityLink,
	FileCard,
	Link,
	PageHeader,
	Panel,
	Select,
	Table,
	Text,
	TextField,
	Transcript,
	type TranscriptSession,
	toast,
} from "../../index";
import { AppFrame, useNarrow } from "./AppFrame";
import "./Agentworks.scss";

// Agentworks — the app look applied to the product that prompted it (docs/plans/2026-10-11-app-look.md):
// the runs list, a run, an artifact and sign-in, rebuilt from the live screens. Compare with
// agentworks.protoapp.xyz: titles in a PageHeader, records as EntityLinks, facts in a DescriptionList
// beside the lead block, sections on Panel surfaces, empty sections collapsed, molten on the primary
// action and the current place.

const RUN = "?path=/story/patterns-agentworks--run";
const ARTIFACT = "?path=/story/patterns-agentworks--artifact";
const RUNS = "?path=/story/patterns-agentworks--runs";
const PROJECT = "?path=/story/patterns-agentworks--runs";

const NAV = [
	{
		label: "Inbox",
		items: [
			{
				label: "Approvals",
				value: "approvals",
				icon: <AppIcon name="approvals" />,
				badge: 2,
				badgeLabel: "2 waiting",
				href: RUNS,
			},
			{ label: "Chats", value: "chats", icon: <AppIcon name="chat" />, href: RUNS },
		],
	},
	{
		label: "Agents",
		items: [
			{ label: "Projects", value: "projects", icon: <AppIcon name="folder" />, href: RUNS },
			{ label: "Runs", value: "runs", icon: <AppIcon name="runs" />, href: RUNS },
			{ label: "Artifacts", value: "artifacts", icon: <AppIcon name="file" />, href: ARTIFACT },
		],
	},
	{
		label: "Developer",
		items: [
			{ label: "API keys", value: "keys", icon: <AppIcon name="key" />, href: RUNS },
			{ label: "Webhooks", value: "webhooks", icon: <AppIcon name="link" />, href: RUNS },
			{ label: "Integrations", value: "integrations", icon: <AppIcon name="grid" />, href: RUNS },
		],
	},
	{
		label: "Organization",
		items: [
			{ label: "Settings", value: "settings", icon: <AppIcon name="settings" />, href: RUNS },
		],
	},
];

const workspace = { name: "agentworks", detail: "Free plan" };
const user = { name: "Shubhanshu Aarsay", detail: "Owner" };

type Status = "working" | "idle" | "awaiting_human" | "failed" | "closed";
const STATUS: Record<
	Status,
	{ label: string; variant: "primary" | "default" | "warning" | "error" | "secondary" }
> = {
	working: { label: "Working", variant: "default" },
	idle: { label: "Idle", variant: "default" },
	awaiting_human: { label: "Awaiting you", variant: "warning" },
	failed: { label: "Failed", variant: "error" },
	closed: { label: "Closed", variant: "secondary" },
};
const StatusBadge = ({ status }: { status: Status }) => (
	<Badge variant={STATUS[status].variant} size="sm">
		{STATUS[status].label}
	</Badge>
);

type RunRow = {
	id: string;
	trigger: string;
	project: string;
	status: Status;
	runner: "Orca" | "Headless";
	cost: string;
	activity: string;
};
const RUN_ROWS: RunRow[] = [
	{
		id: "233f76c2",
		trigger: "web-message",
		project: "Assistant",
		status: "idle",
		runner: "Orca",
		cost: "$0.902049",
		activity: "6 hours ago",
	},
	{
		id: "9b1e04aa",
		trigger: "jira.issue_created",
		project: "Support triage",
		status: "working",
		runner: "Headless",
		cost: "$0.118300",
		activity: "2 min ago",
	},
	{
		id: "51c7d9e3",
		trigger: "slack.mention",
		project: "Assistant",
		status: "awaiting_human",
		runner: "Orca",
		cost: "$0.064512",
		activity: "14 min ago",
	},
	{
		id: "e04f2b19",
		trigger: "schedule.daily",
		project: "Weekly digest",
		status: "failed",
		runner: "Headless",
		cost: "$0.010002",
		activity: "Yesterday",
	},
	{
		id: "7ac3310f",
		trigger: "web-message",
		project: "Assistant",
		status: "closed",
		runner: "Orca",
		cost: "$1.240870",
		activity: "Oct 8",
	},
];

function RunsScreen() {
	const narrow = useNarrow();
	return (
		<AppFrame
			active="runs"
			nav={NAV}
			workspace={workspace}
			user={user}
			crumbs={[{ label: "Runs" }]}
		>
			<div className="q-sb-agentworks">
				<PageHeader
					title="Runs"
					description="Every time a trigger fires, a run starts. Open one to read its transcript and what it produced."
					actions={
						<Button size="sm" variant="primary" onClick={() => toast({ title: "Run started." })}>
							New run
						</Button>
					}
				/>
				<div className="q-sb-agentworks__list">
					<div className="q-sb-agentworks__toolbar">
						<div className="q-sb-agentworks__search">
							<TextField
								size="sm"
								label="Search runs"
								hideLabel
								placeholder="Search by trigger or run ID"
								leftIcon="/"
							/>
						</div>
						<Select
							size="sm"
							label="Project"
							options={["All projects", "Assistant", "Support triage", "Weekly digest"]}
							className="q-sb-agentworks__filter"
						/>
						<Select
							size="sm"
							label="Status"
							options={["All statuses", "Working", "Idle", "Awaiting you", "Failed", "Closed"]}
							className="q-sb-agentworks__filter"
						/>
						<Select
							size="sm"
							label="Runner"
							options={["All runners", "Orca", "Headless"]}
							className="q-sb-agentworks__filter"
						/>
					</div>

					<Table<RunRow>
						size="sm"
						rowKey="id"
						data={RUN_ROWS}
						columns={[
							{
								key: "trigger",
								header: "Run",
								render: (r) => (
									<span className="q-sb-agentworks__cell">
										<EntityLink href={RUN} id={r.id}>
											{r.trigger}
										</EntityLink>
										<Text size="xs" color="muted">
											{r.project}
										</Text>
									</span>
								),
							},
							{
								key: "status",
								header: "Status",
								render: (r) => <StatusBadge status={r.status} />,
							},
							...(narrow
								? []
								: [
										{ key: "runner", header: "Runner" },
										{
											key: "cost",
											header: "Cost",
											align: "right" as const,
											render: (r: RunRow) => (
												<Text size="sm" mono>
													{r.cost}
												</Text>
											),
										},
									]),
							{ key: "activity", header: "Last activity", align: "right", nowrap: true },
						]}
					/>
				</div>
			</div>
		</AppFrame>
	);
}

export const Runs: StoryObj = { render: () => <RunsScreen /> };

const SESSIONS: TranscriptSession[] = [
	{
		id: "s1",
		startedAt: "Oct 10, 8:32 PM",
		items: [
			{
				kind: "message",
				role: "user",
				author: "Shubhanshu Aarsay",
				channel: "chat",
				at: "8:32 PM",
				content: "Hi",
			},
			{
				kind: "tool",
				name: "ToolSearch",
				input: { query: "select:mcp__agentworks__reply", max_results: 1 },
				status: "done",
				duration: 420,
			},
			{
				kind: "message",
				role: "assistant",
				author: "Assistant",
				at: "8:32 PM",
				content:
					"Hi Shubhanshu, I'm here. I'm the assistant for this project. I can:\n\n- explain how your agents are set up\n- inspect and operate triggers (schedules, webhooks, events)\n- draft changes for an admin to approve in `/approvals`\n\nWhat do you want to look at or change?",
			},
		],
	},
	{
		id: "s2",
		startedAt: "Oct 10, 9:05 PM",
		items: [
			{
				kind: "message",
				role: "user",
				author: "Shubhanshu Aarsay",
				channel: "chat",
				at: "9:05 PM",
				content: "hello",
			},
			{
				kind: "message",
				role: "user",
				author: "Shubhanshu Aarsay",
				channel: "chat",
				content: "try again",
			},
			{
				kind: "tool",
				name: "slack.send_message",
				input: { channel: "#ops", text: "Run 233f76c2 is idle" },
				output: "not_in_channel",
				status: "error",
				duration: 812,
			},
			{ kind: "event", label: "Run restarted", at: "9:07 PM" },
		],
	},
	{
		id: "s3",
		startedAt: "Oct 11, 2:10 PM",
		items: [
			{
				kind: "message",
				role: "user",
				author: "Shubhanshu Aarsay",
				channel: "chat",
				at: "2:10 PM",
				content: "What did you make last time?",
			},
			{
				kind: "tool",
				name: "artifacts.list",
				input: { run: "233f76c2" },
				status: "done",
				duration: 96,
			},
			{
				kind: "message",
				role: "assistant",
				author: "Assistant",
				at: "2:10 PM",
				content:
					"One artifact: `assistant-capabilities-xlsx`, a capabilities table as an Excel sheet with a styled header and a frozen first row.",
			},
		],
	},
];

// Newest first; the rail shows three and links to the rest.
const RUN_ARTIFACTS = [
	{
		name: "assistant-capabilities-xlsx",
		mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		bytes: 2560,
		at: "6 hours ago",
	},
	{ name: "trigger-audit.pdf", mime: "application/pdf", bytes: 184_320, at: "Yesterday" },
	{ name: "approvals-export.csv", mime: "text/csv", bytes: 9_216, at: "Yesterday" },
	{ name: "run-config.json", mime: "application/json", bytes: 1_434, at: "Oct 9" },
];

export const Run: StoryObj = {
	render: () => (
		<AppFrame
			active="runs"
			nav={NAV}
			workspace={workspace}
			user={user}
			crumbs={[{ label: "Runs", href: RUNS }, { label: "233f76c2" }]}
		>
			<div className="q-sb-agentworks">
				<PageHeader
					back={{ label: "Runs", href: RUNS }}
					eyebrow="Run 233f76c2 · Orca"
					title="web-message"
					status={<StatusBadge status="idle" />}
					meta={["Started Oct 10, 8:32 PM", "Last activity 6 hours ago"]}
					actions={
						<>
							<Button size="sm" variant="secondary" onClick={() => toast({ title: "Run closed." })}>
								Close run
							</Button>
							<Button
								size="sm"
								variant="primary"
								onClick={() => toast({ title: "Run restarted." })}
							>
								Restart run
							</Button>
						</>
					}
				/>
				<div className="q-sb-agentworks__detail">
					<div className="q-sb-agentworks__main">
						<Panel variant="plain" title="Transcript" count={`${SESSIONS.length} sessions`}>
							<Transcript sessions={SESSIONS} />
						</Panel>
					</div>
					<div className="q-sb-agentworks__rail">
						<Panel title="Details" as="h2">
							<DescriptionList
								layout="stacked"
								size="sm"
								items={[
									{ label: "Trigger", value: "web-message", mono: true },
									{ label: "Project", value: <EntityLink href={PROJECT}>Assistant</EntityLink> },
									{ label: "Runner", value: "Orca" },
									{ label: "Cost", value: "$0.902049", mono: true },
									{
										label: "Run ID",
										value: "233f76c2-f6f9-41b0-bc7a-310d203ad736",
										mono: true,
										copy: "233f76c2-f6f9-41b0-bc7a-310d203ad736",
									},
								]}
							/>
						</Panel>
						<Panel
							title="Artifacts"
							count={RUN_ARTIFACTS.length}
							footer={
								RUN_ARTIFACTS.length > 3 && (
									<Link href={ARTIFACT} size="sm">
										View all {RUN_ARTIFACTS.length} artifacts
									</Link>
								)
							}
						>
							<ul className="q-sb-agentworks__files">
								{RUN_ARTIFACTS.slice(0, 3).map((a) => (
									<li key={a.name}>
										<FileCard
											size="sm"
											variant="row"
											name={a.name}
											to={ARTIFACT}
											mimeType={a.mime}
											bytes={a.bytes}
											trailing={a.at}
											href="#download"
											download
										/>
									</li>
								))}
							</ul>
						</Panel>
						<Panel title="Approvals" empty="Nothing waiting for a decision." />
					</div>
				</div>
			</div>
		</AppFrame>
	),
};

export const Artifact: StoryObj = {
	render: () => (
		<AppFrame
			active="artifacts"
			nav={NAV}
			workspace={workspace}
			user={user}
			crumbs={[{ label: "Artifacts", href: ARTIFACT }, { label: "assistant-capabilities-xlsx" }]}
		>
			<div className="q-sb-agentworks">
				<PageHeader
					back={{ label: "Artifacts", href: ARTIFACT }}
					eyebrow="Artifact · Spreadsheet"
					title="assistant-capabilities-xlsx"
					status={<Badge size="sm">Internal</Badge>}
					description="Capabilities table as an Excel sheet with a styled header and a frozen first row."
					meta={["Updated 6 hours ago", "2.5 KB"]}
					actions={
						<Button size="sm" variant="primary" href="#download">
							Download
						</Button>
					}
				/>
				<div className="q-sb-agentworks__detail">
					<div className="q-sb-agentworks__main">
						<Panel variant="plain" title="Versions" count={2}>
							<div className="q-sb-agentworks__versions">
								<FileCard
									name="assistant-capabilities.xlsx"
									mimeType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
									bytes={2560}
									meta="v2 · 6 hours ago"
									badge={
										<Badge variant="primary" size="sm">
											Current
										</Badge>
									}
								/>
								<FileCard
									name="assistant-capabilities.xlsx"
									mimeType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
									bytes={2310}
									meta="v1 · Yesterday"
									href="#download"
									download
								/>
							</div>
						</Panel>
					</div>
					<div className="q-sb-agentworks__rail">
						<Panel title="Details">
							<DescriptionList
								layout="stacked"
								size="sm"
								items={[
									{ label: "Project", value: <EntityLink href={PROJECT}>Assistant</EntityLink> },
									{ label: "Kind", value: "Spreadsheet" },
									{
										label: "Location",
										value: "Internal",
										hint: "Stored in agentworks; not synced to Drive",
									},
									{ label: "Current version", value: "v2" },
									{
										label: "ID",
										value: "2156648e-feba-4087-a8b5-20613b93e7a1",
										mono: true,
										copy: "2156648e-feba-4087-a8b5-20613b93e7a1",
									},
								]}
							/>
						</Panel>
						<Panel title="Lineage">
							<DescriptionList
								layout="stacked"
								size="sm"
								items={[
									{
										label: "Produced by",
										value: <EntityLink href={RUN} kind="Run" id="233f76c2" />,
									},
									{ label: "Inputs", value: undefined },
									{ label: "Consumed by", value: undefined },
								]}
							/>
						</Panel>
					</div>
				</div>
			</div>
		</AppFrame>
	),
};

export const SignIn: StoryObj = {
	render: () => (
		<main className="q-sb-signin" aria-label="Sign in">
			<div className="q-sb-signin__card">
				<div className="q-sb-signin__head">
					<Text size="md" weight="semibold" color="heading">
						agentworks
					</Text>
					<Text as="h1" size="xl" weight="semibold" color="heading">
						Sign in
					</Text>
					<Text size="sm" color="muted">
						Run agents on your team's triggers, with approvals where it matters.
					</Text>
				</div>
				<div className="q-sb-signin__form">
					<Button variant="secondary" fullWidth>
						Continue with Google
					</Button>
					<span className="q-sb-signin__or">or</span>
					<TextField size="md" label="Work email" type="email" placeholder="you@company.com" />
					<Button variant="primary" fullWidth>
						Email me a sign-in link
					</Button>
				</div>
				<span className="q-sb-signin__legal">
					By continuing you agree to the <a href="#terms">Terms</a> and{" "}
					<a href="#privacy">Privacy policy</a>.
				</span>
			</div>
		</main>
	),
};

const meta: Meta = {
	title: "Patterns/Agentworks",
	parameters: { layout: "fullscreen" },
};
export default meta;
