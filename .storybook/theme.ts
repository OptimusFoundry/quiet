import { create } from "storybook/theming";

// Storybook's own chrome (sidebar, toolbar, Docs pages) in quiet's type and ink, with the lava
// accent for the selection. Storybook can't read --q-* tokens, so these mirror foundry's palette (gray-50/100/500/700, accent-fg) by hand.
const base = {
	brandTitle: "quiet",
	brandUrl: "./?path=/story/overview--ui-kit",
	fontBase: '"Geist", system-ui, sans-serif',
	fontCode: '"Geist Mono", ui-monospace, monospace',
	colorPrimary: "#c2461a",
	colorSecondary: "#c2461a",
	appBorderRadius: 10,
	inputBorderRadius: 999,
};

export const docsTheme = create({
	...base,
	base: "light",
	appBg: "#f6f6f7",
	appContentBg: "#ffffff",
	appPreviewBg: "#ffffff",
	appBorderColor: "#eaeaed",
	textColor: "#3b3b42",
	textMutedColor: "#6e6e75",
	barBg: "#ffffff",
	barTextColor: "#6e6e75",
	barSelectedColor: "#c2461a",
});

export const managerTheme = docsTheme;

// Docs pages follow the toolbar theme: foundry-dark's paper, ink and lifted molten.
export const docsDarkTheme = create({
	...base,
	base: "dark",
	colorPrimary: "#ff7a3d",
	colorSecondary: "#ff7a3d",
	appBg: "#16171a",
	appContentBg: "#0e0f11",
	appPreviewBg: "#0e0f11",
	appBorderColor: "#26272b",
	textColor: "#f4f4f5",
	textMutedColor: "#9a9aa0",
	barBg: "#0e0f11",
	barTextColor: "#9a9aa0",
	barSelectedColor: "#ff7a3d",
});
