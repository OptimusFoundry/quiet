import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppIcon } from "../../../components/app/AppIcon";
import { NoticeChip } from "../../../components/app/NoticeChip";
import { TopBar } from "../../../components/app/TopBar";
import { Button } from "../../../components/core/Button";
import { ButtonGroup } from "../../../components/core/ButtonGroup";
import { Frame } from "./AppStory";

const ACTIONS = (
	<>
		<Button size="sm" variant="ghost" icon={<AppIcon name="bell" />} aria-label="Notifications" />
		<Button size="sm" variant="primary">
			New run
		</Button>
	</>
);

const meta = {
	title: "Components/App/TopBar",
	component: TopBar,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	// Out of its AppShell the Sidebar toggle has nothing to toggle, so it doesn't render; the bar
	// sits in a hairline frame here.
	decorators: [
		(Story) => (
			<Frame>
				<Story />
			</Frame>
		),
	],
	args: {
		crumbs: [{ label: "Runs", href: "#runs" }, { label: "Run 233f76c2" }],
		actions: ACTIONS,
	},
	argTypes: {
		title: { control: "text" },
		actions: { control: false },
		children: { control: false },
	},
} satisfies Meta<typeof TopBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Inside an AppShell it pins to the panel's top, leads with the Sidebar's toggle, and its rule shows once content scrolls under it (AppShell stories).",
			},
		},
	},
};

export const Title: Story = {
	parameters: {
		docs: { description: { story: "`title` instead of crumbs, e.g. the screen name." } },
	},
	args: { crumbs: undefined, title: "Settings", actions: undefined },
};

export const DeepTrail: Story = {
	parameters: {
		docs: {
			description: { story: "Long trails fold to four crumbs; the last is the current page." },
		},
	},
	args: {
		crumbs: [
			{ label: "Agentworks", href: "#" },
			{ label: "Projects", href: "#projects" },
			{ label: "Meerkat onboarding and activation", href: "#meerkat" },
			{ label: "Runs", href: "#runs" },
			{ label: "Run 9be01a4d" },
		],
	},
};

export const WithMiddle: Story = {
	parameters: {
		docs: {
			description: { story: "`children` sit between the trail and the actions, e.g. a filter." },
		},
	},
	args: {
		crumbs: [{ label: "Runs" }],
		children: (
			<ButtonGroup attached>
				<Button variant="secondary" size="sm" aria-pressed="true">
					All
				</Button>
				<Button variant="secondary" size="sm" aria-pressed="false">
					Running
				</Button>
				<Button variant="secondary" size="sm" aria-pressed="false">
					Failed
				</Button>
			</ButtonGroup>
		),
	},
};

export const WithPageNotice: Story = {
	args: {
		actions: (
			<>
				<NoticeChip aria-expanded={false}>Run paused</NoticeChip>
				{ACTIONS}
			</>
		),
	},
};
