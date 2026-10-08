import {
	type CSSProperties,
	type HTMLAttributes,
	type ReactNode,
	type Ref,
	useEffect,
} from "react";
import "./tokens/tokens.scss";

const FONTS_HREF =
	"https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=JetBrains+Mono:wght@400;500&display=swap";

// Fonts are injected once per document so consumers don't need a <link> of their own.
function ensureFonts() {
	if (document.querySelector("link[data-quiet-fonts]")) return;
	const link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = FONTS_HREF;
	link.dataset.quietFonts = "";
	document.head.append(link);
}

export interface QuietRootProps extends HTMLAttributes<HTMLDivElement> {
	mode?: "light" | "dark";
	/** Spacing by job: marketing (the website), app (dashboards, settings), compact (dense admin). */
	density?: "marketing" | "app" | "compact";
	/** Any CSS colour. Defaults to molten. Still punctuation only, never a fill. */
	accent?: string;
	children: ReactNode;
	ref?: Ref<HTMLDivElement>;
}

/** Applies quiet's tokens, colour mode, density and accent to its subtree. */
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
	useEffect(ensureFonts, []);
	return (
		<div
			ref={ref}
			className={className ? `quiet ${className}` : "quiet"}
			data-mode={mode}
			data-density={density}
			style={accent ? ({ "--q-accent": accent, ...style } as CSSProperties) : style}
			{...props}
		>
			{children}
		</div>
	);
}
