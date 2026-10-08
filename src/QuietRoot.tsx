import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from "react";
import "./styles/styles.css";
import "./styles/quiet-modes.css";

export interface QuietRootProps extends HTMLAttributes<HTMLDivElement> {
	/** quiet addition: dark is derived from the same greys; the brand itself is light-only. */
	mode?: "light" | "dark";
	/** marketing = the website · app = dashboards & settings · compact = tables, inspectors, admin. */
	density?: "marketing" | "app" | "compact";
	/** quiet addition: replaces molten. Still punctuation only — never a fill. */
	accent?: string;
	children: ReactNode;
	ref?: Ref<HTMLDivElement>;
}

/** Scopes mode, density and accent. The Optimus Foundry tokens themselves load globally. */
export function QuietRoot({
	mode = "light",
	density = "marketing",
	accent,
	className,
	style,
	children,
	ref,
	...props
}: QuietRootProps) {
	return (
		<div
			ref={ref}
			className={className ? `quiet ${className}` : "quiet"}
			data-mode={mode}
			data-density={density}
			style={accent ? ({ "--molten": accent, ...style } as CSSProperties) : style}
			{...props}
		>
			{children}
		</div>
	);
}
