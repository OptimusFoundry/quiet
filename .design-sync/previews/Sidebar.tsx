import type React from "react";
import { Avatar, Badge, Sidebar, Text, Wordmark } from "@optimusfoundry/quiet";

const GROUPS = [
	{
		label: "Workspace",
		items: [
			{ label: "Runs", value: "runs", icon: "·", badge: 3, badgeLabel: "3 working" },
			{ label: "Artifacts", value: "artifacts", icon: "/" },
			{ label: "Triggers", value: "triggers", icon: "✳" },
			{ label: "Approvals", value: "approvals", icon: "!", badge: 2, badgeLabel: "2 awaiting you" },
		],
	},
	{
		label: "Account",
		items: [
			{ label: "Settings", value: "settings", icon: "…" },
			{ label: "Billing", value: "billing", icon: "$" },
		],
	},
];

// The Sidebar fills its parent's height; give it an app-height frame.
const Frame = ({ children }: { children: React.ReactNode }) => (
	<div style={{ display: "flex", height: 460, width: 260 }}>{children}</div>
);

const Person = () => (
	<div style={{ display: "flex", alignItems: "center", gap: "var(--q-space-inline)" }}>
		<Avatar name="Ada Park" size="sm" />
		<div style={{ display: "grid" }}>
			<Text size="sm" color="heading" weight="medium">
				Ada Park
			</Text>
			<Text size="xs" color="muted">
				Owner · Assistant
			</Text>
		</div>
	</div>
);

export const Workspace = () => (
	<Frame>
		<Sidebar label="Main" header={<Wordmark size="nav" />} groups={GROUPS} defaultValue="runs" footer={<Person />} />
	</Frame>
);

export const CollapsedRail = () => (
	<div style={{ display: "flex", height: 460 }}>
		<Sidebar label="Main" collapsible defaultCollapsed groups={GROUPS} defaultValue="artifacts" />
	</div>
);

export const SettingsNav = () => (
	<div style={{ display: "flex", height: 300, width: 220 }}>
		<Sidebar
			compact
			width={200}
			label="Settings sections"
			defaultValue="runners"
			items={[
				{ label: "Profile", value: "profile" },
				{ label: "Runners", value: "runners" },
				{ label: "Webhooks", value: "webhooks" },
				{ label: "Agent permissions", value: "permissions" },
				{ label: "Audit log", value: "audit", disabled: true },
				{ label: "Danger zone", value: "danger" },
			]}
		/>
	</div>
);

export const CollapsibleGroups = () => (
	<Frame>
		<Sidebar
			label="Projects"
			dividers
			header={<Badge size="sm">3 projects</Badge>}
			defaultValue="assistant-runs"
			groups={[
				{
					label: "Assistant",
					collapsible: true,
					items: [
						{ label: "Runs", value: "assistant-runs", badge: 14 },
						{ label: "Artifacts", value: "assistant-artifacts", badge: 37 },
					],
				},
				{
					label: "Support triage",
					collapsible: true,
					items: [
						{ label: "Runs", value: "support-runs" },
						{ label: "Triggers", value: "support-triggers" },
					],
				},
				{ label: "Weekly digest", collapsible: true, defaultOpen: false, items: [{ label: "Runs", value: "digest-runs" }] },
			]}
		/>
	</Frame>
);
