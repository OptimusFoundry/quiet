import type React from "react";
import { APP_ICONS, type AppIconName } from "./icons";
import "./AppIcon.scss";

export type { AppIconName } from "./icons";
export { APP_ICONS } from "./icons";

/**
 * Stroke icon from quiet's app set (24 grid, round caps, `currentColor`). For product screens in the
 * app look; marketing pages keep the reference's glyphs (`Icon`). Decorative unless `label` is given.
 * @startingPoint section="App" subtitle="Stroke icons for product screens" viewport="700x200"
 */
export interface AppIconProps
	extends Omit<React.SVGAttributes<SVGSVGElement>, "className" | "style" | "children"> {
	/** Icon name from the set, e.g. "home", "search", "chevron-down" */
	name: AppIconName;
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
	const path = <path d={APP_ICONS[name]} />;
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
