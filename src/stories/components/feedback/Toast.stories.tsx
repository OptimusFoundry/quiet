import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../../components/core/Button";
import { Toast } from "../../../components/feedback/Toast";
import { Column, Note } from "../Story";

const meta = {
	title: "Components/Feedback/Toast",
	component: Toast,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		title: "Draft saved",
		description: "Your changes to the release notes are stored.",
		variant: "default",
	},
	argTypes: {
		title: { control: "text" },
		description: { control: "text" },
		meta: { control: "text" },
		action: { control: false },
		onClose: { control: false },
		status: { table: { disable: true } },
	},
	render: (args) => (
		<Column>
			<Toast {...args} />
		</Column>
	),
} satisfies Meta<typeof Toast>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'`default` (info) marks with an accent dot, `neutral` with an ink dot; success, warning and error draw the status icon. Error is `role="alert"`. A toast is usually raised with `toast()` from Toaster; render `Toast` directly only for a static notice.',
			},
		},
	},
	render: () => (
		<Column>
			<Toast title="Draft saved" description="Your changes are stored." onClose={() => {}} />
			<Toast variant="neutral" title="Run queued" meta="Meerkat · position 3" onClose={() => {}} />
			<Toast variant="success" title="Invite sent" meta="leo@northwind.dev" onClose={() => {}} />
			<Toast variant="warning" title="Budget at 80%" meta="Meerkat · daily" />
			<Toast
				variant="error"
				title="Not sent"
				description="The webhook endpoint returned 502. Retry in a minute."
				onClose={() => {}}
			/>
		</Column>
	),
};

export const WithAction: Story = {
	render: () => (
		<Column>
			<Toast
				variant="error"
				title="Delivery failed"
				description="The endpoint returned 500."
				action={
					<Button size="sm" variant="outline">
						Retry
					</Button>
				}
				onClose={() => {}}
			/>
			<Toast
				title="Artifact deleted"
				meta="release-notes.md"
				action={
					<Button size="sm" variant="ghost">
						Undo
					</Button>
				}
				onClose={() => {}}
			/>
		</Column>
	),
};

function AutoCloseDemo() {
	const [shown, setShown] = useState(true);
	return (
		<Column>
			{shown ? (
				<Toast
					variant="success"
					title="Workspace exported"
					meta="northwind-2026-10-12.zip"
					duration={4000}
					onClose={() => setShown(false)}
				/>
			) : (
				<Button size="sm" variant="secondary" onClick={() => setShown(true)}>
					Show it again
				</Button>
			)}
			<Note>
				`duration` closes it after 4 seconds; hovering or focusing it pauses the timer. It needs
				`onClose`.
			</Note>
		</Column>
	);
}

export const AutoClose: Story = { render: () => <AutoCloseDemo /> };

export const NotClosable: Story = {
	parameters: {
		docs: { description: { story: "Without `onClose` there is no close button." } },
	},
	render: () => (
		<Column>
			<Toast variant="warning" title="Reconnecting" description="Runs keep going on the server." />
		</Column>
	),
};
