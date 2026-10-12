import { DocsContainer, type DocsContainerProps } from "@storybook/addon-docs/blocks";
import { type ReactNode, useEffect, useState } from "react";
import { defaultTheme, themes } from "../src/styles/themes/themes";
import { docsDarkTheme, docsTheme } from "./theme";

// The store's globals aren't in DocsContainerProps' types; read them defensively.
type WithGlobals = { store?: { userGlobals?: { get?: () => Record<string, unknown> } } };

function currentTheme(context: DocsContainerProps["context"]): string {
	const globals = (context as unknown as WithGlobals).store?.userGlobals?.get?.();
	return typeof globals?.theme === "string" ? globals.theme : defaultTheme;
}

/** Docs pages in the toolbar theme's light or dark, so a story's QuietRoot sits on a matching page. */
export function ThemedDocsContainer({
	children,
	context,
}: DocsContainerProps & { children?: ReactNode }) {
	const [theme, setTheme] = useState(() => currentTheme(context));
	useEffect(() => {
		const onGlobals = ({ globals }: { globals: Record<string, unknown> }) => {
			if (typeof globals.theme === "string") setTheme(globals.theme);
		};
		context.channel.on("globalsUpdated", onGlobals);
		return () => context.channel.off("globalsUpdated", onGlobals);
	}, [context]);
	const dark = themes[theme]?.colorScheme === "dark";
	return (
		<DocsContainer context={context} theme={dark ? docsDarkTheme : docsTheme}>
			{children}
		</DocsContainer>
	);
}
