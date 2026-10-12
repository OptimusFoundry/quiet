import { Banner, Button } from "@optimusfoundry/quiet";

const col = { display: "grid", gap: "var(--q-space-stack)", width: 640 } as const;

export const Default = () => (
	<div style={col}>
		<Banner title="Scheduled maintenance.">Sunday 02:00–03:00 UTC. Runs queue and resume after.</Banner>
	</div>
);

export const Variants = () => (
	<div style={col}>
		<Banner variant="paper" title="Headless runner is in preview.">Expect slower cold starts this week.</Banner>
		<Banner variant="outline" status="success" title="Webhooks are back.">Deliveries recovered at 14:02.</Banner>
		<Banner variant="ink" status="warning" title="Trial ends in 3 days." />
	</div>
);

export const Statuses = () => (
	<div style={col}>
		<Banner variant="outline" status="info" title="New: approvals in Slack." />
		<Banner variant="outline" status="success" title="Billing updated." />
		<Banner variant="outline" status="warning" title="Budget 82% spent." />
		<Banner variant="outline" status="error" title="Orca is degraded." />
	</div>
);

export const WithAction = () => (
	<div style={col}>
		<Banner
			variant="outline"
			status="warning"
			title="Your card expires in 9 days."
			action={
				<Button size="sm" variant="secondary">
					Update card
				</Button>
			}
		>
			Runs pause when billing fails.
		</Banner>
		<Banner
			variant="paper"
			title="Usage-based pricing starts 1 November."
			dismissible={false}
			action={<Button size="sm">Review plan</Button>}
		/>
	</div>
);
