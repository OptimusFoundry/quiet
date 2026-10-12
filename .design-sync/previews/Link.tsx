import { Link, Text } from "@optimusfoundry/quiet";

const row = { display: "flex", gap: "var(--q-space-inline)", alignItems: "center", flexWrap: "wrap" } as const;

export const Variants = () => (
	<div style={row}>
		<Link href="#">Run details</Link>
		<Link href="#" variant="primary">
			Approve now
		</Link>
		<Link href="#" variant="muted">
			View logs
		</Link>
	</div>
);

export const Sizes = () => (
	<div style={row}>
		<Link href="#" size="sm">
			ada@agentworks.dev
		</Link>
		<Link href="#" size="md">
			ada@agentworks.dev
		</Link>
		<Link href="#" size="lg">
			ada@agentworks.dev
		</Link>
	</div>
);

export const Underline = () => (
	<div style={row}>
		<Link href="#" underline="hover">
			Underline on hover
		</Link>
		<Link href="#" underline="always">
			Always underlined
		</Link>
	</div>
);

export const External = () => (
	<Link href="https://docs.anthropic.com" external>
		Runner docs
	</Link>
);

export const Inline = () => (
	<div style={{ maxWidth: 420 }}>
		<Text>
			Run <Link href="#" underline="always">#4821</Link> used the Orca runner and cost $0.902049. See the{" "}
			<Link href="#" variant="muted" underline="always">
				billing breakdown
			</Link>
			.
		</Text>
	</div>
);
