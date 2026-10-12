import { Col, Grid, Text } from "@optimusfoundry/quiet";

const cell = {
	minHeight: 48,
	padding: "var(--q-space-2) var(--q-space-3)",
	background: "var(--q-bg-subtle)",
	border: "1px solid var(--q-border)",
	borderRadius: "var(--q-radius-sm)",
	display: "grid",
	alignContent: "center",
} as const;

export const Spans = () => (
	<Grid columns={12} gap="sm" breakpoints={[320, 480]} style={{ width: 760 }}>
		<Col span={8}>
			<div style={cell}>
				<Text mono size="sm">span 8 · run timeline</Text>
			</div>
		</Col>
		<Col span={4}>
			<div style={cell}>
				<Text mono size="sm">span 4 · cost</Text>
			</div>
		</Col>
		<Col span={6}>
			<div style={cell}>
				<Text mono size="sm">span 6 · artifacts</Text>
			</div>
		</Col>
		<Col span={6}>
			<div style={cell}>
				<Text mono size="sm">span 6 · approvals</Text>
			</div>
		</Col>
		{[1, 2, 3, 4].map((i) => (
			<Col key={i} span={3}>
				<div style={cell}>
					<Text mono size="sm">span 3</Text>
				</div>
			</Col>
		))}
	</Grid>
);

export const StartOffset = () => (
	<Grid columns={12} gap="sm" breakpoints={[320, 480]} style={{ width: 760 }}>
		<Col span={6} start={4}>
			<div style={cell}>
				<Text mono size="sm">span 6 · start 4 — centred form</Text>
			</div>
		</Col>
		<Col span={4} start={9}>
			<div style={cell}>
				<Text mono size="sm">span 4 · start 9</Text>
			</div>
		</Col>
	</Grid>
);

export const RowSpan = () => (
	<Grid columns={12} gap="sm" breakpoints={[320, 480]} style={{ width: 760 }}>
		<Col span={4} rowSpan={2}>
			<div style={{ ...cell, height: "100%" }}>
				<Text mono size="sm">span 4 · rowSpan 2 · project list</Text>
			</div>
		</Col>
		<Col span={8}>
			<div style={cell}>
				<Text mono size="sm">span 8 · Orca runner</Text>
			</div>
		</Col>
		<Col span={8}>
			<div style={cell}>
				<Text mono size="sm">span 8 · Headless runner</Text>
			</div>
		</Col>
	</Grid>
);

export const Stacked = () => (
	<Grid columns={12} gap="sm" style={{ width: 280 }}>
		<Col span={8}>
			<div style={cell}>
				<Text mono size="sm">span 8 → 12 under 720px</Text>
			</div>
		</Col>
		<Col span={4}>
			<div style={cell}>
				<Text mono size="sm">span 4 → 12</Text>
			</div>
		</Col>
	</Grid>
);
