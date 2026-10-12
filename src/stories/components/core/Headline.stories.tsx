import type { Meta, StoryObj } from "@storybook/react-vite";
import { Headline } from "../../../components/core/Headline";
import { Column } from "../Story";

const meta = {
	title: "Components/Core/Headline",
	component: Headline,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { lead: "Runs this week", size: "h2", period: true },
	argTypes: {
		ref: { table: { disable: true } },
	},
} satisfies Meta<typeof Headline>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
	parameters: {
		docs: {
			description: { story: "`display` renders an `<h1>`; the others their own heading level." },
		},
	},
	render: () => (
		<Column wide>
			<Headline size="display" lead="Ship agents you can trust" />
			<Headline size="h2" lead="Runs this week" />
			<Headline size="h3" lead="Pending approvals" />
			<Headline size="h4" lead="Invoice history" />
		</Column>
	),
};

export const LeadAndAfter: Story = {
	parameters: {
		docs: {
			description: {
				story: "`after` continues the line after `lead`, joined with a space.",
			},
		},
	},
	render: () => (
		<Column wide>
			<Headline size="h2" lead="Every run," after="reviewed before it ships" />
		</Column>
	),
};

export const WithoutPeriod: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`period` appends the accent full stop where the theme shows it (`--q-period-display`); `false` never does.",
			},
		},
	},
	render: () => (
		<Column wide>
			<Headline size="h3" lead="Workspace settings" period={false} />
		</Column>
	),
};

export const OtherTag: Story = {
	parameters: {
		docs: {
			description: {
				story: "`as` keeps the look and changes the element, for the right outline.",
			},
		},
	},
	render: () => (
		<Column wide>
			<Headline size="display" as="h2" lead="Approvals" />
		</Column>
	),
};
