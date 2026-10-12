import type React from "react";
import { DropdownMenu, type DropdownMenuProps } from "../overlays/DropdownMenu";
import { AppIcon } from "./AppIcon";
import "./WorkspaceSwitcher.scss";

export interface WorkspaceSwitcherProps {
	/** The current workspace's name */
	name: string;
	/** Its logo; defaults to the first letter on the brand colour */
	mark?: React.ReactNode;
	/** A muted line under the name, e.g. the plan */
	detail?: React.ReactNode;
	/** Menu items: the other workspaces, then actions ("Workspace settings", "New workspace") */
	items: DropdownMenuProps["items"];
	/** Called with the picked item */
	onSelect?: DropdownMenuProps["onSelect"];
	/** Accessible name of the menu. Default "Switch workspace" */
	label?: string;
	/** In a collapsed Sidebar rail: only the mark, named for screen readers, and the menu opens beside the rail. Pass the Sidebar's `header`/`footer` function argument */
	collapsed?: boolean;
	className?: string;
	style?: React.CSSProperties;
}

/**
 * The top of the app sidebar: the workspace's mark and name, opening a menu to switch workspace
 * or manage it. A menu button (Enter, Space or ↓ opens; Escape closes and returns focus).
 * @startingPoint section="App" subtitle="Workspace mark, name and switch menu" viewport="600x320"
 */
export function WorkspaceSwitcher({
	name,
	mark,
	detail,
	items,
	onSelect,
	collapsed = false,
	label = "Switch workspace",
	className,
	style,
}: WorkspaceSwitcherProps) {
	return (
		<DropdownMenu
			size="sm"
			width={240}
			label={label}
			items={items}
			onSelect={onSelect}
			className={["q-workspace-switcher", collapsed && "q-workspace-switcher--collapsed", className]
				.filter(Boolean)
				.join(" ")}
			style={style}
			trigger={
				<button
					type="button"
					aria-label={collapsed ? name : undefined}
					title={collapsed ? name : undefined}
					className="q-workspace-switcher__button"
				>
					<span aria-hidden="true" className="q-workspace-switcher__mark">
						{mark ?? name.trim().charAt(0).toUpperCase()}
					</span>
					{!collapsed && (
						<span className="q-workspace-switcher__text">
							<span className="q-workspace-switcher__name">{name}</span>
							{detail && <span className="q-workspace-switcher__detail">{detail}</span>}
						</span>
					)}
					{!collapsed && (
						<AppIcon name="chevrons-up-down" size="sm" className="q-workspace-switcher__chevron" />
					)}
				</button>
			}
		/>
	);
}
