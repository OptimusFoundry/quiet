import type { Decorator, Preview } from "@storybook/react-vite";
import "../src/styles/fonts.css";
import { QuietRoot, type QuietRootProps } from "../src/QuietRoot";
import { defaultTheme, type ThemeName, themeNames, themes } from "../src/styles/themes/themes";

// Pattern screens set parameters.density = "app": density has to sit on the themed root, as in an app.
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
	parameters: { layout: "fullscreen" },
};

export default preview;
