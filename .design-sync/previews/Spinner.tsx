import { Spinner } from "@optimusfoundry/quiet";

export const Labelled = () => (
	<div style={{ display: "flex", gap: "var(--q-space-6)", alignItems: "center" }}>
		<Spinner size="sm" label="Running on Orca" />
		<Spinner size="sm" tone="muted" label="Queued" />
	</div>
);

export const Sizes = () => (
	<div style={{ display: "flex", gap: "var(--q-space-5)", alignItems: "center" }}>
		<Spinner size="xs" />
		<Spinner size="sm" />
		<Spinner size="md" />
		<Spinner size="lg" />
		<Spinner size="xl" />
	</div>
);

export const Tones = () => (
	<div style={{ display: "flex", gap: "var(--q-space-5)", alignItems: "center" }}>
		<Spinner tone="default" />
		<Spinner tone="molten" />
		<Spinner tone="muted" />
		<span
			style={{
				background: "var(--q-fg)",
				padding: "var(--q-space-4)",
				borderRadius: "var(--q-radius-md)",
				display: "inline-flex",
			}}
		>
			<Spinner tone="paper" />
		</span>
	</div>
);
