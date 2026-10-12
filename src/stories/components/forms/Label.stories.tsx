import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../../../components/core/Badge";
import { Link } from "../../../components/core/Link";
import { Label } from "../../../components/forms/Label";
import { Column } from "../Story";

const meta = {
	title: "Components/Forms/Label",
	component: Label,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { children: "Workspace name", required: false, size: "md", disabled: false },
	argTypes: {
		children: { control: "text" },
		subText: { control: "text" },
		badge: { control: false },
		action: { control: false },
	},
	decorators: [
		(Story) => (
			<Column>
				<Story />
			</Column>
		),
	],
} satisfies Meta<typeof Label>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Required: Story = {
	parameters: {
		docs: { description: { story: 'An accent asterisk; screen readers hear "(required)".' } },
	},
	args: { required: true, children: "Billing email" },
};

export const WithSubText: Story = {
	args: { children: "Retention", subText: "How long runs keep their logs and artifacts." },
};

export const WithBadgeAndAction: Story = {
	render: () => (
		<>
			<Label badge={<Badge size="sm">Beta</Badge>}>Approval rules</Label>
			<Label
				action={
					<Link href="#rotate" size="sm">
						Rotate key
					</Link>
				}
			>
				API key
			</Label>
		</>
	),
};

export const Sizes: Story = {
	render: () => (
		<>
			<Label size="sm">Small label</Label>
			<Label size="md">Medium label</Label>
			<Label size="lg">Large label</Label>
		</>
	),
};

export const Disabled: Story = {
	args: { disabled: true, children: "Workspace ID", subText: "Can't change after creation." },
};
