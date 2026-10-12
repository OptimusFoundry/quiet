import { GridOverlay, PageHero, Grid, Card } from "@optimusfoundry/quiet";

export const Visible = () => (
	<div style={{ minHeight: 480 }}>
		<GridOverlay visible maxWidth={960} hotkey={false} />
		<div style={{ maxWidth: 960, margin: "0 auto", padding: "var(--q-space-6) var(--q-space-page-x)" }}>
			<PageHero
				size="md"
				ruled={false}
				title="Projects"
				description="Twelve projects across Orca and Headless runners."
			/>
			<Grid columns={3} gap="md" style={{ marginTop: "var(--q-space-5)" }}>
				<Card eyebrow="Project" title="Support triage" meta="web-message · Orca" />
				<Card eyebrow="Project" title="Invoice digest" meta="schedule · Headless" />
				<Card eyebrow="Project" title="Release notes" meta="webhook · Orca" />
			</Grid>
		</div>
	</div>
);

export const ColumnsOnly = () => (
	<div style={{ minHeight: 480 }}>
		<GridOverlay visible columns={6} rhythm={false} hotkey={false} maxWidth={960} />
	</div>
);
