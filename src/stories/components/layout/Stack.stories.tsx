import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../../components/core/Button";
import { TextField } from "../../../components/forms/TextField";
import { Col } from "../../../components/layout/Col";
import { Grid } from "../../../components/layout/Grid";
import { Stack } from "../../../components/layout/Stack";
import { Column, Note, Row } from "../Story";
import "./Stack.scss";

function Box({ children, tall }: { children: string; tall?: boolean }) {
	return (
		<div className={tall ? "q-sb-stack__box q-sb-stack__box--tall" : "q-sb-stack__box"}>
			{children}
		</div>
	);
}

const meta = {
	title: "Components/Layout/Stack",
	component: Stack,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { direction: "row", gap: "sm" },
	argTypes: {
		children: { control: false },
		as: { control: false },
		breakpoints: { control: false },
	},
	render: (args) => (
		<Stack {...args}>
			<Box>Queued</Box>
			<Box>Running</Box>
			<Box>Passed</Box>
		</Stack>
	),
} satisfies Meta<typeof Stack>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Gaps: Story = {
	parameters: {
		docs: {
			description: { story: "xs 8 · sm 16 · md 24 · lg 32 · xl 48 · 2xl 64, or a number of px." },
		},
	},
	render: () => (
		<Column wide>
			{(["xs", "sm", "md", "lg", "xl"] as const).map((gap) => (
				<Row key={gap} label={`gap ${gap}`}>
					<Stack direction="row" gap={gap}>
						<Box>Run</Box>
						<Box>Runner</Box>
						<Box>Artifact</Box>
					</Stack>
				</Row>
			))}
		</Column>
	),
};

export const AlignAndJustify: Story = {
	parameters: {
		docs: {
			description: {
				story: "`align` and `justify` take the CSS values. A toolbar: title left, actions right.",
			},
		},
	},
	render: () => (
		<Column wide>
			<div className="q-sb-stack__frame">
				<Stack direction="row" justify="space-between" align="center">
					<Box tall>Invoice 2026-0412</Box>
					<Stack direction="row" gap="xs">
						<Button size="sm" variant="secondary">
							Download
						</Button>
						<Button size="sm">Approve</Button>
					</Stack>
				</Stack>
			</div>
			<div className="q-sb-stack__frame">
				<Stack direction="row" gap="xs" align="end">
					<Box tall>Tall</Box>
					<Box>Aligned to the end</Box>
				</Stack>
			</div>
		</Column>
	),
};

export const Wrap: Story = {
	parameters: {
		docs: { description: { story: "`wrap` lets a row break onto more lines in a narrow box." } },
	},
	render: () => (
		<Column>
			<Stack direction="row" gap="xs" wrap>
				{[
					"Nightly export",
					"Invoice reconciler",
					"Approval digest",
					"Artifact pruner",
					"Usage report",
				].map((r) => (
					<Box key={r}>{r}</Box>
				))}
			</Stack>
		</Column>
	),
};

function FilterRow() {
	return (
		<Stack
			className="q-sb-stack__filters"
			direction="row"
			directionSm="column"
			gap="xs"
			breakpoints={[480, 720]}
		>
			<TextField aria-label="Search" placeholder="Search runs" />
			<TextField aria-label="Runner" placeholder="Runner" />
			<Stack direction="row" gap="xs" align="center">
				<Button variant="secondary">Reset</Button>
				<Button>Apply</Button>
			</Stack>
		</Stack>
	);
}

export const ResponsiveDirection: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`directionSm` / `directionMd` switch the direction by the parent's width, never the viewport. One filter row in a wide and a narrow pane: a row from 480px of parent width (`breakpoints={[480, 720]}`), a column below. Drag the corner of the last pane.",
			},
		},
	},
	render: () => (
		<Stack gap="md">
			<div className="q-sb-stack__panes">
				<section aria-label="Wide pane" className="q-sb-stack__pane q-sb-stack__pane--wide">
					<FilterRow />
				</section>
				<section aria-label="Narrow pane" className="q-sb-stack__pane q-sb-stack__pane--narrow">
					<FilterRow />
				</section>
			</div>
			<section aria-label="Resizable pane" className="q-sb-stack__pane q-sb-stack__pane--resizable">
				<FilterRow />
			</section>
		</Stack>
	),
};

export const InAGrid: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Inside a Grid the Stack follows the Grid's band (sm under 720px, md under 960px), as Col does. Resize the pane: at md the name and Create stack, at sm the actions do too.",
			},
		},
	},
	render: () => (
		<section aria-label="Grid pane" className="q-sb-stack__pane q-sb-stack__pane--resizable">
			<Grid columns={12} rowGap="xs">
				<Col span={8} spanMd={12}>
					<Stack direction="row" directionMd="column" gap="xs" align="stretch">
						<TextField aria-label="Runner name" placeholder="Runner name" />
						<Button variant="secondary">Create runner</Button>
					</Stack>
				</Col>
				<Col span={4} spanMd={12}>
					<Stack direction="row" directionSm="column-reverse" gap="xs" justify="end">
						<Button variant="secondary">Cancel</Button>
						<Button>Save</Button>
					</Stack>
				</Col>
			</Grid>
		</section>
	),
};

export const Animated: Story = {
	parameters: {
		docs: { description: { story: "`animated`: children rise in, 60ms apart, on mount." } },
	},
	args: { animated: true, direction: "column", gap: "xs" },
	render: (args) => (
		<Column>
			<Stack {...args}>
				<Box>Run 4182 queued</Box>
				<Box>Runner picked it up</Box>
				<Box>Artifact saved</Box>
			</Stack>
			<Note>Motion respects reduced-motion settings.</Note>
		</Column>
	),
};
