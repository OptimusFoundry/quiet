import {
	type CSSProperties,
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import {
	Avatar,
	Breadcrumb,
	Button,
	CommandPalette,
	Drawer,
	DropdownMenu,
	Sidebar,
	Text,
	Toast,
	Wordmark,
} from "../../index";

// The signed-in app frame every Patterns screen sits in — the reference app kit's AppShell
// (ui_kits/app/AppShell.jsx) rebuilt on quiet: 240 sidebar + 64 top bar + main, density "app".
// Below 720px the sidebar leaves the grid and opens from a Menu button in a left Drawer.
// Story-only glue: inline styles are layout only, on --q-* tokens.

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

type ToastInput = {
	title: ReactNode;
	description?: ReactNode;
	meta?: ReactNode;
	variant?: "default" | "neutral" | "success" | "warning" | "error";
};
const ToastContext = createContext<(t: ToastInput) => void>(() => {});
/** Transient feedback on the user's own action: bottom-right, max 3, auto-dismiss (errors 6s). */
export const useToast = () => useContext(ToastContext);

export const stack = (gap = "var(--q-space-block)"): CSSProperties => ({
	display: "flex",
	flexDirection: "column",
	gap,
	minWidth: 0,
});
export const row = (gap = "var(--q-space-inline)"): CSSProperties => ({
	display: "flex",
	alignItems: "center",
	gap,
	flexWrap: "wrap",
	minWidth: 0,
});

export function AppFrame({
	active,
	crumbs,
	children,
	padded = true,
}: {
	active: string;
	crumbs: { label: ReactNode; href?: string }[];
	children: ReactNode;
	/** false = the page lays out its own panes edge to edge (list-detail, assistant) */
	padded?: boolean;
}) {
	const narrow = useNarrow();
	const [palette, setPalette] = useState(false);
	const [menu, setMenu] = useState(false);
	const [toasts, setToasts] = useState<(ToastInput & { id: number })[]>([]);
	const dismiss = useCallback(
		(id: number) => setToasts((list) => list.filter((t) => t.id !== id)),
		[],
	);
	const toast = useCallback(
		(t: ToastInput) => {
			const id = Date.now() + Math.random();
			setToasts((list) => [...list, { ...t, id }].slice(-3));
			setTimeout(() => dismiss(id), t.variant === "error" ? 6000 : 4000);
		},
		[dismiss],
	);
	const account = (
		<div style={row("var(--q-space-inline)")}>
			<Avatar name="Ada Park" size="sm" />
			<div style={{ display: "flex", flexDirection: "column" }}>
				<Text size="sm" color="heading" weight="medium">
					Ada Park
				</Text>
				<Text size="xs" color="muted">
					Owner · Sjocamp
				</Text>
			</div>
		</div>
	);
	const sidebar = (
		<Sidebar
			label="Main"
			value={active}
			header={<Wordmark size="nav" />}
			groups={NAV}
			footer={account}
			style={
				narrow ? { border: 0, width: "100%" } : { position: "sticky", top: 0, height: "100vh" }
			}
		/>
	);
	return (
		<ToastContext.Provider value={toast}>
			<div
				data-density="app"
				style={{
					display: "grid",
					gridTemplateColumns: narrow ? "minmax(0, 1fr)" : "var(--q-w-sidebar) minmax(0, 1fr)",
					minHeight: "100vh",
					// Charts' visually hidden data tables (q-sr-only on a <table>) don't shrink to 1px and
					// would extend the page; clip keeps them in the frame without breaking sticky.
					position: "relative",
					overflow: "clip",
					background: "var(--q-bg)",
					color: "var(--q-fg-body)",
					fontFamily: "var(--q-font-body)",
				}}
			>
				{!narrow && sidebar}
				<div
					style={{
						display: "grid",
						gridTemplateRows: "var(--q-h-topbar) minmax(0, 1fr)",
						minWidth: 0,
					}}
				>
					<header
						style={{
							...row("var(--q-space-stack)"),
							flexWrap: "nowrap",
							position: "sticky",
							top: 0,
							zIndex: "var(--q-z-sticky)" as unknown as number,
							padding: "0 var(--q-space-page-x)",
							borderBottom: "var(--q-hairline) solid var(--q-border)",
							background: "var(--q-bg)",
						}}
					>
						{narrow && (
							<Button size="sm" variant="ghost" aria-expanded={menu} onClick={() => setMenu(true)}>
								Menu
							</Button>
						)}
						<Breadcrumb
							items={narrow ? crumbs.slice(-1) : crumbs}
							style={{ flex: 1, minWidth: 0 }}
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
						style={
							padded
								? {
										...stack(),
										width: "100%",
										maxWidth: "var(--q-w-max)",
										margin: "0 auto",
										padding: "var(--q-space-section) var(--q-space-page-x)",
										boxSizing: "border-box",
									}
								: { minWidth: 0 }
						}
					>
						{children}
					</main>
				</div>
				{narrow && (
					<Drawer open={menu} onClose={() => setMenu(false)} side="left" size="sm" title="Sjocamp">
						{sidebar}
					</Drawer>
				)}
				<div
					style={{
						position: "fixed",
						right: "var(--q-space-block)",
						bottom: "var(--q-space-block)",
						left: narrow ? "var(--q-space-block)" : "auto",
						zIndex: "var(--q-z-toast)" as unknown as number,
						display: "flex",
						flexDirection: "column",
						gap: "var(--q-space-inline)",
						alignItems: "flex-end",
						pointerEvents: "none",
					}}
				>
					{toasts.map((t) => (
						<Toast
							key={t.id}
							{...t}
							onClose={() => dismiss(t.id)}
							style={{ pointerEvents: "auto" }}
						/>
					))}
				</div>
				<CommandPalette
					open={palette}
					onOpen={() => setPalette(true)}
					onClose={() => setPalette(false)}
					items={COMMANDS}
				/>
			</div>
		</ToastContext.Provider>
	);
}
