import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Avatar } from "../components/core/Avatar";
import { Text } from "../components/core/Text";
import { Wordmark } from "../components/core/Wordmark";
import {
	Sidebar,
	SidebarProvider,
	SidebarTrigger,
	useSidebar,
} from "../components/navigation/Sidebar";
import "./Sidebar.scss";

const GROUPS = [
	{
		label: "Workspace",
		items: [
			{ label: "Overview" },
			{ label: "Projects", badge: 14 },
			{ label: "Builds" },
			{ label: "Docs", href: "#docs" },
		],
	},
	{ label: "Account", items: [{ label: "Team", badge: 7 }, { label: "Billing" }] },
];

function SidebarStatus() {
	const { isMobile, open, collapsed } = useSidebar();
	return (
		<Text size="sm">
			<output data-testid="sidebar-state">
				{`isMobile: ${isMobile} · open: ${open} · collapsed: ${collapsed}`}
			</output>
		</Text>
	);
}

// An app shell: the Sidebar collapses to a rail on desktop and becomes an off-canvas drawer below
// 768px, opened from the trigger in the top bar.
function AppShell() {
	const [page, setPage] = useState("Overview");
	return (
		<SidebarProvider>
			<div className="q-sb-sidebar">
				<Sidebar
					collapsible
					header={<Wordmark size="nav" />}
					aria-label="Primary"
					value={page}
					onChange={setPage}
					groups={GROUPS}
					footer={
						<div className="q-sb-sidebar__user">
							<Avatar name="Ada Lovelace" size="sm" />
							<Text size="sm" color="heading">
								Ada Lovelace
							</Text>
						</div>
					}
				/>
				<div className="q-sb-sidebar__content">
					<header className="q-sb-sidebar__header">
						<SidebarTrigger />
						<Text size="sm" color="heading">
							Anvil
						</Text>
					</header>
					<main className="q-sb-sidebar__main">
						<Text as="h1" size="lg" color="heading">
							<span data-testid="current-page">{page}</span>
						</Text>
						<SidebarStatus />
						<button type="button">Content action</button>
					</main>
				</div>
			</div>
		</SidebarProvider>
	);
}

const meta: Meta = { title: "Navigation/Sidebar", parameters: { layout: "fullscreen" } };
export default meta;
export const MobileDrawer: StoryObj = { render: () => <AppShell /> };
