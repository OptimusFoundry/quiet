import { BorderProgress, Card } from "@optimusfoundry/quiet";

const box = { width: 300 } as const;

export const Running = () => (
	<div style={box}>
		<BorderProgress value={40} label="Rendering 3 clips" valueText="40%, about 4 min left">
			<Card eyebrow="Headless" title="Rendering 3 clips" meta="40%">
				1080×1920 · about 4 min left
			</Card>
		</BorderProgress>
	</div>
);

export const Indeterminate = () => (
	<div style={box}>
		<BorderProgress indeterminate aria-label="Syncing contacts">
			<Card eyebrow="Orca" title="Syncing contacts" meta="run_8f2a">
				Length unknown · started 12s ago
			</Card>
		</BorderProgress>
	</div>
);

export const States = () => (
	<div style={{ display: "grid", gap: "var(--q-space-stack)", width: 300 }}>
		<BorderProgress value={0} aria-label="Queued export">
			<Card eyebrow="Queued" title="Export artifacts" meta="0%" />
		</BorderProgress>
		<BorderProgress value={72} aria-label="Indexing transcripts">
			<Card eyebrow="Running" title="Index transcripts" meta="72%" />
		</BorderProgress>
		<BorderProgress value={100} aria-label="Import">
			<Card eyebrow="Done" title="Import signups" meta="100%" />
		</BorderProgress>
	</div>
);
