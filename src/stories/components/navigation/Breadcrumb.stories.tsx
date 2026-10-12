import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Icon } from "../../../components/core/Icon";
import { Breadcrumb } from "../../../components/navigation/Breadcrumb";
import { Column, Note } from "../Story";

const TRAIL = [
	{ label: "Workspace", href: "#workspace" },
	{ label: "Runners", href: "#runners" },
	{ label: "Nightly export" },
];

const LONG = [
	{ label: "Workspace", href: "#workspace" },
	{ label: "Projects", href: "#projects" },
	{ label: "Meerkat", href: "#meerkat" },
	{ label: "Runners", href: "#runners" },
	{ label: "Nightly export" },
];

const meta = {
	title: "Components/Navigation/Breadcrumb",
	component: Breadcrumb,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { items: TRAIL, size: "md" },
	argTypes: { separator: { control: false } },
} satisfies Meta<typeof Breadcrumb>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
	render: (args) => (
		<Column>
			<Breadcrumb {...args} size="sm" label="Breadcrumb, small" />
			<Breadcrumb {...args} size="md" label="Breadcrumb, medium" />
			<Breadcrumb {...args} size="lg" label="Breadcrumb, large" />
		</Column>
	),
};

export const Collapsed: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`maxItems` keeps the first crumb and the last `maxItems - 1`; the button in between reveals the rest and moves focus to the first one it shows.",
			},
		},
	},
	args: { items: LONG, maxItems: 3 },
};

export const WithIcons: Story = {
	args: {
		items: [
			{ label: "Home", href: "#home", icon: <Icon name="home" size="sm" /> },
			{ label: "Runs", href: "#runs", icon: <Icon name="runs" size="sm" /> },
			{ label: "Run 4182" },
		],
	},
};

function ActionsDemo() {
	const [last, setLast] = useState("nothing yet");
	return (
		<Column>
			<Breadcrumb
				items={[
					{ label: "Invoices", onClick: () => setLast("Invoices") },
					{ label: "2026", onClick: () => setLast("2026") },
					{ label: "October" },
				]}
			/>
			<Note>Clicked: {last}</Note>
		</Column>
	);
}

export const WithActions: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"A crumb with `onClick` and no `href` is a button, for in-app navigation that isn't a URL. The last crumb is the current page.",
			},
		},
	},
	render: () => <ActionsDemo />,
};
