import { AspectRatio, Grid, Text } from "@optimusfoundry/quiet";

export const Presets = () => (
	<Grid columns={5} gap="sm" align="start" style={{ width: 680 }}>
		{(["square", "video", "portrait", "photo", "wide"] as const).map((r) => (
			<AspectRatio key={r} ratio={r} />
		))}
	</Grid>
);

export const Placeholder = () => (
	<div style={{ width: 360 }}>
		<AspectRatio ratio="video" label="Artifact preview · run #4182 report.pdf" />
	</div>
);

export const WithMedia = () => (
	<div style={{ display: "grid", gap: "var(--q-space-2)", width: 280 }}>
		<AspectRatio ratio="photo">
			<div
				style={{
					width: "100%",
					height: "100%",
					background:
						"linear-gradient(135deg, var(--q-accent) 0%, var(--q-bg-subtle) 100%)",
				}}
			/>
		</AspectRatio>
		<Text size="sm" color="muted">
			Cover for “Weekly digest” · uploaded by Ada Park
		</Text>
	</div>
);

export const CustomRatio = () => (
	<div style={{ width: 360 }}>
		<AspectRatio ratio={3} label="Banner · 3 : 1" />
	</div>
);
