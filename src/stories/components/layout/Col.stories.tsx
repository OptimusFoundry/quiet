import type { Meta, StoryObj } from "@storybook/react-vite";
import { Col } from "../../../components/layout/Col";
import { Grid } from "../../../components/layout/Grid";
import { Stack } from "../../../components/layout/Stack";
import "./Grid.scss";

function Cell({ children, tall }: { children: string; tall?: boolean }) {
	return (
		<div className={tall ? "q-sb-grid__cell q-sb-grid__cell--tall" : "q-sb-grid__cell"}>
			{children}
		</div>
	);
}

const meta = {
	title: "Components/Layout/Col",
	component: Col,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { span: 8 },
	argTypes: {
		children: { control: false },
		as: { control: false },
	},
	render: (args) => (
		<Grid columns={12} gap="sm">
			<Col {...args}>
				<Cell>{`This Col: span ${args.span ?? 12}`}</Cell>
			</Col>
			<Col span={4}>
				<Cell>span 4</Cell>
			</Col>
		</Grid>
	),
} satisfies Meta<typeof Col>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const SPLITS: [string, number][][] = [
	[
		["Log", 8],
		["Artifacts", 4],
	],
	[
		["Draft", 6],
		["Preview", 6],
	],
	[
		["Runs", 4],
		["Runners", 4],
		["Approvals", 4],
	],
	[
		["Queued", 3],
		["Running", 3],
		["Passed", 3],
		["Failed", 3],
	],
];

export const Spans: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Common splits of the 12 columns. `spanMd` repeats the span so the split also holds while the Grid is 720 to 959px wide.",
			},
		},
	},
	render: () => (
		<Stack gap="sm">
			{SPLITS.map((row) => (
				<Grid key={row.map(([name]) => name).join("-")} columns={12} gap="sm">
					{row.map(([name, span]) => (
						<Col key={name} span={span} spanMd={span}>
							<Cell>{`${name} · span ${span}`}</Cell>
						</Col>
					))}
				</Grid>
			))}
		</Stack>
	),
};

export const ResponsiveSpans: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`spanMd` applies while the parent Grid is 720 to 959px wide (default: a span under 4 becomes 6), `spanSm` under 720px (default 12). The Grid's width decides, not the viewport. Drag the pane's corner.",
			},
		},
	},
	render: () => (
		<div className="q-sb-grid__pane">
			<p className="q-sb-grid__band" />
			<Grid columns={12} gap="sm" rowGap="sm">
				{["Runs", "Runners", "Artifacts", "Approvals"].map((name) => (
					<Col key={name} span={3} spanSm={6}>
						<Cell>{`${name} · 3, md 6, sm 6`}</Cell>
					</Col>
				))}
			</Grid>
		</div>
	),
};

export const StartAndRowSpan: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`start` places a Col on a column (lg band only); `rowSpan` lets it run down rows (md and lg). This Grid sets `breakpoints={[480, 640]}` so it is lg in the Docs column.",
			},
		},
	},
	render: () => (
		<Grid columns={12} gap="sm" rowGap="sm" breakpoints={[480, 640]}>
			<Col span={4} rowSpan={2}>
				<Cell tall>Run summary · rowSpan 2</Cell>
			</Col>
			<Col span={8}>
				<Cell>Log</Cell>
			</Col>
			<Col span={4}>
				<Cell>Artifacts</Cell>
			</Col>
			<Col span={4}>
				<Cell>Approvals</Cell>
			</Col>
			<Col span={6} start={4}>
				<Cell>Invoice · start 4, span 6</Cell>
			</Col>
		</Grid>
	),
};
