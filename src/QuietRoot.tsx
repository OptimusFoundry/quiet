import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from "react";
import { isDev } from "./lib/env";
import { type LinkComponent, LinkProvider } from "./lib/link";
import "./styles/index.scss";
import { useProviderTheme } from "./styles/themes/ThemeProvider";
import { defaultTheme, getTheme, type ThemeName } from "./styles/themes/themes";

export interface QuietRootProps extends HTMLAttributes<HTMLDivElement> {
	/** Any registered theme (built-in, or added with defineThemes). Unregistered names fall back to defaultTheme. Scopes to this subtree. Omitted: the enclosing ThemeProvider's theme, else defaultTheme. */
	theme?: ThemeName;
	/** Spacing density. `comfortable` (the default when no ancestor sets one) for most screens, `compact` for dense tools.
	 *  @deprecated `"app"` and `"marketing"`: quiet has one look; both mean `"comfortable"`. */
	density?: "comfortable" | "compact" | "app" | "marketing";
	/** Overrides the theme's accent (any CSS colour); the fill and text steps derive from it. */
	accent?: string;
	/** Router link for every component that renders an `<a>` from an in-app `href`. */
	linkComponent?: LinkComponent;
	children: ReactNode;
	ref?: Ref<HTMLDivElement>;
}

const warned = new Set<string>();

/** Scopes a theme, density and accent to its subtree. For app-wide theming use <ThemeProvider>. */
export function QuietRoot({
	theme,
	density,
	accent,
	linkComponent,
	className,
	style,
	children,
	ref,
	...props
}: QuietRootProps) {
	const inherited = useProviderTheme();
	const resolved = getTheme(theme ?? inherited ?? defaultTheme);
	// Only an explicit density is written, so a nested root inherits its parent's.
	const dense = density && (density === "compact" ? "compact" : "comfortable");
	if (isDev() && (density === "app" || density === "marketing") && !warned.has(density)) {
		warned.add(density);
		console.warn(
			`quiet: density="${density}" is deprecated (one look); use "comfortable" or "compact".`,
		);
	}
	return (
		<LinkProvider value={linkComponent}>
			<div
				ref={ref}
				className={className ? `quiet ${className}` : "quiet"}
				data-quiet=""
				data-theme={resolved.name}
				data-density={dense}
				style={
					{
						colorScheme: resolved.colorScheme,
						...(accent ? { "--q-accent": accent } : {}),
						...style,
					} as CSSProperties
				}
				{...props}
			>
				{children}
			</div>
		</LinkProvider>
	);
}
