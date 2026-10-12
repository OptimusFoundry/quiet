import { Avatar, Text } from "@optimusfoundry/quiet";

export const Default = () => <Avatar name="Ada Park" />;

export const Sizes = () => (
	<div style={{ display: "flex", gap: "var(--q-space-inline)", alignItems: "center" }}>
		<Avatar name="Ada Park" size="xs" />
		<Avatar name="Ada Park" size="sm" />
		<Avatar name="Ada Park" size="md" />
		<Avatar name="Ada Park" size="lg" />
		<Avatar name="Ada Park" size="xl" />
		<Avatar name="Ada Park" size="2xl" />
	</div>
);

export const Shapes = () => (
	<div style={{ display: "flex", gap: "var(--q-space-inline)", alignItems: "center" }}>
		<Avatar name="Ada Park" shape="circle" size="lg" />
		<Avatar name="Orca Runner" shape="square" size="lg" />
		<Avatar name="Agentworks" shape="square" size="lg" />
	</div>
);

export const Fallbacks = () => (
	<div style={{ display: "flex", gap: "var(--q-space-inline)", alignItems: "center" }}>
		<Avatar name="Grace Chen" />
		<Avatar />
		<Avatar fallback="AW" />
		<Avatar src="data:image/png;base64,xx" name="Malik Osei" />
	</div>
);

export const WithIdentity = () => (
	<div style={{ display: "flex", gap: "var(--q-space-inline)", alignItems: "center" }}>
		<Avatar name="Ada Park" size="sm" />
		<div style={{ display: "grid" }}>
			<Text size="sm" weight="semibold" color="heading">
				Ada Park
			</Text>
			<Text size="sm" color="muted">
				ada@agentworks.dev
			</Text>
		</div>
	</div>
);
