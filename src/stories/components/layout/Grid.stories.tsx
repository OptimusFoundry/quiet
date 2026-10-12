import type { Meta, StoryObj } from "@storybook/react-vite";
import { Col } from "../../../components/layout/Col";
import { Grid } from "../../../components/layout/Grid";
import { Column, Note } from "../Story";
import "./Grid.scss";

const RUNNERS = ["Nightly export", "Invoice reconciler", "Approval digest", "Artifact pruner"];

function Cell({ children }: { children: string }) {
	return <div className="q-sb-grid__cell">{children}</div>;
}

const meta = {
	title: "Components/Layout/Grid",
	component: Grid,
	subcomponents: { Col },
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { columns: 3, gap: "md", rowGap: "md" },
	argTypes: {
		children: { control: false },
		as: { control: false },
		breakpoints: { control: false },
	},
	render: (args) => (
		<Grid {...args}>
			{RUNNERS.concat("Usage report", "Webhook relay").map((r) => (
				<Cell key={r}>{r}</Cell>
			))}
		</Grid>
	),
} satisfies Meta<typeof Grid>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Gaps: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Named gaps on the 8px scale: xs 8 · sm 16 · md 24 · lg 32 · xl 48 · 2xl 64, or px. `gap` is between columns; rows only gap when `rowGap` is set.",
			},
		},
	},
	render: () => (
		<Column wide>
			{(["xs", "md", "xl"] as const).map((gap) => (
				<Grid key={gap} columns={4} gap={gap}>
					{RUNNERS.map((r) => (
						<Cell key={r}>{`gap ${gap}`}</Cell>
					))}
				</Grid>
			))}
		</Column>
	),
};

export const AutoFit: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`minChildWidth` fits as many columns as there is room for, each at least that wide. Resize the pane.",
			},
		},
	},
	render: () => (
		<div className="q-sb-grid__pane">
			<Grid minChildWidth={200} gap="sm" rowGap="sm">
				{RUNNERS.concat("Usage report", "Webhook relay").map((r) => (
					<Cell key={r}>{r}</Cell>
				))}
			</Grid>
		</div>
	),
};

export const Template: Story = {
	parameters: {
		docs: {
			description: {
				story: "A string is a raw `grid-template-columns`: a fixed list beside a fluid detail.",
			},
		},
	},
	args: { columns: "240px 1fr", gap: "sm" },
	render: (args) => (
		<Grid {...args}>
			<Cell>Runs list, 240px</Cell>
			<Cell>Run detail, the rest</Cell>
		</Grid>
	),
};

export const ContainerBands: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Grid measures its own width, not the viewport: under 720px it is sm, under 960px md, else lg. The `Col` and `Stack` inside follow its band, so a layout reflows the same in a pane as on a page. Drag the pane's corner.",
			},
		},
	},
	render: () => (
		<div className="q-sb-grid__pane">
			<p className="q-sb-grid__band" />
			<Grid columns={12} gap="sm" rowGap="sm">
				<Col span={8} spanMd={12}>
					<Cell>Run log · span 8, md 12</Cell>
				</Col>
				<Col span={4} spanMd={6}>
					<Cell>Artifacts · span 4, md 6</Cell>
				</Col>
				<Col span={4} spanMd={6} spanSm={12}>
					<Cell>Approvals · span 4, md 6</Cell>
				</Col>
				<Col span={8} spanMd={12}>
					<Cell>Usage · span 8, md 12</Cell>
				</Col>
			</Grid>
			<Note>Under 720px every Col spans 12 unless it sets `spanSm`.</Note>
		</div>
	),
};

export const Animated: Story = {
	parameters: {
		docs: {
			description: {
				story: "`animated` lets the children rise in one after another on mount.",
			},
		},
	},
	args: { animated: true, columns: 4, gap: "sm" },
	render: (args) => (
		<Grid {...args}>
			{RUNNERS.map((r) => (
				<Cell key={r}>{r}</Cell>
			))}
		</Grid>
	),
};
