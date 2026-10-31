import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { AppIcon } from "../../../components/app/AppIcon";
import { AppShell } from "../../../components/app/AppShell";
import { NoticeChip } from "../../../components/app/NoticeChip";
import { PageHeader } from "../../../components/app/PageHeader";
import { ShellNotice } from "../../../components/app/ShellNotice";
import { TopBar } from "../../../components/app/TopBar";
import { Button } from "../../../components/core/Button";
import { Link } from "../../../components/core/Link";
import { Text } from "../../../components/core/Text";
import { DemoPage, DemoSidebar, Notifications } from "./AppStory";

// The frame on its own, with stand-in content. Whole screens in it are Patterns/* (AppFrame.tsx).

const CRUMBS = [{ label: "Runs", href: "#runs" }, { label: "Run 233f76c2" }];

const meta = {
	title: "Components/App/AppShell",
	component: AppShell,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
		// The shell fills the viewport, so each story gets its own frame on the Docs page.
		docs: { story: { inline: false, iframeHeight: 560 } },
	},
	args: {
		sidebar: <DemoSidebar />,
		topBar: <TopBar crumbs={CRUMBS} />,
		children: (
			<DemoPage>
				<PageHeader
					title="Run 233f76c2"
					description="Started from a web-message trigger on the Orca runner."
				/>
			</DemoPage>
		),
		aside: <Notifications />,
		asideTitle: "Notifications",
		asideOpen: false,
	},
	argTypes: {
		sidebar: { control: false },
		topBar: { control: false },
		notice: { control: false },
		children: { control: false },
		aside: { control: false },
		onAsideClose: { control: false },
	},
} satisfies Meta<typeof AppShell>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

function PaneDemo() {
	const [open, setOpen] = useState(true);
	return (
		<AppShell
			sidebar={<DemoSidebar />}
			topBar={
				<TopBar
					crumbs={CRUMBS}
					actions={
						<Button
							size="sm"
							variant={open ? "secondary" : "ghost"}
							icon={<AppIcon name="bell" />}
							aria-label="Notifications, 2 unread"
							aria-expanded={open}
							aria-controls="app-aside"
							onClick={() => setOpen((o) => !o)}
						/>
					}
				/>
			}
			aside={<Notifications />}
			asideTitle="Notifications"
			asideOpen={open}
			onAsideClose={() => setOpen(false)}
		>
			<DemoPage>
				<PageHeader title="Run 233f76c2" />
			</DemoPage>
		</AppShell>
	);
}

export const ThirdPane: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"The pane opens beside the screen and narrows it. Its opener passes `aria-expanded` and `aria-controls`; Escape or the close button closes it and focus returns to the opener.",
			},
		},
	},
	render: () => <PaneDemo />,
};

function TwoPanesDemo() {
	const [doc, setDoc] = useState(true);
	const [list, setList] = useState(true);
	return (
		<AppShell
			sidebar={<DemoSidebar />}
			topBar={
				<TopBar
					crumbs={CRUMBS}
					actions={
						<>
							<Button
								size="sm"
								variant={doc ? "secondary" : "ghost"}
								icon={<AppIcon name="file" />}
								aria-label="Report"
								aria-expanded={doc}
								aria-controls="app-doc"
								onClick={() => setDoc((o) => !o)}
							/>
							<Button
								size="sm"
								variant={list ? "secondary" : "ghost"}
								icon={<AppIcon name="bell" />}
								aria-label="Notifications, 2 unread"
								aria-expanded={list}
								aria-controls="app-aside"
								onClick={() => setList((o) => !o)}
							/>
						</>
					}
				/>
			}
			panes={[
				{
					id: "app-doc",
					title: "Report",
					width: "wide",
					railSidebar: true,
					open: doc,
					onClose: () => setDoc(false),
					head: (
						<>
							<Text as="span" weight="semibold" color="heading">
								Run report
							</Text>
							<Text as="span" size="sm" color="muted">
								v3
							</Text>
						</>
					),
					children: (
						<Text as="p">
							The run finished in 4 minutes. Two steps retried once; nothing needs a look.
						</Text>
					),
				},
				{
					id: "app-aside",
					title: "Notifications",
					open: list,
					onClose: () => setList(false),
					children: <Notifications />,
				},
			]}
		>
			<DemoPage>
				<PageHeader title="Run 233f76c2" />
			</DemoPage>
		</AppShell>
	);
}

export const TwoPanes: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`panes` opens more than one pane, left to right. The wide pane takes 2/3 of the room beside the Sidebar, gives width back (down to 600) when the second pane opens, carries its own `head` and holds the Sidebar at its rail while open. Escape closes the newest pane first. Below the width where both fit beside a 400 screen, opening one closes the older.",
			},
		},
	},
	render: () => <TwoPanesDemo />,
};

export const WithNotices: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Placed by urgency: a `ShellNotice` on the canvas above the panel, a `SidebarNotice` nudge above the account, a `NoticeChip` for this page in the TopBar.",
			},
		},
	},
	render: () => (
		<AppShell
			sidebar={
				<DemoSidebar
					nudge={{
						title: "Trial: 3 days left",
						progress: 0.78,
						progressLabel: "Trial used",
						action: { label: "Choose a plan", href: "#billing" },
					}}
				/>
			}
			notice={
				<ShellNotice action={<Link href="#billing">Update billing</Link>}>
					Your card was declined, so scheduled runs pause on Oct 15.
				</ShellNotice>
			}
			topBar={
				<TopBar
					crumbs={CRUMBS}
					actions={<NoticeChip aria-expanded={false}>Run paused</NoticeChip>}
				/>
			}
		>
			<DemoPage>
				<PageHeader title="Run 233f76c2" />
			</DemoPage>
		</AppShell>
	),
};

export const CollapsedRail: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"The TopBar's toggle collapses the Sidebar to its icon rail; the switcher and account menu keep their marks.",
			},
		},
	},
	render: () => (
		<AppShell sidebar={<DemoSidebar defaultCollapsed />} topBar={<TopBar crumbs={CRUMBS} />}>
			<DemoPage>
				<PageHeader title="Run 233f76c2" />
			</DemoPage>
		</AppShell>
	),
};

export const PhoneLayout: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Below `breakpoint` (720 by default) the panel goes flush, the Sidebar becomes a drawer opened from the TopBar and the pane covers the screen. Here `breakpoint` is set high to show it at any width.",
			},
		},
	},
	args: { breakpoint: 4000 },
};
