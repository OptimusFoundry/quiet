import type React from "react";
import { useLinkElement } from "../../lib/link";
import { Icon } from "../core/Icon";
import "./SidebarNotice.scss";

export interface SidebarNoticeProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "className" | "style" | "children"> {
	ref?: React.Ref<HTMLDivElement>;
	/** One short line: "Trial: 3 days left" */
	title: string;
	/** An optional second line */
	description?: React.ReactNode;
	/** How far along, 0 to 1, drawn as a thin bar (days used, quota used) */
	progress?: number;
	/** What the bar measures, for screen readers. Default: the title */
	progressLabel?: string;
	/** The one action: a link (`href`, routed by `QuietRoot linkComponent`) or a button (`onClick`) */
	action?: { label: string; href?: string; onClick?: () => void };
	/** Shows a close button */
	onDismiss?: () => void;
	/** Accessible name of the close button. Default "Dismiss" */
	dismissLabel?: string;
	/** In a collapsed Sidebar rail: only an icon with a mark, named by the title, doing the action. Pass the Sidebar's `footer` function argument */
	collapsed?: boolean;
	className?: string;
	style?: React.CSSProperties;
}

function Action({
	action,
	className,
	children,
	label,
}: {
	action: NonNullable<SidebarNoticeProps["action"]>;
	className: string;
	children: React.ReactNode;
	label?: string;
}) {
	const A = useLinkElement(action.href);
	return action.href ? (
		<A
			href={action.href}
			onClick={action.onClick}
			className={className}
			aria-label={label}
			title={label}
		>
			{children}
		</A>
	) : (
		<button
			type="button"
			onClick={action.onClick}
			className={className}
			aria-label={label}
			title={label}
		>
			{children}
		</button>
	);
}

/**
 * A slow nudge about the account, as a small card at the foot of the Sidebar, above the
 * `AccountMenu`: a trial ending, usage nearing a limit, a new version. Dismissible. In the collapsed
 * rail it becomes an icon with a mark. Urgent conditions are a `ShellNotice` instead.
 * @startingPoint section="App" subtitle="Account nudge in the Sidebar" viewport="300x200"
 */
export function SidebarNotice({
	title,
	description,
	progress,
	progressLabel,
	action,
	onDismiss,
	dismissLabel = "Dismiss",
	collapsed = false,
	className,
	style,
	...rest
}: SidebarNoticeProps) {
	const cls = ["q-sidebar-notice", collapsed && "q-sidebar-notice--collapsed", className]
		.filter(Boolean)
		.join(" ");
	if (collapsed) {
		if (!action) return null;
		return (
			<div {...rest} className={cls} style={style}>
				<Action
					action={action}
					className="q-sidebar-notice__rail"
					label={`${title}: ${action.label}`}
				>
					<Icon name="info" />
					<span aria-hidden="true" className="q-sidebar-notice__mark" />
				</Action>
			</div>
		);
	}
	const pct =
		progress === undefined ? undefined : Math.round(Math.min(1, Math.max(0, progress)) * 100);
	return (
		<div {...rest} className={cls} style={style}>
			<div className="q-sidebar-notice__head">
				<p className="q-sidebar-notice__title">{title}</p>
				{onDismiss && (
					<button
						type="button"
						aria-label={dismissLabel}
						onClick={onDismiss}
						className="q-sidebar-notice__dismiss"
					>
						<Icon name="close" />
					</button>
				)}
			</div>
			{description && <p className="q-sidebar-notice__description">{description}</p>}
			{pct !== undefined && (
				<div
					role="progressbar"
					aria-label={progressLabel ?? title}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-valuenow={pct}
					className="q-sidebar-notice__bar"
					style={{ "--_progress": `${pct}%` } as React.CSSProperties}
				/>
			)}
			{action && (
				<Action action={action} className="q-sidebar-notice__action">
					{action.label}
				</Action>
			)}
		</div>
	);
}
