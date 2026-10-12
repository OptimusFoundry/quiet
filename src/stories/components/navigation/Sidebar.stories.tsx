import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useState } from "react";
import { Avatar } from "../../../components/core/Avatar";
import { Icon } from "../../../components/core/Icon";
import { Text } from "../../../components/core/Text";
import {
	Sidebar,
	SidebarProvider,
	SidebarTrigger,
	useSidebar,
} from "../../../components/navigation/Sidebar";
import "./Sidebar.scss";

const WORKSPACE = {
	label: "Workspace",
	items: [
		{ label: "Overview", icon: <Icon name="home" /> },
		{ label: "Runs", icon: <Icon name="runs" />, badge: 12, badgeLabel: "12 running" },
		{ label: "Runners", icon: <Icon name="list" /> },
		{ label: "Artifacts", icon: <Icon name="file" /> },
		{ label: "Approvals", icon: <Icon name="approvals" />, badge: 3, badgeLabel: "3 waiting" },
	],
};

const GROUPS = [
	WORKSPACE,
	{
		label: "Account",
		items: [
			{ label: "Team", icon: <Icon name="users" /> },
			{ label: "Billing", icon: <Icon name="billing" /> },
			{ label: "Settings", icon: <Icon name="settings" /> },
		],
	},
];

const brand = <span className="q-sb-sidebar__brand">Agentworks</span>;

const user = (
	<div className="q-sb-sidebar__user">
		<Avatar name="Ada Lovelace" size="sm" />
		<Text size="sm" color="heading">
			Ada Lovelace
		</Text>
	</div>
);

/** The Sidebar on the left of a framed main area. */
function Shell({ children }: { children: ReactNode }) {
	return (
		<div className="q-sb-sidebar">
			{children}
			<div className="q-sb-sidebar__main" />
		</div>
	);
}

const meta = {
	title: "Components/Navigation/Sidebar",
	component: Sidebar,
	subcomponents: { SidebarProvider, SidebarTrigger },
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
	args: { groups: GROUPS, defaultValue: "Runs", header: brand, collapsible: true },
	argTypes: {
		items: { control: false },
		groups: { control: false },
		header: { control: false },
		footer: { control: false },
		onChange: { control: false },
		onCollapsedChange: { control: false },
	},
	render: (args) => (
		<Shell>
			<Sidebar {...args} />
		</Shell>
	),
} satisfies Meta<typeof Sidebar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const CollapsedRail: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"The 64px rail: icons only, labels as tooltips and spoken names. Items without an icon show their initials. `collapsedKey` remembers the choice in localStorage.",
			},
		},
	},
	args: { defaultCollapsed: true },
};

export const HeaderAndFooter: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"A node in `header` or `footer` hides in the rail; a function stays and is told whether the rail is collapsed, to draw its own small form.",
			},
		},
	},
	args: {
		header: (collapsed: boolean) => (collapsed ? <Avatar name="Agentworks" size="sm" /> : brand),
		footer: (collapsed: boolean) => (collapsed ? <Avatar name="Ada Lovelace" size="sm" /> : user),
	},
};

export const CollapsibleGroups: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`collapsible` turns a group label into a disclosure button; `defaultOpen: false` starts it shut. A disabled item stays visible but can't be picked.",
			},
		},
	},
	args: {
		groups: [
			WORKSPACE,
			{
				label: "Pinned runners",
				collapsible: true,
				items: [{ label: "Nightly export" }, { label: "Invoice reconciler" }],
			},
			{
				label: "Archived",
				collapsible: true,
				defaultOpen: false,
				items: [{ label: "Legacy sync", disabled: true }, { label: "Q3 backfill" }],
			},
		],
	},
};

export const CompactWithDividers: Story = {
	args: { compact: true, dividers: true, header: undefined, collapsible: false },
};

function StatusLine() {
	const { isMobile, open, collapsed } = useSidebar();
	return (
		<Text size="sm" color="muted">
			<output>{`isMobile: ${isMobile} · open: ${open} · collapsed: ${collapsed}`}</output>
		</Text>
	);
}

function AppShellDemo({ breakpoint }: { breakpoint?: number }) {
	const [page, setPage] = useState("Runs");
	return (
		<SidebarProvider breakpoint={breakpoint}>
			<div className="q-sb-sidebar">
				<Sidebar
					collapsible
					header={brand}
					aria-label="Primary"
					value={page}
					onChange={setPage}
					groups={GROUPS}
					footer={user}
				/>
				<div className="q-sb-sidebar__content">
					<header className="q-sb-sidebar__header">
						<SidebarTrigger />
						<Text size="sm" color="heading">
							Meerkat
						</Text>
					</header>
					<main className="q-sb-sidebar__main">
						<Text as="h1" size="lg" color="heading">
							{page}
						</Text>
						<StatusLine />
					</main>
				</div>
			</div>
		</SidebarProvider>
	);
}

export const WithProvider: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"In a `SidebarProvider` the Sidebar becomes an off-canvas drawer below the breakpoint (768px of viewport by default), opened by a `SidebarTrigger` placed anywhere, here a top bar. `useSidebar()` reads the state. Controlled with `value` + `onChange`. Narrow the window to see the drawer.",
			},
		},
	},
	render: () => <AppShellDemo />,
};

export const DrawerMode: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"The same shell with `breakpoint` set above any window, so it is always in drawer mode: open it from the menu button. Escape, the scrim or picking an item closes it.",
			},
		},
	},
	render: () => <AppShellDemo breakpoint={100000} />,
};
