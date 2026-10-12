import type React from "react";
import { Icon, Sidebar, SidebarProvider, SidebarTrigger, Text } from "@optimusfoundry/quiet";

// SidebarTrigger renders only while its SidebarProvider's Sidebar is a drawer (viewport below
// `breakpoint`); the huge breakpoint here forces the phone layout at any card width.
const TopBar = ({ children, title }: { children: React.ReactNode; title: string }) => (
	<SidebarProvider breakpoint={100000}>
		<Sidebar
			label="Main"
			items={[
				{ label: "Runs", value: "runs" },
				{ label: "Artifacts", value: "artifacts" },
			]}
		/>
		<header
			style={{
				display: "flex",
				alignItems: "center",
				gap: "var(--q-space-inline)",
				width: 320,
				padding: "var(--q-space-inline) var(--q-space-stack)",
				borderBottom: "var(--q-hairline) solid var(--q-border)",
			}}
		>
			{children}
			<Text size="sm" weight="semibold" color="heading">
				{title}
			</Text>
		</header>
	</SidebarProvider>
);

export const PhoneTopBar = () => (
	<TopBar title="Run 233f76c2">
		<SidebarTrigger />
	</TopBar>
);

export const CustomLabel = () => (
	<TopBar title="Approvals">
		<SidebarTrigger aria-label="Open project navigation">
			<Icon name="more" />
		</SidebarTrigger>
	</TopBar>
);
