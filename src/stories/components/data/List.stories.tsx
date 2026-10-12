import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Avatar } from "../../../components/core/Avatar";
import { Badge } from "../../../components/core/Badge";
import { Icon } from "../../../components/core/Icon";
import { List, type ListProps } from "../../../components/data/List";
import { Column, Note } from "../Story";

const PEOPLE: NonNullable<ListProps["items"]> = [
	{ id: 1, primary: "Ada Lovelace", secondary: "ada@agentworks.dev", trailing: "Owner" },
	{ id: 2, primary: "Grace Hopper", secondary: "grace@agentworks.dev", trailing: "Admin" },
	{ id: 3, primary: "Alan Turing", secondary: "alan@agentworks.dev", trailing: "Member" },
];

const meta = {
	title: "Components/Data/List",
	component: List,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { items: PEOPLE, size: "md", divided: true, bordered: false, animated: false },
	argTypes: {
		items: { control: false },
		groups: { control: false },
	},
	decorators: [
		(Story) => (
			<Column>
				<Story />
			</Column>
		),
	],
} satisfies Meta<typeof List>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Leading: Story = {
	parameters: {
		docs: { description: { story: "`leading` takes an avatar or an icon; `trailing` any meta." } },
	},
	args: {
		items: [
			{
				id: 1,
				leading: <Avatar size="sm" name="Ada Lovelace" />,
				primary: "Ada Lovelace",
				secondary: "Approved run 482",
				trailing: "2m ago",
			},
			{
				id: 2,
				leading: <Icon name="file" />,
				primary: "march-invoices.csv",
				secondary: "Artifact, 214 KB",
				trailing: <Badge>CSV</Badge>,
			},
			{
				id: 3,
				leading: <Icon name="runs" />,
				primary: "Reconcile March invoices",
				secondary: "eu-west-2",
				trailing: <Badge variant="warning">Waiting</Badge>,
			},
		],
	},
};

function InteractiveDemo() {
	const [current, setCurrent] = useState("billing");
	return (
		<Column>
			<List
				bordered
				items={[
					{
						id: "billing",
						primary: "Billing",
						secondary: "Plan, invoices, seats",
						selected: current === "billing",
						onClick: () => setCurrent("billing"),
					},
					{
						id: "members",
						primary: "Members",
						secondary: "Invite and manage",
						selected: current === "members",
						onClick: () => setCurrent("members"),
					},
					{ id: "keys", primary: "API keys", secondary: "Opens a page", href: "#list" },
					{
						id: "audit",
						primary: "Audit log",
						secondary: "Business plan",
						disabled: true,
						onClick: () => {},
					},
				]}
			/>
			<Note>Current: {current}. `selected` sets `aria-current` on the row.</Note>
		</Column>
	);
}

export const Interactive: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`onClick` rows are buttons, `href` rows links; both take a soft ground on hover and nudge an arrow.",
			},
		},
	},
	render: () => <InteractiveDemo />,
};

export const Grouped: Story = {
	args: {
		size: "sm",
		items: undefined,
		groups: [
			{ label: "Today", items: PEOPLE.slice(0, 2) },
			{ label: "Earlier", items: PEOPLE.slice(2) },
		],
	},
};

export const Bordered: Story = {
	parameters: {
		docs: {
			description: { story: "`bordered` sets the list on a soft ground with rounded corners." },
		},
	},
	args: { bordered: true },
};

export const Animated: Story = {
	parameters: {
		docs: {
			description: {
				story: "Rows rise in on mount, 60ms apart. Reduced motion shows them at once.",
			},
		},
	},
	args: { animated: true },
};
