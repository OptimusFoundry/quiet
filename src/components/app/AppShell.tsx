import React from "react";
import { useEscape, useFocusTrap, useModalBackground, usePresence } from "../../a11y/hooks";
import { SidebarProvider, useSidebar } from "../navigation/Sidebar";
import { AppIcon } from "./AppIcon";
import "./AppShell.scss";

export interface AppShellPane {
	/** id of the pane, for the opener's aria-controls; also its key */
	id: string;
	/** The pane's title and accessible name, e.g. "Notifications" */
	title: string;
	/** Pane open (controlled) */
	open: boolean;
	/** Called when the pane asks to close: its close button, Escape, or a newer pane that doesn't fit beside it */
	onClose?: () => void;
	children?: React.ReactNode;
	/** `default` is 360 (a list); `wide` takes 2/3 of the room beside the Sidebar (a document or a preview), shrinking to 600 while other panes are open. Default "default" */
	width?: "default" | "wide";
	/** Replaces the title in the pane's head (a switcher, a name, a version, a menu); the close button stays */
	head?: React.ReactNode;
	/** The body takes no padding, for content that runs edge to edge */
	flush?: boolean;
	/** While open, holds the Sidebar at its rail. The person's own choice comes back when it closes */
	railSidebar?: boolean;
}

export interface AppShellProps {
	/** The app's `Sidebar` (with a `WorkspaceSwitcher` header and an `AccountMenu` footer) */
	sidebar: React.ReactNode;
	/** A `TopBar`, pinned to the top of the panel; its rule shows once the panel scrolls */
	topBar?: React.ReactNode;
	/** A workspace-wide notice (`ShellNotice`), one line on the canvas above the panel. At most one */
	notice?: React.ReactNode;
	/** The screen: usually a `PageHeader` and the page's sections */
	children?: React.ReactNode;
	/** Right panes, left to right. Each opens beside the screen; when a newer one doesn't fit, the older ones close. Takes the place of `aside` */
	panes?: AppShellPane[];
	/** The screen keeps at least this width (px) beside open panes. Default 400 */
	mainMinWidth?: number;
	/** Content of a single right pane, e.g. a notification list. Use `panes` for more than one */
	aside?: React.ReactNode;
	/** Single pane open (controlled) */
	asideOpen?: boolean;
	/** Called when the single pane asks to close (its close button, Escape) */
	onAsideClose?: () => void;
	/** The single pane's title and accessible name, e.g. "Notifications" */
	asideTitle?: string;
	/** id of the single pane, for the opener's aria-controls. Default "app-aside" */
	asideId?: string;
	/** Below this viewport width (px) the panel goes flush and the Sidebar becomes a drawer. Default 720 */
	breakpoint?: number;
	/** id of the main landmark, the skip link's target. Default "app-main" */
	mainId?: string;
	/** Accessible name of the main landmark. Default "Content" */
	mainLabel?: string;
	/** Text of the skip link. Default "Skip to content" */
	skipLabel?: string;
	className?: string;
	style?: React.CSSProperties;
}

/**
 * The signed-in app frame: the Sidebar sits on a soft canvas and the screen is an inset, raised
 * panel that scrolls on its own, with an optional TopBar pinned inside it. Right panes
 * (notifications, details, an assistant, a document) open beside the screen and narrow it, never
 * covering it; two can sit side by side, and Escape closes the newest first. Starts with a skip
 * link. Below `breakpoint` the panel goes flush, the Sidebar becomes a drawer (opened from the
 * TopBar) and a pane covers the screen, sliding in from the right, one at a time.
 * @startingPoint section="App" subtitle="Sidebar on a canvas, inset main panel, right panes" viewport="1100x560"
 */
export function AppShell({ breakpoint = 720, ...props }: AppShellProps) {
	const panes = shellPanes(props);
	const forceRail = panes.some((p) => p.open && p.railSidebar);
	return (
		<SidebarProvider breakpoint={breakpoint} forceRail={forceRail}>
			<ShellView {...props} panes={panes} />
		</SidebarProvider>
	);
}

function shellPanes({
	panes,
	aside,
	asideOpen = false,
	onAsideClose,
	asideTitle = "Details",
	asideId = "app-aside",
}: Omit<AppShellProps, "breakpoint">): AppShellPane[] {
	if (panes) return panes;
	if (aside == null) return [];
	return [
		{ id: asideId, title: asideTitle, open: asideOpen, onClose: onAsideClose, children: aside },
	];
}

