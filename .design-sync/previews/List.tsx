import { Avatar, Badge, Icon, List, Text } from "@optimusfoundry/quiet";

const box = { width: 340 } as const;

export const Default = () => (
	<div style={box}>
		<List
			items={[
				{ primary: "Assistant", secondary: "web-message · Orca", leading: <Avatar name="Assistant" size="sm" />, trailing: <Badge size="sm">Idle</Badge> },
				{ primary: "Support triage", secondary: "jira.issue_created · Headless", leading: <Avatar name="Support Triage" size="sm" />, trailing: <Badge size="sm" variant="warning">Awaiting you</Badge> },
				{ primary: "Weekly digest", secondary: "schedule.daily · Headless", leading: <Avatar name="Weekly Digest" size="sm" />, trailing: <Badge size="sm" variant="error">Failed</Badge> },
			]}
		/>
	</div>
);

export const Interactive = () => (
	<div style={box}>
		<List
			bordered
			items={[
				{ primary: "General", href: "#general", trailing: <Icon name="arrow-right" /> },
				{ primary: "Billing", secondary: "Visa ending 4242", href: "#billing", selected: true, trailing: <Icon name="arrow-right" /> },
				{ primary: "Members", secondary: "Ada Park and 6 others", href: "#members", trailing: <Icon name="arrow-right" /> },
				{ primary: "Delete workspace", secondary: "Owners only", disabled: true, onClick: () => {} },
			]}
		/>
	</div>
);

export const Grouped = () => (
	<div style={box}>
		<List
			bordered
			size="sm"
			groups={[
				{
					label: "Today",
					items: [
						{ primary: "Ada Park approved a refund", trailing: <Text size="xs" color="muted">14:02</Text> },
						{ primary: "Run 9b1e04aa finished", trailing: <Text size="xs" color="muted">09:40</Text> },
					],
				},
				{ label: "Yesterday", items: [{ primary: "Artifact summary.md published", trailing: <Text size="xs" color="muted">16:15</Text> }] },
			]}
		/>
	</div>
);

export const Divided = () => (
	<div style={box}>
		<List
			divided
			size="sm"
			items={[
				{ primary: "summary.md", secondary: "Weekly digest · 2.4 KB", trailing: <Text size="xs" color="muted">$0.010002</Text> },
				{ primary: "refund-draft.eml", secondary: "Support triage · 1.1 KB", trailing: <Text size="xs" color="muted">$0.118300</Text> },
				{ primary: "review-notes.md", secondary: "Code review · 6.8 KB", trailing: <Text size="xs" color="muted">$0.348771</Text> },
			]}
		/>
	</div>
);
