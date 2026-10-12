import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Badge } from "../../../components/core/Badge";
import { Button } from "../../../components/core/Button";
import { Icon } from "../../../components/core/Icon";
import { Note, Row } from "../Story";

const meta = {
	title: "Components/Core/Badge",
	component: Badge,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { children: "Draft", variant: "default", size: "md" },
	argTypes: {
		leftIcon: { control: false },
		rightIcon: { control: false },
		ref: { table: { disable: true } },
	},
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
	render: () => (
		<Row>
			<Badge>Draft</Badge>
			<Badge variant="primary">New</Badge>
			<Badge variant="secondary">Internal</Badge>
			<Badge variant="outline">Beta</Badge>
		</Row>
	),
};

export const Status: Story = {
	parameters: {
		docs: {
			description: {
				story: "Status reads through the dot (solid, hollow, accent), not a colour fill.",
			},
		},
	},
	render: () => (
		<Row>
			<Badge variant="success">Passed</Badge>
			<Badge variant="warning">Needs approval</Badge>
			<Badge variant="error">Failed</Badge>
			<Badge dot>Queued</Badge>
		</Row>
	),
};

export const Sizes: Story = {
	render: () => (
		<Row>
			<Badge size="sm">Small</Badge>
			<Badge size="md">Medium</Badge>
			<Badge size="lg">Large</Badge>
		</Row>
	),
};

export const WithIcons: Story = {
	render: () => (
		<Row>
			<Badge leftIcon={<Icon name="runs" />}>12 runs</Badge>
			<Badge variant="outline" rightIcon={<Icon name="arrow-up-right" />}>
				Docs
			</Badge>
		</Row>
	),
};

export const Counts: Story = {
	parameters: {
		docs: { description: { story: "`count` collapses to `max+` past `max` (99 by default)." } },
	},
	render: () => (
		<Row>
			<Badge count={3} />
			<Badge count={42} variant="primary" />
			<Badge count={128} />
			<Badge count={12} max={9} />
		</Row>
	),
};

function LiveCountDemo() {
	const [count, setCount] = useState(4);
	return (
		<>
			<Row>
				<Badge count={count} variant="primary" />
				<Button variant="secondary" size="sm" onClick={() => setCount((c) => c + 1)}>
					New approval
				</Button>
			</Row>
			<Note>A changed count rises in softly; the first render stays still.</Note>
		</>
	);
}

export const LiveCount: Story = { render: () => <LiveCountDemo /> };
