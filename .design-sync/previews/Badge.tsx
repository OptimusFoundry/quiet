import { Badge, Icon } from "@optimusfoundry/quiet";

const row = { display: "flex", gap: "var(--q-space-inline)", alignItems: "center", flexWrap: "wrap" } as const;

export const Variants = () => (
	<div style={row}>
		<Badge>Idle</Badge>
		<Badge variant="primary">New</Badge>
		<Badge variant="secondary">Closed</Badge>
		<Badge variant="outline">Internal</Badge>
		<Badge variant="success">Completed</Badge>
		<Badge variant="warning">Awaiting you</Badge>
		<Badge variant="error">Failed</Badge>
	</div>
);

export const Sizes = () => (
	<div style={row}>
		<Badge size="sm">web-message</Badge>
		<Badge size="md">web-message</Badge>
		<Badge size="lg">web-message</Badge>
	</div>
);

export const Counts = () => (
	<div style={row}>
		<Badge variant="primary" count={3} />
		<Badge count={42} />
		<Badge variant="outline" count={128} max={99} />
	</div>
);

export const WithIcons = () => (
	<div style={row}>
		<Badge dot>Orca</Badge>
		<Badge leftIcon={<Icon name="arrow-up" />}>Cost 12%</Badge>
		<Badge variant="outline" rightIcon={<Icon name="arrow-right" />}>
			Open run
		</Badge>
	</div>
);
