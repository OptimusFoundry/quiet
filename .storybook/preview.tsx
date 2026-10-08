import type { Decorator, Preview } from "@storybook/react-vite";
import "../src/styles/fonts.css";
import { QuietRoot } from "../src/QuietRoot";
import { defaultTheme, type ThemeName, themeNames, themes } from "../src/styles/themes/themes";

const withQuiet: Decorator = (Story, ctx) => (
	<QuietRoot theme={(ctx.globals.theme as ThemeName) ?? defaultTheme}>
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
				items: themeNames.map((value) => ({ value, title: themes[value].label })),
				dynamicTitle: true,
			},
		},
	},
	initialGlobals: { theme: defaultTheme },
	parameters: { layout: "fullscreen" },
};

export default preview;
