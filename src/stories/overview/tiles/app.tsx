import { AccountMenu } from "../../../components/app/AccountMenu";
import { AppIcon } from "../../../components/app/AppIcon";
import { AppShell } from "../../../components/app/AppShell";
import { DescriptionList } from "../../../components/app/DescriptionList";
import { EntityLink } from "../../../components/app/EntityLink";
import { FileCard } from "../../../components/app/FileCard";
import { NoticeChip } from "../../../components/app/NoticeChip";
import { PageHeader } from "../../../components/app/PageHeader";
import { Panel } from "../../../components/app/Panel";
import { ShellNotice } from "../../../components/app/ShellNotice";
import { SidebarNotice } from "../../../components/app/SidebarNotice";
import { TopBar } from "../../../components/app/TopBar";
import { Transcript } from "../../../components/app/Transcript";
import { WorkspaceSwitcher } from "../../../components/app/WorkspaceSwitcher";
import { Badge } from "../../../components/core/Badge";
import { Button } from "../../../components/core/Button";
import { Link } from "../../../components/core/Link";
import {
	ACCOUNT_ITEMS,
	Canvas,
	DemoPage,
	DemoSidebar,
	Frame,
	WORKSPACE_ITEMS,
} from "../../components/app/AppStory";
import type { Tile } from "./types";

export const tiles: Tile[] = [
	{
		name: "AppShell",
		blurb:
			"The signed-in frame: Sidebar on a canvas, the screen an inset panel, a third pane beside it.",
		wide: true,
		render: () => (
			<div className="q-sb-app-story__mini">
				<div className="q-sb-app-story__mini-inner">
					<AppShell
						sidebar={<DemoSidebar />}
						topBar={<TopBar crumbs={[{ label: "Runs", href: "#" }, { label: "Run 233f76c2" }]} />}
						mainId="tile-app-main"
						asideId="tile-app-aside"
					>
						<DemoPage>
							<PageHeader as="h2" title="Run 233f76c2" />
						</DemoPage>
					</AppShell>
				</div>
			</div>
		),
	},
	{
		name: "Panel",
		blurb: "A titled section on a soft ground, instead of a rule on top.",
		render: () => (
			<Panel title="Approvals" as="h3" count={2} description="Runs waiting on a person.">
				<Link href="#">Run 51c0d7f3</Link> wants to send 14 emails
			</Panel>
		),
	},
	{
		name: "PageHeader",
		blurb: "The top of a screen: back link, title with status, key facts and actions.",
		wide: true,
		render: () => (
			<div className="q-sb-tile-stack">
				<PageHeader
					as="h2"
					back={{ label: "Runs", href: "#" }}
					title="Run 233f76c2"
					status={<Badge dot>Idle</Badge>}
					meta={["Cost $0.902049", "Runner Orca"]}
					actions={
						<Button size="sm" variant="primary">
							Restart run
						</Button>
					}
				/>
			</div>
		),
	},
	{
		name: "DescriptionList",
		blurb: "An entity's properties as label and value pairs, mono IDs copyable.",
		render: () => (
			<div className="q-sb-tile-stack">
				<DescriptionList
					size="sm"
					items={[
						{ label: "Runner", value: "Orca" },
						{ label: "Cost", value: "$0.902049" },
						{ label: "Run ID", value: "233f76c2", mono: true },
					]}
				/>
			</div>
		),
	},
	{
		name: "EntityLink",
		blurb: "A reference to a run, project or ticket that unmistakably navigates.",
		render: () => (
			<div className="q-sb-tile-stack">
				<EntityLink href="#" kind="Run" id="233f76c2" mono />
				<EntityLink href="#" kind="Project">
					Newsroom
				</EntityLink>
				<EntityLink href="#" kind="Ticket" id="B1" mono state="done" />
			</div>
		),
	},
	{
		name: "FileCard",
		blurb: "A file or artifact version: its kind, size and a Download.",
		render: () => (
			<FileCard
				size="sm"
				name="q3-pipeline.xlsx"
				kind="Spreadsheet"
				ext="XLSX"
				bytes={2_560}
				meta="v1"
				href="#"
			/>
		),
	},
	{
		name: "WorkspaceSwitcher",
		blurb: "The sidebar's head: the workspace's mark and name, and a menu to switch.",
		render: () => (
			<Canvas>
				<WorkspaceSwitcher name="Agentworks" detail="Team plan" items={WORKSPACE_ITEMS} />
			</Canvas>
		),
	},
	{
		name: "TopBar",
		blurb: "The slim bar above a screen: where you are, and the screen's global actions.",
		wide: true,
		render: () => (
			<Frame>
				<TopBar
					crumbs={[{ label: "Runs", href: "#" }, { label: "Run 233f76c2" }]}
					actions={
						<>
							<Button
								size="sm"
								variant="ghost"
								icon={<AppIcon name="bell" />}
								aria-label="Notifications"
							/>
							<Button size="sm" variant="primary">
								New run
							</Button>
						</>
					}
				/>
			</Frame>
		),
	},
	{
		name: "AccountMenu",
		blurb: "The sidebar's foot: who is signed in, with profile and sign out.",
		render: () => (
			<Canvas>
				<AccountMenu name="Ada Park" detail="ada@agentworks.dev" items={ACCOUNT_ITEMS} />
			</Canvas>
		),
	},
	{
		name: "Transcript",
		blurb: "The read-back of an agent run: sessions of messages, tool calls and events.",
		wide: true,
		render: () => (
			<Transcript
				open={[]}
				sessions={[
					{
						id: "s1",
						startedAt: "Oct 9, 14:02",
						items: [
							{ kind: "message", role: "user", content: "Hi" },
							{ kind: "tool", name: "ToolSearch", input: "project capabilities" },
							{ kind: "message", role: "assistant", content: "I can help in a few ways." },
						],
					},
					{
						id: "s2",
						startedAt: "Oct 9, 14:20",
						items: [
							{ kind: "message", role: "user", content: "try again" },
							{ kind: "tool", name: "slack.send_message", input: "#support", status: "error" },
						],
					},
				]}
			/>
		),
	},
	{
		name: "ShellNotice",
		blurb: "An urgent workspace-wide condition, one line on the canvas above the panel.",
		render: () => (
			<Canvas>
				<ShellNotice action={<Link href="#">Update billing</Link>}>
					Your card was declined.
				</ShellNotice>
			</Canvas>
		),
	},
	{
		name: "SidebarNotice",
		blurb: "A slow account nudge at the sidebar's foot: a trial ending, usage near a limit.",
		render: () => (
			<Canvas>
				<SidebarNotice
					title="Trial: 3 days left"
					progress={0.78}
					action={{ label: "Choose a plan", href: "#" }}
				/>
			</Canvas>
		),
	},
	{
		name: "NoticeChip",
		blurb: "A notice about this page, as a pill in the TopBar that opens the details.",
		render: () => (
			<div className="q-sb-tile-row">
				<NoticeChip>Run paused</NoticeChip>
				<NoticeChip tone="info">DNS check pending</NoticeChip>
			</div>
		),
	},
	{
		name: "AppIcon",
		blurb: "quiet's stroke icons as bare SVG, sized in px for nav and menus.",
		render: () => (
			<div className="q-sb-tile-row">
				<AppIcon name="home" size="lg" />
				<AppIcon name="runs" size="lg" />
				<AppIcon name="file" size="lg" />
				<AppIcon name="approvals" size="lg" />
				<AppIcon name="settings" size="lg" />
			</div>
		),
	},
];
