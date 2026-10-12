import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../../components/core/Button";
import { Icon } from "../../../components/core/Icon";
import { Link } from "../../../components/core/Link";
import { Alert } from "../../../components/feedback/Alert";
import { Column, Note } from "../Story";

const meta = {
	title: "Components/Feedback/Alert",
	component: Alert,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		variant: "info",
		title: "Exports run nightly.",
		children: "The next one starts at 02:00 UTC.",
	},
	argTypes: {
		title: { control: "text" },
		children: { control: "text" },
		icon: { control: false },
		action: { control: false },
		onDismiss: { control: false },
	},
	render: (args) => (
		<Column>
			<Alert {...args} />
		</Column>
	),
} satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Statuses: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Info and success stay neutral; warning and error turn to the accent. Error is announced assertively (`role="alert"`), the rest politely.',
			},
		},
	},
	render: () => (
		<Column>
			<Alert title="Exports run nightly.">The next one starts at 02:00 UTC.</Alert>
			<Alert variant="success" title="Domain verified.">
				Mail from agentworks.dev now passes SPF and DKIM.
			</Alert>
			<Alert variant="warning" title="Two runners are near their budget.">
				Meerkat and Heron have used 84% of this month's spend.
			</Alert>
			<Alert variant="error" title="Delivery failed.">
				The webhook endpoint returned 502 three times.
			</Alert>
		</Column>
	),
};

export const WithAction: Story = {
	parameters: {
		docs: { description: { story: "`action` takes a small button or a link under the text." } },
	},
	render: () => (
		<Column>
			<Alert
				variant="warning"
				title="Two runners are near their budget."
				action={
					<Button size="sm" variant="secondary">
						Review budgets
					</Button>
				}
			/>
			<Alert title="Invoice INV-2041 is ready." action={<Link href="#invoice">Open invoice</Link>}>
				Billed to the Northwind workspace on 1 October.
			</Alert>
		</Column>
	),
};

function DismissDemo() {
	const [shown, setShown] = useState(true);
	return (
		<Column>
			{shown ? (
				<Alert variant="error" title="Delivery failed." onDismiss={() => setShown(false)}>
					The webhook endpoint returned 502 three times.
				</Alert>
			) : (
				<Button variant="secondary" size="sm" onClick={() => setShown(true)}>
					Show it again
				</Button>
			)}
			<Note>
				`onDismiss` adds the close button. The alert collapses first, hands focus to its neighbour,
				then calls `onDismiss`; the parent removes it.
			</Note>
		</Column>
	);
}

export const Dismissible: Story = { render: () => <DismissDemo /> };

export const Icons: Story = {
	parameters: {
		docs: {
			description: {
				story: "`icon={false}` drops the status icon; a node replaces it.",
			},
		},
	},
	render: () => (
		<Column>
			<Alert icon={false} title="No icon.">
				For a dense list of notices where the ground carries the status.
			</Alert>
			<Alert icon={<Icon name="key" />} title="API key rotates in 7 days.">
				Runners using the old key will stop on 19 October.
			</Alert>
		</Column>
	),
};

export const LongText: Story = {
	render: () => (
		<Column>
			<Alert variant="warning" title="Approval needed before this run can continue.">
				The runner wants to push 14 changed files to the production branch of
				agentworks/billing-service, including a migration that drops the legacy_invoices table.
				Someone with the maintainer role in this workspace has to approve it from the approvals
				queue; the run waits for 24 hours and then cancels itself.
			</Alert>
		</Column>
	),
};
