import { HoldButton } from "@optimusfoundry/quiet";

const rowStyle = {
	display: "flex",
	flexWrap: "wrap",
	alignItems: "center",
	gap: "var(--q-space-inline)",
} as const;

export const DestructiveConfirm = () => (
	<div style={rowStyle}>
		<HoldButton confirmedLabel="Deleted">Delete workspace</HoldButton>
	</div>
);

export const Variants = () => (
	<div style={rowStyle}>
		<HoldButton variant="primary" confirmedLabel="Paused · undo for 24h">
			Pause 3 campaigns
		</HoldButton>
		<HoldButton variant="secondary" confirmedLabel="Approved">
			Approve run
		</HoldButton>
		<HoldButton variant="outline" confirmedLabel="Stopped">
			Stop Orca
		</HoldButton>
		<HoldButton variant="destructive" duration={1400} confirmedLabel="Revoked">
			Revoke all keys
		</HoldButton>
	</div>
);

export const Sizes = () => (
	<div style={rowStyle}>
		<HoldButton size="sm" variant="destructive" confirmedLabel="Revoked">
			Revoke key
		</HoldButton>
		<HoldButton size="md" variant="destructive" confirmedLabel="Revoked">
			Revoke key
		</HoldButton>
		<HoldButton size="lg" variant="destructive" confirmedLabel="Revoked">
			Revoke key
		</HoldButton>
	</div>
);

export const Confirmed = () => (
	<div style={rowStyle}>
		<HoldButton confirmed confirmedLabel="Paused · undo for 24h">
			Pause 3 campaigns
		</HoldButton>
		<HoldButton variant="destructive" disabled>
			Delete project
		</HoldButton>
	</div>
);
