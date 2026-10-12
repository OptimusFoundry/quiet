import { HonestButton } from "@optimusfoundry/quiet";

const rowStyle = {
	display: "flex",
	flexWrap: "wrap",
	alignItems: "center",
	gap: "var(--q-space-inline)",
} as const;

export const ExpectedWait = () => (
	<div style={rowStyle}>
		<HonestButton expected={0.3}>Save</HonestButton>
		<HonestButton expected={4}>Verify domain</HonestButton>
		<HonestButton expected={42}>Render 3 clips</HonestButton>
	</div>
);

export const InARunHeader = () => (
	<div
		style={{
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			gap: "var(--q-space-inline)",
			width: 420,
		}}
	>
		<div style={{ display: "grid" }}>
			<strong>Orca · pricing-watch</strong>
			<span style={{ fontSize: "var(--q-text-sm)", color: "var(--q-fg-muted)" }}>
				Last run $0.902049 · median 18s
			</span>
		</div>
		<HonestButton expected={18} onPress={() => new Promise((r) => setTimeout(r, 18000))}>
			Run now
		</HonestButton>
	</div>
);

export const Sizes = () => (
	<div style={rowStyle}>
		<HonestButton size="sm" expected={4}>
			Start run
		</HonestButton>
		<HonestButton size="md" expected={4}>
			Start run
		</HonestButton>
		<HonestButton size="lg" expected={4}>
			Start run
		</HonestButton>
	</div>
);

export const Disabled = () => (
	<div style={rowStyle}>
		<HonestButton disabled expected={12}>
			Export artifacts
		</HonestButton>
	</div>
);
