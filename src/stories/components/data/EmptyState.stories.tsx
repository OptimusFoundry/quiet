import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../../components/core/Button";
import { EmptyState } from "../../../components/data/EmptyState";
import { Column, Note } from "../Story";

const meta = {
	title: "Components/Data/EmptyState",
	component: EmptyState,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		icon: "file",
		eyebrow: "Artifacts",
		title: "No artifacts yet",
		description: "Runs that produce files list them here.",
		size: "md",
		align: "center",
		bordered: false,
	},
	argTypes: {
		icon: { control: "text" },
		eyebrow: { control: "text" },
		title: { control: "text" },
		description: { control: "text" },
		actions: { control: false },
	},
	decorators: [
		(Story) => (
			<Column>
				<Story />
			</Column>
		),
	],
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithActions: Story = {
	parameters: {
		docs: { description: { story: "One clear next step; a second, quieter one at most." } },
	},
	args: {
		actions: (
			<>
				<Button size="sm">Start a run</Button>
				<Button size="sm" variant="ghost">
					Read the guide
				</Button>
			</>
		),
	},
};

export const NoResults: Story = {
	parameters: {
		docs: {
			description: { story: "After a search or filter: say what didn't match and what to try." },
		},
	},
	args: {
		icon: "search",
		eyebrow: undefined,
		title: "Nothing matches",
		description: "No run contains “refund”. Try a shorter search.",
		size: "sm",
	},
};

export const Placeholder: Story = {
	parameters: {
		docs: {
			description: {
				story: '`bordered` sets it on a soft ground, `align="start"` lines it up with a form.',
			},
		},
	},
	args: {
		icon: "upload",
		eyebrow: undefined,
		title: "Drop a CSV to import",
		description: "Up to 10 MB. Columns are matched by header.",
		bordered: true,
		align: "start",
		size: "sm",
	},
};

export const Sizes: Story = {
	render: () => (
		<Column>
			<Note>sm</Note>
			<EmptyState size="sm" icon="approvals" title="No approvals waiting" />
			<Note>md</Note>
			<EmptyState
				size="md"
				icon="approvals"
				title="No approvals waiting"
				description="Runs that need a sign-off wait here."
			/>
			<Note>lg</Note>
			<EmptyState
				size="lg"
				icon="approvals"
				title="No approvals waiting"
				description="Runs that need a sign-off wait here."
			/>
		</Column>
	),
};
