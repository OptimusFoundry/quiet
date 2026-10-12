import { Progress } from "@optimusfoundry/quiet";

const col = { display: "grid", gap: "var(--q-space-stack)", width: 360 } as const;

export const Default = () => (
	<div style={col}>
		<Progress value={64} label="Indexing artifacts" showValue />
	</div>
);

export const Variants = () => (
	<div style={col}>
		<Progress value={100} variant="success" label="Upload transcript.json" showValue />
		<Progress value={82} variant="warning" label="Monthly budget" showValue />
		<Progress value={30} variant="error" label="Failed at step 3 of 10" showValue />
		<Progress value={2} max={4} variant="heat" label="Run stage 2 of 4" />
	</div>
);

export const Sizes = () => (
	<div style={col}>
		<Progress size="sm" value={40} aria-label="Small" />
		<Progress size="md" value={60} aria-label="Medium" />
		<Progress size="lg" value={80} aria-label="Large" />
	</div>
);

export const Indeterminate = () => (
	<div style={col}>
		<Progress indeterminate label="Starting Orca sandbox" />
	</div>
);
