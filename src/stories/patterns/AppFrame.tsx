import { type ReactNode, useEffect, useState } from "react";
import {
	Avatar,
	Breadcrumb,
	Button,
	CommandPalette,
	DropdownMenu,
	Sidebar,
	SidebarProvider,
	SidebarTrigger,
	Text,
	Toaster,
	useSidebar,
	Wordmark,
} from "../../index";
import "./AppFrame.scss";

// The signed-in app frame every Patterns screen sits in — the reference app kit's AppShell
// (ui_kits/app/AppShell.jsx) rebuilt on quiet: 240 sidebar + 64 top bar + main; stories set density "app".
// Below 720px the Sidebar becomes its own off-canvas drawer, opened by the SidebarTrigger in the
// top bar (SidebarProvider shares the state). Toasts go through one Toaster and toast().
// Layout lives in AppFrame.scss, on --q-* tokens. Pages use its helper classes:
// q-sb-app-frame__stack (--section, --stack, --field, --inline), __row (--stack) and __hero.

export const NAV = [
	{
		label: "Workspace",
		items: [
			{
				label: "Overview",
				value: "dashboard",
				icon: "·",
				href: "?path=/story/patterns-dashboard--default",
			},
			{
				label: "Campaigns",
				value: "records",
				icon: "/",
				badge: 14,
				badgeLabel: "14 campaigns",
				href: "?path=/story/patterns-records--default",
			},
			{
				label: "Assistant",
				value: "assistant",
				icon: "✳",
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
				icon: "…",
				href: "?path=/story/patterns-settings--default",
			},
			{
				label: "Billing",
				value: "billing",
				icon: "$",
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
};

export function AppFrame(props: FrameProps) {
	return (
		<SidebarProvider breakpoint={720}>
			<Frame {...props} />
		</SidebarProvider>
	);
}

function Frame({ active, crumbs, children, padded = true }: FrameProps) {
	const { isMobile: narrow } = useSidebar();
	const [palette, setPalette] = useState(false);
	const account = (
		<div className="q-sb-app-frame__row">
			<Avatar name="Ada Park" size="sm" />
			<div className="q-sb-app-frame__person">
				<Text size="sm" color="heading" weight="medium">
					Ada Park
				</Text>
				<Text size="xs" color="muted">
					Owner · Sjocamp
				</Text>
			</div>
		</div>
	);
	return (
		<div className={narrow ? "q-sb-app-frame q-sb-app-frame--narrow" : "q-sb-app-frame"}>
			<Sidebar
				label="Main"
				mobile="drawer"
				value={active}
				header={<Wordmark size="nav" />}
				groups={NAV}
				footer={account}
				className={narrow ? undefined : "q-sb-app-frame__sidebar"}
			/>
			<div className="q-sb-app-frame__body">
				<header className="q-sb-app-frame__topbar">
					<SidebarTrigger />
					<Breadcrumb
						items={narrow ? crumbs.slice(-1) : crumbs}
						className="q-sb-app-frame__crumbs"
					/>
					<Button
						size="sm"
						variant="outline"
						onClick={() => setPalette(true)}
						rightIcon={
							narrow ? undefined : (
								<Text size="xs" color="muted" mono>
									⌘K
								</Text>
							)
						}
					>
						Search
					</Button>
					<DropdownMenu
						size="sm"
						align="end"
						width={240}
						label="Account"
						trigger={
							<Button
								size="sm"
								variant="ghost"
								icon={<Avatar name="Ada Park" size="xs" />}
								aria-label="Account menu"
							/>
						}
						header={account}
						items={[
							{ label: "Settings" },
							{ label: "Keyboard shortcuts", shortcut: "?" },
							{ divider: true },
							{ label: "Sign out" },
						]}
					/>
				</header>
				<main
					id="app-main"
					aria-label="Content"
					className={
						padded ? "q-sb-app-frame__main q-sb-app-frame__main--padded" : "q-sb-app-frame__main"
					}
				>
					{children}
				</main>
			</div>
			{/* Transient feedback on the user's own actions: bottom-right, three at most. */}
			<Toaster position="bottom-right" max={3} />
			<CommandPalette
				open={palette}
				onOpen={() => setPalette(true)}
				onClose={() => setPalette(false)}
				items={COMMANDS}
			/>
		</div>
	);
}
