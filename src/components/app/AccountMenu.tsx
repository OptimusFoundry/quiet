import type React from "react";
import { Avatar } from "../core/Avatar";
import { DropdownMenu, type DropdownMenuProps } from "../overlays/DropdownMenu";
import { AppIcon } from "./AppIcon";
import "./AccountMenu.scss";

/**
 * The foot of the app sidebar: who is signed in, opening a menu upward (profile, preferences,
 * sign out). A menu button (Enter, Space or ↓ opens; Escape closes and returns focus).
 * @startingPoint section="App" subtitle="Signed-in person and account menu" viewport="600x360"
 */
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
	className?: string;
	style?: React.CSSProperties;
}

export function AccountMenu({
	name,
	detail,
	src,
	items,
	onSelect,
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
			className={["q-account-menu", className].filter(Boolean).join(" ")}
			style={style}
			trigger={
				<button type="button" className="q-account-menu__button">
					<Avatar name={name} src={src} size="sm" />
					<span className="q-account-menu__text">
						<span className="q-account-menu__name">{name}</span>
						{detail && <span className="q-account-menu__detail">{detail}</span>}
					</span>
					<AppIcon name="more" className="q-account-menu__more" />
				</button>
			}
		/>
	);
}
