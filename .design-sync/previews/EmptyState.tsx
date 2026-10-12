import { Button, EmptyState, Icon } from "@optimusfoundry/quiet";

const box = { width: 340 } as const;

export const Default = () => (
	<div style={box}>
		<EmptyState
			bordered
			title="No runs yet"
			description="Runs show up here when a trigger like web-message fires."
			actions={
				<>
					<Button size="sm" leftIcon={<Icon name="plus" />}>
						Add a trigger
					</Button>
					<Button size="sm" variant="ghost">
						Read the docs
					</Button>
				</>
			}
		/>
	</div>
);

export const NoResults = () => (
	<div style={box}>
		<EmptyState
			bordered
			size="sm"
			icon={<Icon name="help" />}
			title="Nothing matches"
			description="No artifacts match “invoice” in Support triage."
			actions={
				<Button size="sm" variant="secondary">
					Clear filters
				</Button>
			}
		/>
	</div>
);

export const Sizes = () => (
	<div style={{ display: "grid", gap: "var(--q-space-stack)", width: 340 }}>
		<EmptyState bordered size="sm" title="No approvals waiting" description="You’re all caught up." />
		<EmptyState bordered size="md" title="No approvals waiting" description="You’re all caught up." />
	</div>
);

export const Inline = () => (
	<div style={box}>
		<EmptyState size="sm" icon={null} align="start" eyebrow="Inbox" title="All read" description="New approvals from Ada Park land here." />
	</div>
);
