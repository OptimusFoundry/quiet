// The component groups, in sidebar order. `folder` is src/components/<folder>; `label` is the
// sidebar title (`Components/<label>/<Name>`).
export interface Group {
	folder: string;
	label: string;
	blurb: string;
}

export const GROUPS: Group[] = [
	{
		folder: "core",
		label: "Core",
		blurb: "Buttons, text, badges, tags and the marks everything else is built from.",
	},
	{
		folder: "forms",
		label: "Forms",
		blurb: "Fields and pickers that work with a native form and react-hook-form.",
	},
	{ folder: "display", label: "Display", blurb: "Cards and disclosure for grouping content." },
	{ folder: "data", label: "Data", blurb: "Tables, grids, lists, stats and the empty state." },
	{
		folder: "navigation",
		label: "Navigation",
		blurb: "Sidebar, tabs, breadcrumbs, pagination and the command palette.",
	},
	{
		folder: "feedback",
		label: "Feedback",
		blurb: "Alerts, banners, dialogs, toasts, progress and tooltips.",
	},
	{
		folder: "overlays",
		label: "Overlays",
		blurb: "Popovers, menus and drawers that float over a screen.",
	},
	{
		folder: "layout",
		label: "Layout",
		blurb: "Container-responsive grid and stack, aspect ratio and page transitions.",
	},
	{
		folder: "app",
		label: "App",
		blurb: "The SaaS frame and its parts: shell, top bar, page header, panels.",
	},
	{
		folder: "charts",
		label: "Charts",
		blurb: "Hand-rolled SVG charts with the accent as the primary series.",
	},
	{
		folder: "chat",
		label: "Chat",
		blurb: "AI chat UI: thread, messages, composer, tool calls and code.",
	},
	{
		folder: "future",
		label: "Agent & trust",
		blurb:
			"Components for agents at work and the trust around them: approvals, budgets, runs, doubt.",
	},
];

/** Storybook's id for a title part (lower-case, non-alphanumerics to single dashes). */
export function sanitize(part: string): string {
	return part
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

/** The Docs page of `Components/<group label>/<name>`, relative to the Storybook iframe. */
export function docsHref(group: Group, name: string): string {
	return `./?path=/docs/components-${sanitize(group.label)}-${sanitize(name)}--docs`;
}