// Widths come from the tokens, read off the shell, so the fit check sees the widths the Sidebar
// and panes are heading to, not a frame of their animation.
function tokenPx(el: HTMLElement, token: string): number {
	return Number.parseFloat(getComputedStyle(el).getPropertyValue(token)) || 0;
}

// A wide pane's token width is its floor: it grows past it to this share of the room beside the
// Sidebar, and gives width back while other panes are open.
const WIDE_SHARE = 2 / 3;

function paneWidth(el: HTMLElement, p: AppShellPane): number {
	return tokenPx(
		el,
		p.width === "wide" ? "--q-app-shell-aside-width-wide" : "--q-app-shell-aside-width",
	);
}

function ShellView({
	sidebar,
	topBar,
	notice,
	children,
	panes = [],
	mainMinWidth = 400,
	mainId = "app-main",
	mainLabel = "Content",
	skipLabel = "Skip to content",
	className,
	style,
}: Omit<AppShellProps, "breakpoint">) {
	const { isMobile, collapsed } = useSidebar();
	const root = React.useRef<HTMLDivElement>(null);
	// The TopBar's rule appears once content has scrolled under it: a sentinel at the top of the
	// panel leaves view (the panel scrolls on desktop, the page on a phone; both clip it).
	const sentinel = React.useRef<HTMLDivElement>(null);
	const [scrolled, setScrolled] = React.useState(false);
	React.useEffect(() => {
		const el = sentinel.current;
		if (!el || typeof IntersectionObserver === "undefined") return;
		const io = new IntersectionObserver(([e]) => setScrolled(!e!.isIntersecting));
		io.observe(el);
		return () => io.disconnect();
	}, []);

	const [width, setWidth] = React.useState(0);
	React.useEffect(() => {
		const el = root.current;
		if (!el || typeof ResizeObserver === "undefined") return;
		const ro = new ResizeObserver(([e]) => setWidth(e!.contentRect.width));
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	// Open pane ids, oldest first: Escape and the fit check both go by when a pane opened.
	const open = panes.filter((p) => p.open).map((p) => p.id);
	const order = React.useRef<string[]>([]);
	order.current = [
		...order.current.filter((id) => open.includes(id)),
		...open.filter((id) => !order.current.includes(id)),
	];
	const openKey = order.current.join(" ");
	const byId = new Map(panes.map((p) => [p.id, p]));

	useEscape(open.length > 0, () => byId.get(order.current.at(-1) ?? "")?.onClose?.());

	// Closes the oldest panes until the rest fit beside the screen; on a phone one pane shows.
	// biome-ignore lint/correctness/useExhaustiveDependencies: openKey stands for the open panes in byId
	React.useEffect(() => {
		const el = root.current;
		const kept = order.current.map((id) => byId.get(id)).filter((p) => p !== undefined);
		// width is 0 until the ResizeObserver first reports; checking then would close every pane but one.
		if (!el || width === 0 || kept.length < 2) return;
		const fits = () => {
			if (isMobile) return false;
			const rail = collapsed || kept.some((p) => p.railSidebar);
			const side = tokenPx(el, rail ? "--q-w-sidebar-collapsed" : "--q-w-sidebar");
			return width - side - kept.reduce((sum, p) => sum + paneWidth(el, p), 0) >= mainMinWidth;
		};
		while (kept.length > 1 && !fits()) kept.shift()?.onClose?.();
	}, [openKey, width, isMobile, collapsed, mainMinWidth]);

	const widePx = (p: AppShellPane): number | undefined => {
		const el = root.current;
		if (p.width !== "wide" || isMobile || !el || width === 0) return undefined;
		const others = panes.filter((o) => o.open && o.id !== p.id);
		const rail = collapsed || p.railSidebar || others.some((o) => o.railSidebar);
		const room = width - tokenPx(el, rail ? "--q-w-sidebar-collapsed" : "--q-w-sidebar");
		const taken = others.reduce((sum, o) => sum + paneWidth(el, o), 0);
		return Math.round(
			Math.max(paneWidth(el, p), Math.min(room * WIDE_SHARE, room - mainMinWidth - taken)),
		);
	};

	const cls = [
		"q-app-shell",
		isMobile && "q-app-shell--narrow",
		notice && "q-app-shell--notice",
		open.length > 0 && !isMobile && "q-app-shell--aside-open",
		className,
	]
		.filter(Boolean)
		.join(" ");
	return (
		<div ref={root} className={cls} style={style}>
			<a href={`#${mainId}`} className="q-app-shell__skip">
				{skipLabel}
			</a>
			<div className="q-app-shell__sidebar">{sidebar}</div>
			{notice && <div className="q-app-shell__notice">{notice}</div>}
			<main
				id={mainId}
				aria-label={mainLabel}
				tabIndex={-1}
				className="q-app-shell__panel"
				data-scrolled={String(scrolled)}
			>
				<div ref={sentinel} aria-hidden="true" className="q-app-shell__sentinel" />
				{topBar}
				{children}
			</main>
			<div className="q-app-shell__asides">
				{panes.map((p) => (
					<ShellPane key={p.id} pane={p} isMobile={isMobile} widthPx={widePx(p)} />
				))}
			</div>
		</div>
	);
}

// The pane's width animation (--q-dur-expand); it unmounts after it.
const ASIDE_EXIT_MS = 280;

// Desktop: beside the screen, non-modal. Phone: the same pane, full screen over the screen, so it
// is modal there (background inert, focus held). Either way focus moves in on open and back to the
// opener on close.
function ShellPane({
	pane: p,
	isMobile,
	widthPx,
}: {
	pane: AppShellPane;
	isMobile: boolean;
	widthPx?: number;
}) {
	const { mounted, state } = usePresence(p.open, ASIDE_EXIT_MS);
	// A closing pane keeps the width it had, so its content doesn't reflow while the slot shrinks.
	const shownPx = React.useRef(widthPx);
	if (p.open) shownPx.current = widthPx;
	const pane = React.useRef<HTMLElement>(null);
	const opener = React.useRef<HTMLElement | null>(null);
	// The opener is read when the pane is asked to open, before it mounts and anything moves focus.
	React.useEffect(() => {
		if (!p.open || !mounted || pane.current?.contains(document.activeElement)) return;
		pane.current?.focus({ preventScroll: true });
	}, [p.open, mounted]);
	React.useEffect(() => {
		if (p.open) {
			opener.current ??= document.activeElement as HTMLElement | null;
			return;
		}
		const back = opener.current;
		opener.current = null;
		if (back?.isConnected && pane.current?.contains(document.activeElement)) back.focus();
	}, [p.open]);
	const sheet = isMobile && p.open && mounted;
	useModalBackground(pane, sheet);
	useFocusTrap(pane, sheet);

	const slot = [
		"q-app-shell__aside-slot",
		p.width === "wide" && "q-app-shell__aside-slot--wide",
		p.open && !isMobile && "q-app-shell__aside-slot--open",
	]
		.filter(Boolean)
		.join(" ");
	return (
		<div
			className={slot}
			style={
				shownPx.current === undefined
					? undefined
					: ({ "--_w": `${shownPx.current}px` } as React.CSSProperties)
			}
		>
			{mounted && (
				<aside
					ref={pane}
					id={p.id}
					aria-label={p.title}
					aria-modal={isMobile || undefined}
					role={isMobile ? "dialog" : undefined}
					tabIndex={-1}
					className={
						isMobile
							? "q-app-shell__aside q-app-shell__aside--sheet q-anim-slide-right"
							: "q-app-shell__aside"
					}
					data-state={state}
				>
					<div className="q-app-shell__aside-head">
						{p.head != null ? (
							<div className="q-app-shell__aside-lead">{p.head}</div>
						) : (
							<h2 className="q-app-shell__aside-title">{p.title}</h2>
						)}
						<button
							type="button"
							aria-label={`Close ${p.title.toLowerCase()}`}
							onClick={p.onClose}
							className="q-app-shell__aside-close"
						>
							<AppIcon name="close" />
						</button>
					</div>
					<div
						className={
							p.flush
								? "q-app-shell__aside-body q-app-shell__aside-body--flush"
								: "q-app-shell__aside-body"
						}
					>
						{p.children}
					</div>
				</aside>
			)}
		</div>
	);
}
