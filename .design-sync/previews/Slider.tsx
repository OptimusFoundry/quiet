import { Slider } from "@optimusfoundry/quiet";

const col = { display: "grid", gap: "var(--q-space-block)", maxWidth: 360 } as const;

export const Default = () => (
	<div style={{ maxWidth: 360 }}>
		<Slider label="Monthly budget" defaultValue={40} formatValue={(v) => `$${v}`} />
	</div>
);

export const FormattedRange = () => (
	<div style={col}>
		<Slider label="Log retention" min={7} max={90} step={7} defaultValue={28} formatValue={(v) => `${v} days`} />
		<Slider label="Max concurrent runs" min={1} max={16} defaultValue={4} />
	</div>
);

export const Sizes = () => (
	<div style={col}>
		<Slider size="sm" label="Small" defaultValue={20} />
		<Slider size="md" label="Medium" defaultValue={45} />
		<Slider size="lg" label="Large" defaultValue={70} />
	</div>
);

export const Disabled = () => (
	<div style={{ maxWidth: 360 }}>
		<Slider label="Temperature (set by policy)" disabled defaultValue={50} formatValue={(v) => (v / 100).toFixed(2)} />
	</div>
);
