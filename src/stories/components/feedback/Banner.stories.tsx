import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../../components/core/Button";
import { Banner } from "../../../components/feedback/Banner";
import { Column, Note } from "../Story";

const meta = {
	title: "Components/Feedback/Banner",
	component: Banner,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		status: "info",
		title: "Scheduled maintenance.",
		children: "Runs pause on Sunday from 02:00 to 03:00 UTC.",
		dismissible: true,
	},
	argTypes: {
		title: { control: "text" },
		children: { control: "text" },
		action: { control: false },
		onDismiss: { control: false },
		variant: { table: { disable: true } },
	},
} satisfies Meta<typeof Banner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Statuses: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Info and success stay neutral; warning and error turn to the accent. An error banner is `role="alert"`, the rest are named regions.',
			},
		},
	},
	render: () => (
		<Column wide>
			<Banner status="info" title="Scheduled maintenance.">
				Runs pause on Sunday from 02:00 to 03:00 UTC.
			</Banner>
			<Banner status="success" title="Payment received.">
				Invoice INV-2041 is paid.
			</Banner>
			<Banner status="warning" title="Trial ends in 3 days.">
				Pick a plan to keep your runners scheduled.
			</Banner>
			<Banner status="error" title="You're offline." dismissible={false}>
				Changes will sync when you reconnect.
			</Banner>
		</Column>
	),
};

export const WithAction: Story = {
	render: () => (
		<Column wide>
			<Banner
				status="warning"
				title="Trial ends in 3 days."
				action={
					<Button size="sm" variant="secondary">
						Pick a plan
					</Button>
				}
			/>
		</Column>
	),
};

function DismissDemo() {
	const [shown, setShown] = useState(true);
	return (
		<Column wide>
			{shown ? (
				<Banner status="info" title="New: approvals inbox." onDismiss={() => setShown(false)}>
					Every run waiting on you, in one place.
				</Banner>
			) : (
				<Button variant="secondary" size="sm" onClick={() => setShown(true)}>
					Show it again
				</Button>
			)}
			<Note>
				Dismissible by default: the strip collapses, then calls `onDismiss`. Set `dismissible` to
				false for a notice that must stay.
			</Note>
		</Column>
	);
}

export const Dismissible: Story = { render: () => <DismissDemo /> };

export const WithoutTitle: Story = {
	parameters: {
		docs: {
			description: {
				story: 'With no title, `label` names the region for screen readers (default "Notice").',
			},
		},
	},
	render: () => (
		<Column wide>
			<Banner status="info" label="Workspace notice" dismissible={false}>
				You're viewing the Northwind workspace as a guest.
			</Banner>
		</Column>
	),
};
