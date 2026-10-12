import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Col, Grid, List, PageHeader, Panel, Text } from "../../index";
import { AppFrame } from "./AppFrame";

// App shell — the frame every signed-in screen sits in: AppShell with the Sidebar on a canvas, the
// screen an inset panel with a TopBar pinned inside it, and an optional third pane beside it.

const REGIONS = [
	{
		primary: "Sidebar",
		secondary:
			"On the canvas, no edge. WorkspaceSwitcher, ⌘K search, grouped nav, AccountMenu at the foot. The current page is a raised pill. Collapses to an icon rail from the TopBar.",
		trailing: "nav",
	},
	{
		primary: "Panel",
		secondary:
			"The screen: an inset raised panel that scrolls on its own. Pages fill it; they never bring their own header or navigation.",
		trailing: "main",
	},
	{
		primary: "Top bar",
		secondary:
			"Pinned to the panel's top: sidebar toggle, breadcrumb, global actions. Its rule shows only once the content scrolls.",
		trailing: "header",
	},
	{
		primary: "Page title",
		secondary: "One PageHeader per screen. Blocks below it are Panels with their own headers.",
		trailing: "h1",
	},
	{
		primary: "Third pane",
		secondary:
			"Notifications or a screen's own pane open beside the panel and push it narrower. One at a time.",
		trailing: "aside",
	},
	{
		primary: "Toasts",
		secondary:
			"Bottom right, at most three, gone in 4s (errors 6s). Only for the user's own actions.",
		trailing: "status",
	},
];

function Shell() {
	return (
		<>
			<PageHeader
				title="Your workspace"
				description="Every signed-in screen uses this frame. Pages only fill the panel; they never bring their own header or navigation."
				actions={
					<Button size="sm" variant="secondary" href="?path=/story/patterns-dashboard--default">
						See a dashboard
					</Button>
				}
			/>
			<Grid columns={12} gap="md" rowGap="md">
				<Col span={7}>
					<Panel title="Anatomy">
						<List size="sm" items={REGIONS} />
					</Panel>
				</Col>
				<Col span={5}>
					<Panel title="On a phone">
						<div className="q-sb-app-frame__stack q-sb-app-frame__stack--stack">
							<Text size="sm">
								Under 720px the panel goes flush, the Sidebar becomes a drawer opened from the
								TopBar, and the third pane opens full screen with the same look.
							</Text>
							<Text size="sm" color="muted">
								Two-pane pages (list and detail, chat and its side panel) stack the list above the
								detail, or move the side panel into the third pane.
							</Text>
						</div>
					</Panel>
				</Col>
			</Grid>
		</>
	);
}

const meta: Meta = {
	title: "Patterns/App shell",
	parameters: { layout: "fullscreen", density: "app" },
};
export default meta;
export const Default: StoryObj = {
	render: () => (
		<AppFrame
			active="dashboard"
			crumbs={[{ label: "Workspace", href: "#" }, { label: "Overview" }]}
		>
			<Shell />
		</AppFrame>
	),
};
