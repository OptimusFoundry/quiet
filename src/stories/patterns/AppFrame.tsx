import { type ReactNode, useEffect, useRef, useState } from "react";
import {
	AccountMenu,
	AppIcon,
	type AppIconName,
	AppShell,
	Avatar,
	Button,
	CommandPalette,
	List,
	Sidebar,
	type SidebarProps,
	Toaster,
	TopBar,
	WorkspaceSwitcher,
} from "../../index";
import "./AppFrame.scss";

// The signed-in app frame every Patterns screen sits in, on quiet's AppShell: the Sidebar on a
// canvas (WorkspaceSwitcher, ⌘K search, grouped nav with AppIcons, AccountMenu at the foot), the
// screen an inset panel with a TopBar (breadcrumb + global actions) pinned inside it. Stories set
// density "app". Below 720px the panel goes flush and the Sidebar becomes a drawer, opened from the
// TopBar. Toasts go through one Toaster and toast(). Pages use the helper classes in AppFrame.scss:
// q-sb-app-frame__stack (--section, --stack, --field, --inline), __row (--stack) and __hero.

export const NAV: NonNullable<SidebarProps["groups"]> = [
	{
		label: "Workspace",
		items: [
			{
				label: "Overview",
				value: "dashboard",
				icon: <AppIcon name="home" />,
				href: "?path=/story/patterns-dashboard--default",
			},
			{
				label: "Campaigns",
				value: "records",
				icon: <AppIcon name="campaigns" />,
				badge: 14,
				badgeLabel: "14 campaigns",
				href: "?path=/story/patterns-records--default",
			},
			{
				label: "Assistant",
				value: "assistant",
				icon: <AppIcon name="assistant" />,
				href: "?path=/story/patterns-assistant--default",
			},
		],
	},
	{
		label: "Account",
		items: [
			{
				label: "Settings",
				value: "settings",
				icon: <AppIcon name="settings" />,
				href: "?path=/story/patterns-settings--default",
			},
			{
				label: "Billing",
				value: "billing",
				icon: <AppIcon name="billing" />,
				href: "?path=/story/patterns-billing--default",
			},
		],
	},
];

const COMMANDS = [
	{ label: "Overview", group: "Go to" },
	{ label: "Campaigns", group: "Go to" },
	{ label: "Settings", group: "Go to" },
	{ label: "New campaign", group: "Actions", shortcut: "⌘N" },
	{ label: "Invite teammate", group: "Actions" },
	{ label: "Ask Meerkat", group: "Actions", shortcut: "⌘J" },
	{ label: "Spring waitlist", description: "Live · 1,240 signups", group: "Campaigns" },
	{ label: "Founding members", description: "Paused · 862 signups", group: "Campaigns" },
];

// The notifications pane (AppShell's third pane): today's first, unread marked.
const NOTIFICATIONS = [
	{
		id: 1,
		who: "Meerkat",
		what: "Drafted pause notices for 3 bouncing campaigns. Waiting for your approval.",
		group: "Today",
		when: "4m",
		unread: true,
	},
	{
		id: 2,
		who: "Leo Brandt",
		what: "Verified join.sjocamp.co (DNS and DKIM).",
		group: "Today",
		when: "1h",
		unread: true,
	},
	{
		id: 3,
		who: "Meerkat",
		what: "Posted the release notes to Bluesky and X.",
		group: "Today",
		when: "09:12",
		unread: false,
	},
	{
		id: 4,
		who: "Billing",
		what: "Invoice 0032 paid: $49, Pro.",
		group: "Earlier",
		when: "Sep 1",
		unread: false,
	},
];

function Notifications() {
	const row = (n: (typeof NOTIFICATIONS)[number]) => ({
		id: n.id,
		leading: <Avatar name={n.who} size="sm" />,
		primary: (
			<span className="q-sb-app-frame__note">
				<strong>{n.who}</strong> {n.what}
			</span>
		),
		trailing: (
			<span className="q-sb-app-frame__note-meta">
				{n.when}
				{n.unread && (
					<span className="q-sb-app-frame__unread">
						<span className="q-sr-only">Unread</span>
					</span>
				)}
			</span>
		),
		onClick: () => {},
	});
	return (
		<List
			size="sm"
			groups={["Today", "Earlier"].map((g) => ({
				label: g,
				items: NOTIFICATIONS.filter((n) => n.group === g).map(row),
			}))}
		/>
	);
}

/** Narrow = under 720px, the width at which Grid/Col and PageShell stack too. */
export function useNarrow(max = 719) {
	const query = `(max-width: ${max}px)`;
	const [narrow, setNarrow] = useState(
		() => typeof window !== "undefined" && window.matchMedia(query).matches,
	);
	useEffect(() => {
		const m = window.matchMedia(query);
		const f = () => setNarrow(m.matches);
		f();
		m.addEventListener("change", f);
		return () => m.removeEventListener("change", f);
	}, [query]);
	return narrow;
}

