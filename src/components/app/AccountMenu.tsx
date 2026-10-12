import type React from "react";
import { Avatar } from "../core/Avatar";
import { DropdownMenu, type DropdownMenuProps } from "../overlays/DropdownMenu";
import { AppIcon } from "./AppIcon";
import "./AccountMenu.scss";

export interface AccountMenuProps {
	/** The person's name */
	name: string;
	/** A muted line under the name, e.g. the email or role */
	detail?: React.ReactNode;
	/** Avatar image; initials from `name` otherwise */
	src?: string;
	/** Menu items, e.g. Profile, Preferences, a divider, Sign out */
	items: DropdownMenuProps["items"];
	/** Called with the picked item */
	onSelect?: DropdownMenuProps["onSelect"];
	/** Accessible name of the menu. Default "Account" */
	label?: string;
	/** In a collapsed Sidebar rail: only the avatar, named for screen readers, and the menu opens beside the rail. Pass the Sidebar's `header`/`footer` function argument */
	collapsed?: boolean;
	className?: string;
	style?: React.CSSProperties;
}

/**
 * The foot of the app sidebar: who is signed in, opening a menu upward (profile, preferences,
 * sign out). A menu button (Enter, Space or ↓ opens; Escape closes and returns focus).
 * @startingPoint section="App" subtitle="Signed-in person and account menu" viewport="600x360"
 */
export function AccountMenu({
	name,
	detail,
	src,
	items,
	onSelect,
	collapsed = false,
	label = "Account",
	className,
	style,
}: AccountMenuProps) {
	return (
		<DropdownMenu
			size="sm"
			width={240}
			label={label}
			items={items}
			onSelect={onSelect}
			className={["q-account-menu", collapsed && "q-account-menu--collapsed", className]
				.filter(Boolean)
				.join(" ")}
			style={style}
			trigger={
				<button
					type="button"
					aria-label={collapsed ? name : undefined}
					title={collapsed ? name : undefined}
					className="q-account-menu__button"
				>
					<Avatar name={name} src={src} size="sm" />
					{!collapsed && (
						<span className="q-account-menu__text">
							<span className="q-account-menu__name">{name}</span>
							{detail && <span className="q-account-menu__detail">{detail}</span>}
						</span>
					)}
					{!collapsed && <AppIcon name="more" className="q-account-menu__more" />}
				</button>
			}
		/>
	);
}
