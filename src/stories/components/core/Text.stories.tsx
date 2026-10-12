import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "../../../components/core/Text";
import { Column } from "../Story";

const meta = {
	title: "Components/Core/Text",
	component: Text,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		children: "Runs pause for approval before they touch production data.",
		size: "md",
		weight: "normal",
		color: "default",
	},
	argTypes: {
		size: {
			control: "select",
			options: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl"],
		},
		italic: { table: { disable: true } },
		ref: { table: { disable: true } },
	},
} satisfies Meta<typeof Text>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
	render: () => (
		<Column wide>
			{(["xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const).map((s) => (
				<Text key={s} size={s}>
					{s} · Invoice paid
				</Text>
			))}
		</Column>
	),
};

export const Headings: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`heading` renders `<h1>`–`<h4>` at the heading scale. For page titles, see Headline.",
			},
		},
	},
	render: () => (
		<Column wide>
			<Text heading={1}>Workspaces</Text>
			<Text heading={2}>Runs</Text>
			<Text heading={3}>Approvals</Text>
			<Text heading={4}>Invoices</Text>
		</Column>
	),
};

export const WeightsAndColors: Story = {
	parameters: {
		docs: {
			description: {
				story: "Emphasis comes from weight and ink; quiet has no italics.",
			},
		},
	},
	render: () => (
		<Column>
			<Text weight="normal">Normal</Text>
			<Text weight="medium">Medium</Text>
			<Text weight="semibold">Semibold</Text>
			<Text weight="bold">Bold</Text>
			<Text color="heading">Heading ink</Text>
			<Text color="muted">Muted: last run 4 min ago</Text>
			<Text color="quiet">Quiet: optional</Text>
			<Text color="primary">Primary: accent text</Text>
			<Text color="success">Success: run passed</Text>
			<Text color="warning">Warning: token expires in 2 days</Text>
			<Text color="error">Error: payment failed</Text>
		</Column>
	),
};

export const Mono: Story = {
	parameters: {
		docs: {
			description: { story: "Geist Mono at 12px, muted, for IDs and code. Never for labels." },
		},
	},
	render: () => (
		<Column>
			<Text mono>run_8f2c1a</Text>
			<Text mono>inv_2026_10_0042</Text>
		</Column>
	),
};

export const Truncation: Story = {
	parameters: {
		docs: {
			description: {
				story: "`truncate` keeps one line with an ellipsis; `lineClamp` keeps that many lines.",
			},
		},
	},
	render: () => (
		<Column>
			<Text truncate>
				Reconcile October invoices against the ledger export and flag every mismatch over $50 for
				review
			</Text>
			<Text lineClamp={2} color="muted" size="sm">
				The runner reads the ledger export, matches each invoice by number and amount, and opens an
				approval for every mismatch over $50. Nothing is written back until a finance lead approves
				the batch.
			</Text>
		</Column>
	),
};

export const Decoration: Story = {
	render: () => (
		<Column>
			<Text underline>Underlined</Text>
			<Text strike color="muted">
				$1,240.00
			</Text>
			<Text align="right">Right aligned</Text>
		</Column>
	),
};
