import { Card, Grid, StatCard, Text } from "@optimusfoundry/quiet";

const tile = {
	height: 48,
	background: "var(--q-bg-subtle)",
	border: "1px solid var(--q-border)",
	borderRadius: "var(--q-radius-sm)",
	display: "grid",
	placeItems: "center",
} as const;

export const Columns = () => (
	<Grid columns={4} gap="sm" style={{ width: 400 }}>
		{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
			<div key={i} style={tile}>
				<Text mono size="sm">{String(i).padStart(2, "0")}</Text>
			</div>
		))}
	</Grid>
);

export const Gaps = () => (
	<div style={{ display: "grid", gap: "var(--q-space-4)", width: 400 }}>
		{(["xs", "md", "xl"] as const).map((g) => (
			<div key={g} style={{ display: "grid", gap: "var(--q-space-1)" }}>
				<Text mono size="sm" color="muted">gap="{g}"</Text>
				<Grid columns={3} gap={g}>
					{[1, 2, 3].map((i) => (
						<div key={i} style={tile} />
					))}
				</Grid>
			</div>
		))}
	</div>
);

export const AutoFit = () => (
	<Grid minChildWidth={200} gap="md" style={{ width: 760 }}>
		{[
			["Support triage", "web-message · Orca"],
			["Invoice digest", "schedule · Headless"],
			["Release notes", "webhook · Orca"],
			["Lead enrich", "web-message · Headless"],
		].map(([t, m]) => (
			<Card key={t} eyebrow="Project" title={t} meta={m} />
		))}
	</Grid>
);

export const StatRow = () => (
	<Grid columns={3} gap="md" style={{ width: 760 }}>
		<StatCard label="Runs today" value={1284} delta={12} period="vs yesterday" />
		<StatCard label="Spend" value="$41.902049" delta={-3} period="vs yesterday" />
		<StatCard label="Awaiting approval" value={7} variant="outlined" />
	</Grid>
);

export const Template = () => (
	<Grid columns="240px 1fr" gap="md" style={{ width: 760 }}>
		<div style={{ ...tile, height: 120 }}>
			<Text mono size="sm">240px · filters</Text>
		</div>
		<div style={{ ...tile, height: 120 }}>
			<Text mono size="sm">1fr · run list</Text>
		</div>
	</Grid>
);
