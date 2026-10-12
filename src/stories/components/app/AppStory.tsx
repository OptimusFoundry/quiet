import type { ReactNode } from "react";
import { AccountMenu } from "../../../components/app/AccountMenu";
import { AppIcon } from "../../../components/app/AppIcon";
import { SidebarNotice, type SidebarNoticeProps } from "../../../components/app/SidebarNotice";
import { WorkspaceSwitcher } from "../../../components/app/WorkspaceSwitcher";
import { Avatar } from "../../../components/core/Avatar";
import { List } from "../../../components/data/List";
import { Sidebar, type SidebarProps } from "../../../components/navigation/Sidebar";
import "./AppStory.scss";

// Shared by the Components/App stories and the App tiles: the grounds the app parts are drawn for
// (the shell's canvas, a hairline frame) and one agentworks sidebar to put in an AppShell.

/** AppShell's canvas, a sidebar wide: where WorkspaceSwitcher, AccountMenu and SidebarNotice sit. */
export function Canvas({
	children,
	tall,
	row,
}: {
	children: ReactNode;
	tall?: boolean;
	row?: boolean;
}) {
	const cls = [
		"q-sb-app-story__canvas",
		tall && "q-sb-app-story__canvas--tall",
		row && "q-sb-app-story__canvas--row",
	]
		.filter(Boolean)
		.join(" ");
	return <div className={cls}>{children}</div>;
}

/** A hairline frame on the page ground, for a TopBar or a PageHeader out of its shell. */
export function Frame({ children, narrow }: { children: ReactNode; narrow?: boolean }) {
	return (
		<div
			className={
				narrow ? "q-sb-app-story__frame q-sb-app-story__frame--narrow" : "q-sb-app-story__frame"
			}
		>
			{children}
		</div>
	);
}

/** Pushes what follows to the foot of a tall Canvas. */
export function Spacer() {
	return <div className="q-sb-app-story__spacer" />;
}

export const WORKSPACE_ITEMS = [
	{ group: "Workspaces" },
	{ label: "Agentworks", active: true, icon: <AppIcon name="check" size="sm" /> },
	{ label: "Optimus Foundry", icon: <span /> },
	{ divider: true as const },
	{ label: "Workspace settings", icon: <AppIcon name="settings" size="sm" /> },
	{ label: "New workspace", icon: <AppIcon name="plus" size="sm" /> },
];

export const ACCOUNT_ITEMS = [
	{ label: "Profile", icon: <AppIcon name="user" size="sm" /> },
	{ label: "Keyboard shortcuts", shortcut: "?", icon: <AppIcon name="help" size="sm" /> },
	{ divider: true as const },
	{ label: "Sign out", icon: <AppIcon name="sign-out" size="sm" /> },
];

export const NAV: NonNullable<SidebarProps["groups"]> = [
	{
		label: "Workspace",
		items: [
			{ label: "Overview", value: "overview", icon: <AppIcon name="home" /> },
			{
				label: "Runs",
				value: "runs",
				icon: <AppIcon name="runs" />,
				badge: 3,
				badgeLabel: "3 running",
			},
			{ label: "Artifacts", value: "artifacts", icon: <AppIcon name="file" /> },
			{ label: "Approvals", value: "approvals", icon: <AppIcon name="approvals" /> },
		],
	},
	{
		label: "Account",
		items: [
			{ label: "Settings", value: "settings", icon: <AppIcon name="settings" /> },
			{ label: "Billing", value: "billing", icon: <AppIcon name="billing" /> },
		],
	},
];

/** The agentworks Sidebar: WorkspaceSwitcher at the head, AccountMenu (and a nudge) at the foot. */
export function DemoSidebar({
	nudge,
	defaultCollapsed,
}: {
	nudge?: SidebarNoticeProps;
	defaultCollapsed?: boolean;
}) {
	return (
		<Sidebar
			label="Main"
			compact
			defaultValue="runs"
			defaultCollapsed={defaultCollapsed}
			attention={nudge?.title}
			groups={NAV}
			header={(collapsed) => (
				<WorkspaceSwitcher
					collapsed={collapsed}
					name="Agentworks"
					detail="Team plan"
					items={WORKSPACE_ITEMS}
				/>
			)}
			footer={(collapsed) => (
				<div className="q-sb-app-story__foot">
					{nudge && <SidebarNotice {...nudge} collapsed={collapsed} />}
					<AccountMenu
						collapsed={collapsed}
						name="Ada Park"
						detail="ada@agentworks.dev"
						items={ACCOUNT_ITEMS}
					/>
				</div>
			)}
		/>
	);
}

const NOTIFICATIONS = [
	{ id: 1, who: "Assistant", what: "Run 51c0d7f3 wants to send 14 emails.", when: "4m" },
	{ id: 2, who: "Leo Brandt", what: "Approved run 0c4f19be.", when: "1h" },
	{ id: 3, who: "Billing", what: "Invoice 0032 paid: $49.", when: "Sep 1" },
];

/** A notification list for AppShell's third pane. */
export function Notifications() {
	return (
		<List
			size="sm"
			items={NOTIFICATIONS.map((n) => ({
				id: n.id,
				leading: <Avatar name={n.who} size="sm" />,
				primary: n.what,
				secondary: `${n.who} · ${n.when}`,
				onClick: () => {},
			}))}
		/>
	);
}

/** Stand-in page content for a shell: a heading and a few muted blocks. */
export function DemoPage({ children }: { children?: ReactNode }) {
	return (
		<div className="q-sb-app-story__page">
			{children}
			<div className="q-sb-app-story__block" />
			<div className="q-sb-app-story__block q-sb-app-story__block--short" />
		</div>
	);
}
