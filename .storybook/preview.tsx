import type { Decorator, Preview } from "@storybook/react-vite";
import "../src/styles/fonts.css";
import { QuietRoot, type QuietRootProps } from "../src/QuietRoot";
import { defaultTheme, type ThemeName, themeNames, themes } from "../src/styles/themes/themes";
import { ThemedDocsContainer } from "./DocsTheme";

// Stories may set parameters.density ("compact").
const withQuiet: Decorator = (Story, ctx) => (
	<QuietRoot
		theme={(ctx.globals.theme as ThemeName) ?? defaultTheme}
		density={ctx.parameters.density as QuietRootProps["density"]}
	>
		<Story />
	</QuietRoot>
);

const preview: Preview = {
	decorators: [withQuiet],
	globalTypes: {
		theme: {
			description: "Theme",
			toolbar: {
				icon: "paintbrush",
				items: themeNames.map((value) => ({ value, title: themes[value]?.label ?? value })),
				dynamicTitle: true,
			},
		},
	},
	initialGlobals: { theme: defaultTheme },
	parameters: {
		layout: "fullscreen",
		docs: {
			container: ThemedDocsContainer,
			// The component's JSDoc, without its tags (@startingPoint is for the design artifact).
			extractComponentDescription: (component: { __docgenInfo?: { description?: string } }) =>
				(component?.__docgenInfo?.description ?? "")
					.split("\n")
					.filter((line) => !line.trim().startsWith("@"))
					.join("\n")
					.trim(),
		},
		options: {
			// Sidebar order: the kit, the rules, every component by group, then whole screens.
			storySort: {
				order: [
					"Overview",
					"Foundations",
					"Components",
					[
						"Core",
						"Forms",
						"Display",
						"Data",
						"Navigation",
						"Feedback",
						"Overlays",
						"Layout",
						"App",
						"Charts",
						"Chat",
						"Agent & trust",
					],
					"Patterns",
					"Integration",
				],
			},
		},
	},
};

export default preview;
