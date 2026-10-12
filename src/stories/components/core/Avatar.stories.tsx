import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "../../../components/core/Avatar";
import { Icon } from "../../../components/core/Icon";
import { Row } from "../Story";

// An inline portrait, so the stories never reach the network.
const PORTRAIT = `data:image/svg+xml,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#d9d4cc"/><circle cx="32" cy="26" r="11" fill="#8a837a"/><path d="M12 60c3-12 11-18 20-18s17 6 20 18z" fill="#8a837a"/></svg>',
)}`;

const meta = {
	title: "Components/Core/Avatar",
	component: Avatar,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { name: "Ada Lovelace", size: "md", shape: "circle" },
	argTypes: {
		size: { control: "select", options: ["xs", "sm", "md", "lg", "xl", "2xl"] },
		fallback: { control: false },
		ref: { table: { disable: true } },
	},
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
	parameters: {
		docs: { description: { story: "Named steps, or a number for a custom pixel size." } },
	},
	render: () => (
		<Row>
			<Avatar name="Ada Lovelace" size="xs" />
			<Avatar name="Ada Lovelace" size="sm" />
			<Avatar name="Ada Lovelace" size="md" />
			<Avatar name="Ada Lovelace" size="lg" />
			<Avatar name="Ada Lovelace" size="xl" />
			<Avatar name="Ada Lovelace" size="2xl" />
			<Avatar name="Ada Lovelace" size={72} />
		</Row>
	),
};

export const Shapes: Story = {
	parameters: {
		docs: { description: { story: "Circle for people, the soft square for workspaces and orgs." } },
	},
	render: () => (
		<Row>
			<Avatar name="Grace Hopper" size="lg" />
			<Avatar name="Agentworks Labs" shape="square" size="lg" />
		</Row>
	),
};

export const Fallbacks: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"An image when `src` loads; initials from `name` when it doesn't; `fallback`, then the user icon, when there is no name.",
			},
		},
	},
	render: () => (
		<Row>
			<Avatar src={PORTRAIT} name="Grace Hopper" size="lg" />
			<Avatar name="Grace Hopper" size="lg" />
			<Avatar fallback={<Icon name="runs" />} alt="Runner" size="lg" />
			<Avatar size="lg" />
		</Row>
	),
};

export const Assignees: Story = {
	parameters: {
		docs: { description: { story: "Small avatars beside the people on a run's approval." } },
	},
	render: () => (
		<Row label="Approvers">
			<Avatar name="Ada Lovelace" size="sm" />
			<Avatar name="Grace Hopper" size="sm" />
			<Avatar name="Alan Turing" size="sm" />
			<Avatar src={PORTRAIT} name="Katherine Johnson" size="sm" />
		</Row>
	),
};
