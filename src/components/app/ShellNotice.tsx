import type React from "react";
import { Icon } from "../core/Icon";
import "./ShellNotice.scss";

/**
 * A workspace-wide condition that needs action, as one line of text on AppShell's canvas above the
 * panel: a failed payment, an outage, read-only mode, "viewing as Ada". Pass it to `AppShell notice`.
 * At most one at a time; slow nudges are a `SidebarNotice`, a page's own notice a `NoticeChip`.
 * @startingPoint section="App" subtitle="Urgent workspace notice on the canvas" viewport="900x80"
 */
export interface ShellNoticeProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "style" | "children"> {
	ref?: React.Ref<HTMLDivElement>;
	/** What holds and what follows, in one sentence: "Your card was declined, so campaigns pause on Oct 15." */
	children: React.ReactNode;
	/** The fix, usually a `Link` ("Update billing") */
	action?: React.ReactNode;
	/** "urgent" (default): an accent mark; "info": a muted one, for a condition that needs no action (maintenance tonight, viewing as someone) */
	tone?: "urgent" | "info";
	/** Shows a close button. Leave it out while the condition must stay in view */
	onDismiss?: () => void;
	/** Accessible name of the close button. Default "Dismiss notice" */
	dismissLabel?: string;
	className?: string;
	style?: React.CSSProperties;
}

export function ShellNotice({
	children,
	action,
	tone = "urgent",
	onDismiss,
	dismissLabel = "Dismiss notice",
	className,
	style,
	...rest
}: ShellNoticeProps) {
	return (
		<div
			role="status"
			{...rest}
			className={["q-shell-notice", `q-shell-notice--${tone}`, className].filter(Boolean).join(" ")}
			style={style}
		>
			<p className="q-shell-notice__text">
				<span aria-hidden="true" className="q-shell-notice__mark" />
				{children}
				{action && <span className="q-shell-notice__action">{action}</span>}
			</p>
			{onDismiss && (
				<button
					type="button"
					aria-label={dismissLabel}
					onClick={onDismiss}
					className="q-shell-notice__dismiss"
				>
					<Icon name="close" />
				</button>
			)}
		</div>
	);
}
