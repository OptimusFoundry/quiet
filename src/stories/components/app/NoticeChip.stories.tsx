import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { NoticeChip } from "../../../components/app/NoticeChip";
import { TopBar } from "../../../components/app/TopBar";
import { Column, Note, Row } from "../Story";
import { Frame } from "./AppStory";

const CRUMBS = [{ label: "Runs", href: "#runs" }, { label: "Run 233f76c2" }];

const meta = {
	title: "Components/App/NoticeChip",
	component: NoticeChip,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { children: "Run paused", tone: "urgent" },
	argTypes: {
		children: { control: "text" },
		ref: { table: { disable: true } },
	},
} satisfies Meta<typeof NoticeChip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Urgent: an accent mark on an attention tint. Info: a muted mark on the warm ground.",
			},
		},
	},
	render: () => (
		<Row>
			<NoticeChip>Run paused</NoticeChip>
			<NoticeChip tone="info">DNS check pending</NoticeChip>
		</Row>
	),
};

export const InTheTopBar: Story = {
	parameters: {
		docs: {
			description: { story: "In the TopBar's actions. In a narrow bar only its mark shows." },
		},
	},
	render: () => (
		<Column wide>
			<Frame>
				<TopBar crumbs={CRUMBS} actions={<NoticeChip>Run paused</NoticeChip>} />
			</Frame>
			<Frame>
				<TopBar
					crumbs={[{ label: "Settings", href: "#settings" }, { label: "Domains" }]}
					actions={<NoticeChip tone="info">DNS check pending</NoticeChip>}
				/>
			</Frame>
			<Frame narrow>
				<TopBar crumbs={CRUMBS} actions={<NoticeChip>Run paused</NoticeChip>} />
			</Frame>
		</Column>
	),
};

function ToggleDemo() {
	const [open, setOpen] = useState(false);
	return (
		<Column>
			<Row>
				<NoticeChip
					aria-expanded={open}
					aria-controls="app-aside"
					onClick={() => setOpen((o) => !o)}
				>
					Run paused
				</NoticeChip>
			</Row>
			<Note>
				{open
					? "aria-expanded is true: AppShell's third pane would show the details."
					: "It toggles the third pane like the other pane openers."}
			</Note>
		</Column>
	);
}

export const OpensThePane: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Pass `aria-expanded` and `aria-controls` (the AppShell pane's id) like the other pane toggles. AppShell / Third pane shows the frame.",
			},
		},
	},
	render: () => <ToggleDemo />,
};
