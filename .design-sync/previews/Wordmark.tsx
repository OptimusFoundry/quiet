import { Link, Stack, Wordmark } from "@optimusfoundry/quiet";

export const Sizes = () => (
	<div style={{ display: "grid", gap: "var(--q-space-6)", justifyItems: "start" }}>
		<Wordmark size="footer" />
		<Wordmark size="nav" />
		<Wordmark size={20} />
	</div>
);

export const InANavbar = () => (
	<Stack
		direction="row"
		justify="space-between"
		align="center"
		style={{ maxWidth: 520, paddingBottom: "var(--q-space-4)", borderBottom: "1px solid var(--q-border)" }}
	>
		<Wordmark size="nav" />
		<Stack direction="row" gap="lg">
			<Link href="#">Runs</Link>
			<Link href="#">Artifacts</Link>
			<Link href="#">Settings</Link>
		</Stack>
	</Stack>
);
