import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppIcon } from "../../../components/app/AppIcon";
import { WorkspaceSwitcher } from "../../../components/app/WorkspaceSwitcher";
import { Canvas, WORKSPACE_ITEMS } from "./AppStory";

const meta = {
	title: "Components/App/WorkspaceSwitcher",
	component: WorkspaceSwitcher,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	// It is drawn for the shell's canvas, a sidebar wide.
	decorators: [
		(Story) => (
			<Canvas tall>
				<Story />
			</Canvas>
		),
	],
	args: { name: "Agentworks", detail: "Team plan", items: WORKSPACE_ITEMS },
	argTypes: {
		mark: { control: false },
		detail: { control: "text" },
		items: { control: false },
		onSelect: { control: false },
	},
} satisfies Meta<typeof WorkspaceSwitcher>;
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

export const WithMark: Story = {
	parameters: {
		docs: {
			description: { story: "`mark` takes the workspace's logo; the first letter otherwise." },
		},
	},
	args: { mark: <AppIcon name="grid" size="sm" /> },
};

export const LongName: Story = {
	args: { name: "Meerkat onboarding and activation", detail: "Enterprise plan · 48 seats" },
};

export const Collapsed: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"In a collapsed Sidebar rail only the mark shows, named for screen readers. Pass the Sidebar's `header` function argument.",
			},
		},
	},
	args: { collapsed: true },
};
