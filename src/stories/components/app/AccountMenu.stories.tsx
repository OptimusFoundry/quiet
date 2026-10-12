import type { Meta, StoryObj } from "@storybook/react-vite";
import { AccountMenu } from "../../../components/app/AccountMenu";
import { ACCOUNT_ITEMS, Canvas, Spacer } from "./AppStory";

const meta = {
	title: "Components/App/AccountMenu",
	component: AccountMenu,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	// It sits at the foot of the sidebar on the shell's canvas, and its menu opens upward.
	decorators: [
		(Story) => (
			<Canvas tall>
				<Spacer />
				<Story />
			</Canvas>
		),
	],
	args: { name: "Ada Park", detail: "ada@agentworks.dev", items: ACCOUNT_ITEMS },
	argTypes: {
		detail: { control: "text" },
		items: { control: false },
		onSelect: { control: false },
	},
} satisfies Meta<typeof AccountMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	parameters: {
		docs: {
			description: {
				story: "A menu button: Enter, Space or ↓ opens it; Escape closes it and returns focus.",
			},
		},
	},
};

export const NameOnly: Story = { args: { detail: undefined } };

export const LongDetail: Story = {
	args: { name: "Shubhanshu Aarsay", detail: "shubhanshu@meerkat-onboarding.agentworks.dev" },
};

export const Collapsed: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"In a collapsed Sidebar rail only the avatar shows, named for screen readers, and the menu opens beside the rail.",
			},
		},
	},
	args: { collapsed: true },
};
