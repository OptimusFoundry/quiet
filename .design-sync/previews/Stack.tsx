import { Badge, Button, Stack, Text, Wordmark, Link } from "@optimusfoundry/quiet";

const box = {
	width: 32,
	height: 32,
	background: "var(--q-bg-subtle)",
	border: "1px solid var(--q-border)",
	borderRadius: "var(--q-radius-sm)",
} as const;

export const Gaps = () => (
	<Stack gap="md">
		{(["xs", "sm", "md", "lg", "xl"] as const).map((g) => (
			<Stack key={g} direction="row" gap={g} align="center">
				<Text mono style={{ width: 32 }}>
					{g}
				</Text>
				{[1, 2, 3, 4].map((i) => (
					<span key={i} style={box} />
				))}
			</Stack>
		))}
	</Stack>
);

export const Column = () => (
	<Stack gap="sm" style={{ maxWidth: 360 }}>
		<Text size="lg" weight="semibold" color="heading">
			Approve send?
		</Text>
		<Text size="sm" color="muted">
			Run #4182 drafted a reply to Ada Park from the web-message trigger.
		</Text>
		<Stack direction="row" gap="sm">
			<Button size="sm">Approve</Button>
			<Button size="sm" variant="ghost">
				Reject
			</Button>
		</Stack>
	</Stack>
);

export const Toolbar = () => (
	<Stack
		direction="row"
		justify="space-between"
		align="center"
		style={{ maxWidth: 560, paddingBottom: "var(--q-space-4)", borderBottom: "1px solid var(--q-border)" }}
	>
		<Wordmark size="nav" />
		<Stack direction="row" gap="lg">
			<Link href="#">Runs</Link>
			<Link href="#">Artifacts</Link>
		</Stack>
		<Button size="sm">New run</Button>
	</Stack>
);

export const Wrap = () => (
	<Stack direction="row" gap="sm" wrap style={{ maxWidth: 320 }}>
		{["web-message", "schedule", "webhook", "Orca", "Headless", "approval", "artifact"].map((t) => (
			<Badge key={t}>{t}</Badge>
		))}
	</Stack>
);
