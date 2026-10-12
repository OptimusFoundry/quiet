import React from "react";
import { useEscape, useFocusTrap, useModalBackground, usePresence } from "../../a11y/hooks";
import { SidebarProvider, useSidebar } from "../navigation/Sidebar";
import { AppIcon } from "./AppIcon";
import "./AppShell.scss";

export interface AppShellProps {
	/** The app's `Sidebar` (with a `WorkspaceSwitcher` header and an `AccountMenu` footer) */
	sidebar: React.ReactNode;
	/** A `TopBar`, pinned to the top of the panel; its rule shows once the panel scrolls */
	topBar?: React.ReactNode;
	/** A workspace-wide notice (`ShellNotice`), one line on the canvas above the panel. At most one */
	notice?: React.ReactNode;
	/** The screen: usually a `PageHeader` and the page's sections */
	children?: React.ReactNode;
	/** Content of the third pane, e.g. a notification list */
	aside?: React.ReactNode;
	/** Third pane open (controlled) */
	asideOpen?: boolean;
	/** Called when the pane asks to close (its close button, Escape) */
	onAsideClose?: () => void;
	/** The pane's title and accessible name, e.g. "Notifications" */
	asideTitle?: string;
	/** id of the pane, for the opener's aria-controls. Default "app-aside" */
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
 * panel that scrolls on its own, with an optional TopBar pinned inside it. An optional third pane
 * (notifications, details, an assistant) opens beside the screen and narrows it, never covering it.
 * Starts with a skip link. Below `breakpoint` the panel goes flush, the Sidebar becomes a drawer
 * (opened from the TopBar) and the third pane covers the screen, sliding in from the right.
 * @startingPoint section="App" subtitle="Sidebar on a canvas, inset main panel, third pane" viewport="1100x560"
 */
export function AppShell({ breakpoint = 720, ...props }: AppShellProps) {
	return (
		<SidebarProvider breakpoint={breakpoint}>
			<ShellView {...props} />
		</SidebarProvider>
	);
}

// The pane's width animation (--q-dur-expand); it unmounts after it.
const ASIDE_EXIT_MS = 280;

function ShellView({
	sidebar,
	topBar,
	notice,
	children,
	aside,
	asideOpen = false,
	onAsideClose,
	asideTitle = "Details",
	asideId = "app-aside",
	mainId = "app-main",
	mainLabel = "Content",
	skipLabel = "Skip to content",
	className,
	style,
}: Omit<AppShellProps, "breakpoint">) {
	const { isMobile } = useSidebar();
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

	// Third pane. Desktop: beside the screen, non-modal. Phone: the same pane, full screen over the
	// screen, so it is modal there (background inert, focus held). Either way focus moves in on
	// open and back to the opener on close; Escape closes it.
	const paneOpen = !!aside && asideOpen;
	const { mounted, state } = usePresence(paneOpen, ASIDE_EXIT_MS);
	const pane = React.useRef<HTMLElement>(null);
	const opener = React.useRef<HTMLElement | null>(null);
	// The opener is read when the pane is asked to open, before it mounts and anything moves focus.
	React.useEffect(() => {
		if (!paneOpen || !mounted || pane.current?.contains(document.activeElement)) return;
		pane.current?.focus({ preventScroll: true });
	}, [paneOpen, mounted]);
	React.useEffect(() => {
		if (paneOpen) {
			opener.current ??= document.activeElement as HTMLElement | null;
			return;
		}
		const back = opener.current;
		opener.current = null;
		if (back?.isConnected && pane.current?.contains(document.activeElement)) back.focus();
	}, [paneOpen]);
	useEscape(paneOpen, onAsideClose);
	const sheet = isMobile && paneOpen && mounted;
	useModalBackground(pane, sheet);
	useFocusTrap(pane, sheet);

	const cls = [
		"q-app-shell",
		isMobile && "q-app-shell--narrow",
		notice && "q-app-shell--notice",
		paneOpen && !isMobile && "q-app-shell--aside-open",
		className,
	]
		.filter(Boolean)
		.join(" ");
	return (
		<div className={cls} style={style}>
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
			<div className="q-app-shell__aside-slot">
				{mounted && (
					<aside
						ref={pane}
						id={asideId}
						aria-label={asideTitle}
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
							<h2 className="q-app-shell__aside-title">{asideTitle}</h2>
							<button
								type="button"
								aria-label={`Close ${asideTitle.toLowerCase()}`}
								onClick={onAsideClose}
								className="q-app-shell__aside-close"
							>
								<AppIcon name="close" />
							</button>
						</div>
						<div className="q-app-shell__aside-body">{aside}</div>
					</aside>
				)}
			</div>
		</div>
	);
}
