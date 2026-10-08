import type { Decorator, Preview } from "@storybook/react-vite";
import { QuietRoot } from "../src/QuietRoot";

const withQuiet: Decorator = (Story, ctx) => (
	<QuietRoot mode={ctx.globals.mode === "dark" ? "dark" : "light"} className="sb-quiet-root">
		<Story />
	</QuietRoot>
);

const preview: Preview = {
	decorators: [withQuiet],
	globalTypes: {
		mode: {
			description: "Colour mode",
			toolbar: { icon: "mirror", items: ["light", "dark"], dynamicTitle: true },
		},
	},
	initialGlobals: { mode: "light" },
	parameters: { layout: "fullscreen", controls: { expanded: true } },
};

export default preview;
