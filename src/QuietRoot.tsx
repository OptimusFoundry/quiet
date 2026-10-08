import { type HTMLAttributes, type ReactNode, type Ref, useEffect } from "react";
import "./tokens/tokens.scss";

const FONTS_HREF =
	"https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..600&family=Geist+Mono:wght@400;500&display=swap";

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
	/** Accent hue (oklch degrees) and chroma; each product sets its own. */
	accent?: { hue: number; chroma?: number };
	children: ReactNode;
	ref?: Ref<HTMLDivElement>;
}

/** Applies quiet's tokens, colour mode and accent to its subtree. */
export function QuietRoot({
	mode = "light",
	accent,
	className,
	style,
	children,
	ref,
	...props
}: QuietRootProps) {
	useEffect(ensureFonts, []);
	const accentVars = accent
		? {
				"--q-accent-h": accent.hue,
				...(accent.chroma === undefined ? {} : { "--q-accent-c": accent.chroma }),
			}
		: {};
	return (
		<div
			ref={ref}
			className={className ? `quiet ${className}` : "quiet"}
			data-mode={mode}
			style={{ ...accentVars, ...style }}
			{...props}
		>
			{children}
		</div>
	);
}
