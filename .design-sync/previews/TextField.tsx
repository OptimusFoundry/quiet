import { Icon, TextField } from "@optimusfoundry/quiet";

const col = { display: "grid", gap: "var(--q-space-stack)", maxWidth: 360 } as const;

export const Default = () => (
	<div style={col}>
		<TextField
			label="Email"
			type="email"
			defaultValue="ada@sjocamp.co"
			helperText="Run reports and invoices go here."
			required
		/>
	</div>
);

export const Sizes = () => (
	<div style={col}>
		<TextField size="sm" label="Small" defaultValue="Assistant" />
		<TextField size="md" label="Medium" defaultValue="Assistant" />
		<TextField size="lg" label="Large" defaultValue="Assistant" />
	</div>
);

export const Variants = () => (
	<div style={col}>
		<TextField label="Default" placeholder="Search by trigger or run ID" leftIcon={<Icon name="slash" />} />
		<TextField
			variant="filled"
			label="Filled"
			placeholder="Search by trigger or run ID"
			leftIcon={<Icon name="slash" />}
		/>
	</div>
);

export const States = () => (
	<div style={col}>
		<TextField label="Webhook URL" defaultValue="hooks.agentworks.dev/assistant" error="Use an https:// URL." />
		<TextField label="Runner" defaultValue="Orca" disabled helperText="Set by the workspace owner." />
	</div>
);

export const SearchHiddenLabel = () => (
	<div style={col}>
		<TextField
			size="sm"
			label="Search runs"
			hideLabel
			placeholder="Search by trigger or run ID"
			leftIcon={<Icon name="slash" />}
		/>
	</div>
);
