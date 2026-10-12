import type { Meta, StoryObj } from "@storybook/react-vite";
import { SidebarNotice } from "../../../components/app/SidebarNotice";
import { Canvas } from "./AppStory";

const meta = {
	title: "Components/App/SidebarNotice",
	component: SidebarNotice,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	// It sits at the Sidebar's foot, above the AccountMenu, on the shell's canvas.
	decorators: [
		(Story) => (
			<Canvas>
				<Story />
			</Canvas>
		),
	],
	args: {
		title: "Trial: 3 days left",
		progress: 0.78,
		progressLabel: "Trial used",
		action: { label: "Choose a plan", href: "#billing" },
	},
	argTypes: {
		description: { control: "text" },
		onDismiss: { control: false },
		ref: { table: { disable: true } },
	},
} satisfies Meta<typeof SidebarNotice>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	parameters: {
		docs: {
			description: {
				story: "A slow nudge about the account. Urgent conditions are a `ShellNotice` instead.",
			},
		},
	},
};

export const Dismissible: Story = { args: { onDismiss: () => {} } };

export const WithDescription: Story = {
	parameters: {
		docs: { description: { story: "A second line, and an action that is a button (`onClick`)." } },
	},
	args: {
		title: "Usage at 82%",
		description: "8,200 of 10,000 runs this month.",
		progress: 0.82,
		progressLabel: undefined,
		action: { label: "See usage", onClick: () => {} },
	},
};

export const TextOnly: Story = {
	args: {
		title: "quiet 1.2 is out",
		description: "Panes over drawers, and a new FileCard row.",
		progress: undefined,
		action: { label: "What's new", href: "#changelog" },
	},
};

export const Collapsed: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"In the collapsed rail: an icon with a mark, named by the title, doing the action. Pass the Sidebar's `footer` function argument.",
			},
		},
	},
	args: { collapsed: true },
};
