import type React from "react";
import { ICONS, type IconName } from "../core/icons";
import "./AppIcon.scss";

export { APP_ICONS, type AppIconName } from "../core/icons";

/**
 * A stroke icon from quiet's set (`core/icons.ts`) as a bare `<svg>`, sized in px for nav, buttons
 * and menus. `Icon` draws the same set sized in em. Decorative unless `label` is given.
 * @startingPoint section="App" subtitle="Stroke icons for product screens" viewport="700x200"
 */
export interface AppIconProps
	extends Omit<React.SVGAttributes<SVGSVGElement>, "className" | "style" | "children"> {
	/** Icon name from the set, e.g. "home", "search", "chevron-down" */
	name: IconName;
	/** sm 14, md 16 (default), lg 20, or a pixel size */
	size?: "sm" | "md" | "lg" | number;
	/** Accessible name; when omitted the icon is hidden from assistive tech */
	label?: string;
	className?: string;
	style?: React.CSSProperties;
}

const SIZES: string[] = ["sm", "md", "lg"];

export function AppIcon({ name, size = "md", label, className, style, ...rest }: AppIconProps) {
	const named = typeof size === "string" && SIZES.includes(size);
	const cls = ["q-app-icon", named && `q-app-icon--${size}`, className].filter(Boolean).join(" ");
	const props = {
		...rest,
		viewBox: "0 0 24 24",
		className: cls,
		style:
			typeof size === "number"
				? ({ "--_size": `${size}px`, ...style } as React.CSSProperties)
				: style,
		focusable: "false" as const,
	};
	const path = <path d={ICONS[name]} />;
	return label ? (
		<svg {...props} role="img" aria-label={label}>
			{path}
		</svg>
	) : (
		<svg {...props} aria-hidden="true">
			{path}
		</svg>
	);
}
