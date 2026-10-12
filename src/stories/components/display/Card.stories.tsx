import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Badge } from "../../../components/core/Badge";
import { Icon } from "../../../components/core/Icon";
import { Card } from "../../../components/display/Card";
import { Column, Note } from "../Story";
import "./Card.scss";

const meta = {
	title: "Components/Display/Card",
	component: Card,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		eyebrow: "Workspace",
		title: "Invoice reconciliation",
		children: "Matches supplier invoices against purchase orders every night.",
		meta: "Updated 2h ago",
	},
	argTypes: {
		eyebrow: { control: "text" },
		title: { control: "text" },
		children: { control: "text" },
		meta: { control: "text" },
		footer: { control: false },
		onClick: { control: false },
	},
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

const narrow: Story["decorators"] = [
	(Story) => (
		<Column>
			<Story />
		</Column>
	),
];

export const Playground: Story = { decorators: narrow };

export const AsLink: Story = {
	decorators: narrow,
	parameters: {
		docs: {
			description: {
				story:
					"`href` makes the whole card a link; its ground deepens on hover and keyboard focus.",
			},
		},
	},
	args: { href: "#card", footer: <Icon name="arrow-right" />, meta: "12 runs this week" },
};

function ButtonDemo() {
	const [opened, setOpened] = useState(0);
	return (
		<Column>
			<Card
				onClick={() => setOpened((n) => n + 1)}
				eyebrow="Runner"
				title="eu-west-2"
				meta="3 runs queued"
			>
				Acts as a button: Enter and Space work as a click.
			</Card>
			<Note>Opened {opened} times.</Note>
		</Column>
	);
}

export const AsButton: Story = { render: () => <ButtonDemo /> };

export const Minimal: Story = {
	parameters: {
		docs: { description: { story: "Every slot is optional: a title alone, or a body alone." } },
	},
	render: () => (
		<Column>
			<Card title="Nightly export" />
			<Card>Artifacts older than 90 days move to cold storage.</Card>
		</Column>
	),
};

export const Grid: Story = {
	parameters: {
		docs: { description: { story: "Cards sit on space, not rules: a grid of work." } },
	},
	render: () => (
		<div className="q-sb-card">
			<Card
				href="#grid"
				eyebrow="Workspace"
				title="Invoice reconciliation"
				meta="Updated 2h ago"
				footer={<Badge variant="success">Live</Badge>}
			>
				Matches supplier invoices against purchase orders every night.
			</Card>
			<Card
				href="#grid"
				eyebrow="Workspace"
				title="Contract review"
				meta="4 approvals waiting"
				footer={<Badge variant="warning">Needs review</Badge>}
			>
				Flags clauses that differ from the approved template.
			</Card>
			<Card
				href="#grid"
				eyebrow="Workspace"
				title="Support triage"
				meta="Paused yesterday"
				footer={<Badge>Paused</Badge>}
			>
				Sorts incoming tickets and drafts the first reply.
			</Card>
		</div>
	),
};
