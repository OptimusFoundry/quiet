import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ShellNotice } from "../../../components/app/ShellNotice";
import { Button } from "../../../components/core/Button";
import { Link } from "../../../components/core/Link";
import "./ShellNotice.scss";

const meta = {
	title: "Components/App/ShellNotice",
	component: ShellNotice,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	// It is drawn for the shell's canvas, above the panel (AppShell `notice`).
	decorators: [
		(Story) => (
			<div className="q-sb-shell-notice">
				<Story />
			</div>
		),
	],
	args: {
		children: "Your card was declined, so scheduled runs pause on Oct 15.",
		action: <Link href="#billing">Update billing</Link>,
		tone: "urgent",
	},
	argTypes: {
		children: { control: "text" },
		action: { control: false },
		onDismiss: { control: false },
		ref: { table: { disable: true } },
	},
} satisfies Meta<typeof ShellNotice>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Urgent and workspace-wide. At most one at a time, and no close button while the condition holds.",
			},
		},
	},
};

export const Info: Story = {
	parameters: {
		docs: {
			description: {
				story: '`tone="info"`: a muted mark, for a condition that needs no action.',
			},
		},
	},
	args: {
		tone: "info",
		children: "You're viewing Agentworks as Ada Park.",
		action: <Link href="#stop">Stop viewing</Link>,
	},
};

function DismissibleDemo() {
	const [shown, setShown] = useState(true);
	return shown ? (
		<ShellNotice tone="info" onDismiss={() => setShown(false)}>
			Scheduled maintenance tonight, 23:00 to 23:30 UTC. Queued runs start after.
		</ShellNotice>
	) : (
		<Button variant="ghost" size="sm" onClick={() => setShown(true)}>
			Show it again
		</Button>
	);
}

export const Dismissible: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`onDismiss` adds a close button. Leave it out while the condition must stay in view.",
			},
		},
	},
	render: () => <DismissibleDemo />,
};

export const LongText: Story = {
	args: {
		children:
			"Runner Orca is degraded in us-east-1: web-message triggers are queued and runs may start up to ten minutes late until the provider recovers.",
		action: <Link href="#status">Status page</Link>,
	},
};
