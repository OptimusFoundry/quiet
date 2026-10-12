import { Badge, Label, Link, TextField } from "@optimusfoundry/quiet";

const col = { display: "grid", gap: "var(--q-space-stack)", maxWidth: 420 } as const;

export const Default = () => (
	<div style={col}>
		<Label htmlFor="pname" required>
			Project name
		</Label>
	</div>
);

export const Variants = () => (
	<div style={col}>
		<Label required>API key name</Label>
		<Label subText="Shown on invoices." badge={<Badge size="sm" variant="secondary">Optional</Badge>}>
			Billing email
		</Label>
		<Label action={<Link href="#" size="sm" variant="muted">Rotate key</Link>}>Webhook secret</Label>
		<Label disabled>Runner (locked)</Label>
	</div>
);

export const WithControl = () => (
	<div style={{ display: "grid", gap: "var(--q-space-field)", maxWidth: 360 }}>
		<Label htmlFor="trigger" required action={<Link href="#" size="sm" variant="muted">Docs</Link>}>
			Trigger
		</Label>
		<TextField id="trigger" hideLabel label="Trigger" defaultValue="web-message" />
	</div>
);