type FrameProps = {
	active: string;
	crumbs: { label: ReactNode; href?: string }[];
	children: ReactNode;
	/** false = the page lays out its own panes edge to edge (list-detail, assistant) */
	padded?: boolean;
	/** Another product's sidebar (default: the Sjocamp campaigns app) */
	nav?: typeof NAV;
	workspace?: { name: string; detail?: string };
	user?: { name: string; detail: string };
	/** Global actions in the TopBar, before the pane toggles */
	actions?: ReactNode;
	/** The screen's own third pane (e.g. the assistant's Changes), toggled from the TopBar.
	 *  It shares AppShell's pane with Notifications: one open at a time. */
	pane?: { title: string; icon: AppIconName; content: ReactNode; defaultOpen?: boolean };
};

export function AppFrame({
	active,
	crumbs,
	children,
	padded = true,
	nav = NAV,
	workspace = { name: "Sjocamp", detail: "Growth plan" },
	user = { name: "Ada Park", detail: "ada@sjocamp.com" },
	actions,
	pane,
}: FrameProps) {
	const [palette, setPalette] = useState(false);
	// Which pane is open. A screen's own pane starts open beside it on desktop, never over it on a phone.
	const [open, setOpen] = useState<"pane" | "notes" | null>(() =>
		pane?.defaultOpen && !window.matchMedia("(max-width: 719px)").matches ? "pane" : null,
	);
	const toggle = (which: "pane" | "notes") => setOpen((o) => (o === which ? null : which));
	// The pane keeps showing what was open while it slides out.
	const shown = useRef(open);
	if (open) shown.current = open;
	const showPane = shown.current === "pane" && pane;
	const header = (
		<div className="q-sb-app-frame__head">
			<WorkspaceSwitcher
				name={workspace.name}
				detail={workspace.detail}
				items={[
					{ group: "Workspaces" },
					{ label: workspace.name, active: true, icon: <AppIcon name="check" size="sm" /> },
					{ label: "Optimus Foundry", icon: <span /> },
					{ divider: true },
					{ label: "Workspace settings", icon: <AppIcon name="settings" size="sm" /> },
					{ label: "New workspace", icon: <AppIcon name="plus" size="sm" /> },
				]}
			/>
			{/* Search first after the switcher: it is where the drawer puts focus when it opens. */}
			<button type="button" className="q-sb-app-frame__search" onClick={() => setPalette(true)}>
				<AppIcon name="search" size="sm" />
				<span className="q-sb-app-frame__search-label">Search</span>
				<kbd className="q-sb-app-frame__kbd">⌘K</kbd>
			</button>
		</div>
	);
	const footer = (
		<AccountMenu
			name={user.name}
			detail={user.detail}
			items={[
				{ label: "Profile", icon: <AppIcon name="user" size="sm" /> },
				{ label: "Keyboard shortcuts", shortcut: "?", icon: <AppIcon name="help" size="sm" /> },
				{ divider: true },
				{ label: "Sign out", icon: <AppIcon name="sign-out" size="sm" /> },
			]}
		/>
	);
	return (
		<>
			<AppShell
				sidebar={
					<Sidebar
						label="Main"
						compact
						value={active}
						header={header}
						footer={footer}
						groups={nav}
					/>
				}
				topBar={
					<TopBar
						crumbs={crumbs}
						actions={
							<>
								{actions}
								{pane && (
									<Button
										size="sm"
										variant={open === "pane" ? "secondary" : "ghost"}
										leftIcon={<AppIcon name={pane.icon} />}
										aria-expanded={open === "pane"}
										aria-controls="app-aside"
										onClick={() => toggle("pane")}
									>
										{pane.title}
									</Button>
								)}
								<Button
									size="sm"
									variant={open === "notes" ? "secondary" : "ghost"}
									icon={<AppIcon name="bell" />}
									aria-label="Notifications, 2 unread"
									aria-expanded={open === "notes"}
									aria-controls="app-aside"
									onClick={() => toggle("notes")}
								/>
							</>
						}
					/>
				}
				aside={showPane ? pane.content : <Notifications />}
				asideTitle={showPane ? pane.title : "Notifications"}
				asideOpen={open !== null}
				onAsideClose={() => setOpen(null)}
			>
				<div
					className={
						padded ? "q-sb-app-frame__main q-sb-app-frame__main--padded" : "q-sb-app-frame__main"
					}
				>
					{children}
				</div>
			</AppShell>
			{/* Transient feedback on the user's own actions: bottom-right, three at most. */}
			<Toaster position="bottom-right" max={3} />
			<CommandPalette
				open={palette}
				onOpen={() => setPalette(true)}
				onClose={() => setPalette(false)}
				items={COMMANDS}
			/>
		</>
	);
}
