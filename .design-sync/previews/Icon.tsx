import { Icon } from "@optimusfoundry/quiet";

const names = [
	"arrow-right", "arrow-left", "arrow-up", "arrow-down", "expand", "external", "close", "check",
	"plus", "minus", "dot", "more", "slash", "command", "enter", "info", "warning", "help",
	"first", "last", "sort", "prev", "next",
];

export const Glyphs = () => (
	<div style={{ display: "flex", flexWrap: "wrap", gap: "var(--q-space-inline)", maxWidth: 480 }}>
		{names.map((n) => (
			<span
				key={n}
				title={n}
				style={{ width: 32, height: 32, display: "grid", placeItems: "center", border: "1px solid var(--q-border)", borderRadius: "var(--q-radius-sm)" }}
			>
				<Icon name={n} />
			</span>
		))}
	</div>
);

export const Sizes = () => (
	<div style={{ display: "flex", gap: "var(--q-space-inline)", alignItems: "center" }}>
		<Icon name="arrow-right" size="xs" />
		<Icon name="arrow-right" size="sm" />
		<Icon name="arrow-right" size="md" />
		<Icon name="arrow-right" size="lg" />
		<Icon name="arrow-right" size="xl" />
		<Icon name="arrow-right" size="2xl" />
	</div>
);

export const Colors = () => (
	<div style={{ display: "flex", gap: "var(--q-space-inline)", alignItems: "center" }}>
		<Icon name="check" size="xl" color="default" />
		<Icon name="check" size="xl" color="muted" />
		<Icon name="check" size="xl" color="quiet" />
		<Icon name="check" size="xl" color="primary" />
		<Icon name="check" size="xl" color="success" />
		<Icon name="warning" size="xl" color="warning" />
		<Icon name="close" size="xl" color="error" />
	</div>
);

export const Labelled = () => (
	<span style={{ display: "inline-flex", gap: "var(--q-space-inline)", alignItems: "center" }}>
		<Icon name="check" color="success" label="Completed" /> Run completed
	</span>
);
