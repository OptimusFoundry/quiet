import { Skeleton, Text } from "@optimusfoundry/quiet";

export const Card = () => (
	<div
		style={{
			display: "flex",
			flexDirection: "column",
			gap: "var(--q-space-stack)",
			maxWidth: 360,
			padding: "var(--q-space-5)",
			border: "1px solid var(--q-border)",
			borderRadius: "var(--q-radius-lg)",
		}}
	>
		<Skeleton width={80} height={10} />
		<Skeleton height={24} width="70%" />
		<Skeleton lines={3} />
	</div>
);

export const Shapes = () => (
	<div style={{ display: "flex", gap: "var(--q-space-stack)", alignItems: "center" }}>
		<Skeleton variant="circular" width={48} />
		<Skeleton variant="rounded" width={120} />
		<Skeleton variant="rectangular" width={200} height={80} />
	</div>
);

export const ListRows = () => (
	<div style={{ display: "grid", gap: "var(--q-space-stack)", maxWidth: 420 }} >
		{[0, 1, 2].map((i) => (
			<div key={i} style={{ display: "flex", gap: "var(--q-space-3)", alignItems: "center" }}>
				<Skeleton variant="circular" width={32} />
				<div style={{ flex: 1, display: "grid", gap: "var(--q-space-2)" }}>
					<Skeleton width="55%" />
					<Skeleton width="30%" height={10} />
				</div>
			</div>
		))}
	</div>
);

export const Loaded = () => (
	<div style={{ display: "grid", gap: "var(--q-space-stack)", maxWidth: 360 }}>
		<Skeleton lines={2} label="Loading run summary" />
		<Skeleton loading={false} lines={2}>
			<Text size="sm">Run #4182 finished on Orca in 42s and cost $0.902049.</Text>
		</Skeleton>
	</div>
);
