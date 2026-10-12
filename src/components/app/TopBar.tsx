import type React from "react";
import { Breadcrumb, type BreadcrumbProps } from "../navigation/Breadcrumb";
import { SidebarTrigger } from "../navigation/Sidebar";
import { AppIcon } from "./AppIcon";
import "./TopBar.scss";

/**
 * The slim bar at the top of an app screen: where you are (a breadcrumb, or a title) on the left,
 * the screen's global actions on the right. Inside an `AppShell` it pins to the panel's top and its
 * rule shows only once the content scrolls under it; on a phone it leads with the drawer trigger.
 * @startingPoint section="App" subtitle="Breadcrumb and actions above a screen" viewport="900x120"
 */
export interface TopBarProps
	extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "className" | "style"> {
	/** Where you are; the last crumb is the current page */
	crumbs?: BreadcrumbProps["items"];
	/** Shown instead of crumbs, e.g. the screen name */
	title?: React.ReactNode;
	/** Global actions for the screen (notifications, invite, the primary action), right-aligned */
	actions?: React.ReactNode;
	/** Extra content between the trail and the actions, e.g. a filter */
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

export function TopBar({
	crumbs,
	title,
	actions,
	children,
	className,
	style,
	...rest
}: TopBarProps) {
	return (
		<header {...rest} className={["q-top-bar", className].filter(Boolean).join(" ")} style={style}>
			<SidebarTrigger className="q-top-bar__trigger">
				<AppIcon name="menu" />
			</SidebarTrigger>
			<div className="q-top-bar__lead">
				{crumbs?.length ? (
					<Breadcrumb items={crumbs} size="sm" maxItems={4} className="q-top-bar__crumbs" />
				) : (
					title && <span className="q-top-bar__title">{title}</span>
				)}
			</div>
			{children && <div className="q-top-bar__middle">{children}</div>}
			{actions && <div className="q-top-bar__actions">{actions}</div>}
		</header>
	);
}
