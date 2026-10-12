import { StatusDot } from "@optimusfoundry/quiet";

export const Statuses = () => (
	<div style={{ display: "flex", gap: "var(--q-space-6)", alignItems: "center" }}>
		<StatusDot status="live" />
		<StatusDot status="prototype" />
		<StatusDot status="archived" />
	</div>
);

export const CustomLabel = () => (
	<div style={{ display: "grid", gap: "var(--q-space-3)" }}>
		<StatusDot status="live" label="Agentworks · Live" />
		<StatusDot status="prototype" label="Headless runner · Prototype" />
		<StatusDot status="archived" label="Legacy triggers · Archived" />
	</div>
);
