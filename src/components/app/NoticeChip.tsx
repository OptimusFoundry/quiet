import type React from "react";
import "./NoticeChip.scss";

/**
 * A notice about this page, as a small pill in the `TopBar`'s actions: "Campaign paused",
 * "Domain not verified". It opens the details in AppShell's third pane (pass `aria-expanded` and
 * `aria-controls` like the other pane toggles). In a narrow TopBar only its mark shows.
 * Workspace-wide conditions are a `ShellNotice`; account nudges a `SidebarNotice`.
 * @startingPoint section="App" subtitle="Page notice in the TopBar" viewport="600x80"
 */
export interface NoticeChipProps
	extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "style" | "children"> {
	ref?: React.Ref<HTMLButtonElement>;
	/** A few words naming the condition: "Campaign paused" */
	children: React.ReactNode;
	/** "urgent" (default): an accent mark on an attention tint; "info": a muted mark on the warm ground */
	tone?: "urgent" | "info";
	className?: string;
	style?: React.CSSProperties;
}

export function NoticeChip({
	children,
	tone = "urgent",
	className,
	style,
	...rest
}: NoticeChipProps) {
	return (
		<button
			type="button"
			{...rest}
			className={["q-notice-chip", `q-notice-chip--${tone}`, className].filter(Boolean).join(" ")}
			style={style}
		>
			<span aria-hidden="true" className="q-notice-chip__mark" />
			<span className="q-notice-chip__label">{children}</span>
		</button>
	);
}
