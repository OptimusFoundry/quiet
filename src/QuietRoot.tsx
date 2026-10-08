import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from "react";
import { type LinkComponent, LinkProvider } from "./lib/link";
import "./styles/index.scss";
import { defaultTheme, type ThemeName, themes } from "./styles/themes/themes";

export interface QuietRootProps extends HTMLAttributes<HTMLDivElement> {
	/** Any registered theme (styles/themes/themes.ts). Scopes to this subtree. */
	theme?: ThemeName;
	/** marketing = the website · app = dashboards & settings · compact = tables, inspectors, admin. */
	density?: "marketing" | "app" | "compact";
	/** Overrides the theme's accent (any CSS colour). Still punctuation only — never a fill. */
	accent?: string;
	/** Router link for every component that renders an `<a>` from an in-app `href`. */
	linkComponent?: LinkComponent;
	children: ReactNode;
	ref?: Ref<HTMLDivElement>;
}

/** Scopes a theme, density and accent to its subtree. For app-wide theming use <ThemeProvider>. */
export function QuietRoot({
	theme = defaultTheme,
	density = "marketing",
	accent,
	linkComponent,
	className,
	style,
	children,
	ref,
	...props
}: QuietRootProps) {
	return (
		<LinkProvider value={linkComponent}>
			<div
				ref={ref}
				className={className ? `quiet ${className}` : "quiet"}
				data-quiet=""
				data-theme={theme}
				data-density={density}
				style={
					{
						colorScheme: themes[theme].colorScheme,
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
