import type React from "react";
import { ICON_ALIASES, ICONS, type IconName } from "./icons";
import "./Icon.scss";

export { ICON_ALIASES, ICONS, type IconName } from "./icons";

/**
 * A stroke icon from quiet's set (`icons.ts`: a 24 grid, round caps, `currentColor`), sized in em so
 * it follows the text beside it. Decorative unless `label` is given.
 * @startingPoint section="Primitives" subtitle="Stroke icons" viewport="600x160"
 */
export interface IconProps
	extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children" | "color"> {
	ref?: React.Ref<HTMLSpanElement>;
	/** Icon name from the set (`ICONS`), e.g. "arrow-right", "close", "check", "info". The old glyph names expand, first, last, prev and next still resolve */
	name?: IconName | (string & {});
	/** @deprecated A literal text glyph instead of the icon; overrides name. Add a stroke icon to the set instead */
	glyph?: string;
	size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | number;
	color?:
		| "inherit"
		| "default"
		| "muted"
		| "quiet"
		| "primary"
		| "success"
		| "warning"
		| "error"
		| string;
	/** Accessible label; omit for decorative icons */
	label?: string;
	className?: string;
	style?: React.CSSProperties;
}

const SIZES: unknown[] = ["xs", "sm", "md", "lg", "xl", "2xl"];
const COLORS: string[] = [
	"default",
	"muted",
	"quiet",
	"primary",
	"success",
	"warning",
	"error",
	"inherit",
];

function pathOf(name: string): string | undefined {
	return (ICONS as Record<string, string>)[ICON_ALIASES[name] ?? name];
}

export function Icon({
	name = "arrow-right",
	glyph,
	size = "md",
	color = "inherit",
	label,
	className,
	style,
	...rest
}: IconProps) {
	const numeric = typeof size === "number";
	const knownColor = COLORS.includes(color);
	const vars: Record<string, string> = {};
	if (numeric) vars["--_size"] = `${size}px`;
	if (!knownColor) vars["--_color"] = color;
	const d = glyph === undefined ? pathOf(name) : undefined;
	const cls = [
		"q-icon",
		numeric ? "q-icon--custom-size" : `q-icon--${SIZES.includes(size) ? size : "md"}`,
		`q-icon--${knownColor ? color : "custom-color"}`,
		d === undefined && "q-icon--glyph",
		className,
	]
		.filter(Boolean)
		.join(" ");
	return (
		<span
			{...rest}
			role={label ? "img" : undefined}
			aria-label={label}
			aria-hidden={label ? undefined : true}
			className={cls}
			style={numeric || !knownColor ? { ...vars, ...style } : style}
		>
			{d === undefined ? (
				(glyph ?? name)
			) : (
				<svg viewBox="0 0 24 24" className="q-icon__svg" focusable="false" aria-hidden="true">
					<path d={d} />
				</svg>
			)}
		</span>
	);
}
Icon.names = Object.keys(ICONS) as IconName[];
