import type React from "react";
import { Avatar, Sidebar, SidebarProvider, SidebarTrigger, Text, Wordmark } from "@optimusfoundry/quiet";

const GROUPS = [
	{
		label: "Workspace",
		items: [
			{ label: "Runs", value: "runs", icon: "·", badge: 3 },
			{ label: "Artifacts", value: "artifacts", icon: "/" },
			{ label: "Triggers", value: "triggers", icon: "✳" },
		],
	},
	{ label: "Account", items: [{ label: "Settings", value: "settings", icon: "…" }] },
];

// One shell: SidebarProvider shares the drawer state between the Sidebar and a SidebarTrigger in the top bar.
// Above `breakpoint` the Sidebar is a column (the trigger renders nothing); below it, a drawer the trigger opens.
const Shell = ({ breakpoint, defaultOpen }: { breakpoint?: number; defaultOpen?: boolean }) => (
	<SidebarProvider breakpoint={breakpoint} defaultOpen={defaultOpen}>
		<div
			style={{
				display: "flex",
				height: 480,
				width: 720,
				border: "var(--q-hairline) solid var(--q-border)",
				borderRadius: "var(--q-radius-md)",
				overflow: "hidden",
			}}
		>
			<Sidebar label="Main" collapsible header={<Wordmark size="nav" />} groups={GROUPS} defaultValue="runs" />
			<div style={{ flex: 1, minWidth: 0 }}>
				<header
					style={{
						display: "flex",
						alignItems: "center",
						gap: "var(--q-space-inline)",
						padding: "var(--q-space-inline) var(--q-space-stack)",
						borderBottom: "var(--q-hairline) solid var(--q-border)",
					}}
				>
					<SidebarTrigger />
					<Text size="sm" weight="semibold" color="heading">
						Runs
					</Text>
					<span style={{ marginLeft: "auto" }}>
						<Avatar name="Ada Park" size="xs" />
					</span>
				</header>
				<main style={{ display: "grid", gap: "var(--q-space-inline)", padding: "var(--q-space-stack)" }}>
					<Text color="heading" weight="medium">
						web-message · Run 233f76c2
					</Text>
					<Text size="sm" color="muted">
						Orca · Idle · $0.902049 · 6 hours ago
					</Text>
				</main>
			</div>
		</div>
	</SidebarProvider>
);

// The card is narrower than the default 720 breakpoint, so pin a small one to show the desktop column.
export const Desktop = () => <Shell breakpoint={320} />;

export const MobileClosed = () => <Shell breakpoint={100000} />;

export const MobileDrawerOpen = () => (
	<div style={{ minHeight: 480 }}>
		<Shell breakpoint={100000} defaultOpen />
	</div>
);
