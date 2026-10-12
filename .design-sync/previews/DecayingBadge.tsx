import { DecayingBadge } from "@optimusfoundry/quiet";

const HOUR = 3600e3;
const NOW = Date.UTC(2026, 9, 8, 12);
const noop = () => {};
const row = {
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	gap: "var(--q-space-inline)",
	width: 280,
} as const;
const list = { display: "grid", gap: "var(--q-space-stack)" } as const;
const mono = { fontFamily: "var(--q-font-mono)", fontSize: "var(--q-text-sm)" } as const;

export const DomainChecks = () => (
	<div style={list}>
		{[
			["join.sjocamp.co", 2],
			["meerkat.protoapp.xyz", 30],
			["orca.protoapp.xyz", 64],
			["clips.tickuptoks.com", 96],
		].map(([d, h]) => (
			<div key={d} style={row}>
				<span style={mono}>{d}</span>
				<DecayingBadge checkedAt={NOW - (h as number) * HOUR} now={NOW} onRecheck={noop}>
					Verified
				</DecayingBadge>
			</div>
		))}
	</div>
);

export const Ageing = () => (
	<div style={{ display: "flex", flexWrap: "wrap", gap: "var(--q-space-inline)", width: 280 }}>
		<DecayingBadge checkedAt={NOW - HOUR} now={NOW}>
			Verified
		</DecayingBadge>
		<DecayingBadge checkedAt={NOW - 40 * HOUR} now={NOW}>
			Verified
		</DecayingBadge>
		<DecayingBadge checkedAt={NOW - 70 * HOUR} now={NOW}>
			Verified
		</DecayingBadge>
		<DecayingBadge checkedAt={NOW - 96 * HOUR} now={NOW}>
			Verified
		</DecayingBadge>
		<DecayingBadge now={NOW} staleLabel="Never checked">
			Verified
		</DecayingBadge>
	</div>
);

export const Sizes = () => (
	<div style={{ display: "flex", alignItems: "center", gap: "var(--q-space-inline)" }}>
		<DecayingBadge size="sm" checkedAt={NOW - 5 * HOUR} now={NOW}>
			Synced
		</DecayingBadge>
		<DecayingBadge size="md" checkedAt={NOW - 5 * HOUR} now={NOW}>
			Synced
		</DecayingBadge>
		<DecayingBadge size="lg" checkedAt={NOW - 5 * HOUR} now={NOW}>
			Synced
		</DecayingBadge>
	</div>
);

export const Rechecking = () => (
	<div style={list}>
		<div style={row}>
			<span style={mono}>stripe.subs</span>
			<DecayingBadge checkedAt={NOW - 80 * HOUR} now={NOW} onRecheck={noop} staleLabel="Re-checking" checking>
				In sync
			</DecayingBadge>
		</div>
		<div style={row}>
			<span style={mono}>resend.events</span>
			<DecayingBadge
				checkedAt={NOW - 90 * HOUR}
				now={NOW}
				onRecheck={noop}
				staleLabel="Stale"
			>
				In sync
			</DecayingBadge>
		</div>
	</div>
);
