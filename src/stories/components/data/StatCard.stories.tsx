import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../../components/core/Button";
import { StatCard } from "../../../components/data/StatCard";
import { Column, Note, Row } from "../Story";
import "./StatCard.scss";

const meta = {
	title: "Components/Data/StatCard",
	component: StatCard,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		label: "Runs this month",
		value: 1204,
		delta: 12,
		period: "vs last month",
		variant: "filled",
		animate: false,
	},
	argTypes: {
		label: { control: "text" },
		value: { control: "number" },
		delta: { control: "number" },
		period: { control: "text" },
		icon: { control: "text" },
		format: { control: false },
		onClick: { control: false },
	},
} satisfies Meta<typeof StatCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	decorators: [
		(Story) => (
			<div className="q-sb-stat-card q-sb-stat-card--one">
				<Story />
			</div>
		),
	],
};

export const Variants: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Filled on the warm ground (default), outlined in a hairline frame, plain with none.",
			},
		},
	},
	render: () => (
		<div className="q-sb-stat-card">
			<StatCard label="Filled" value={1204} delta={12} period="vs last month" />
			<StatCard
				variant="outlined"
				label="Outlined"
				value={1204}
				delta={12}
				period="vs last month"
			/>
			<StatCard variant="plain" label="Plain" value={1204} delta={12} period="vs last month" />
		</div>
	),
};

export const Trends: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Direction is an arrow and words for screen readers, never a colour. A number is a percent; a string shows as-is.",
			},
		},
	},
	render: () => (
		<div className="q-sb-stat-card">
			<StatCard label="Spend" value="$13.2k" delta={8.4} period="vs last month" icon="billing" />
			<StatCard label="Failed runs" value="2.1%" delta={-0.6} period="vs last month" />
			<StatCard label="Active runners" value={18} delta={0} previousValue={18} />
			<StatCard label="Approvals waiting" value={37} delta="-4" period="this week" />
		</div>
	),
};

export const Interactive: Story = {
	parameters: {
		docs: {
			description: {
				story: "`href` or `onClick` makes the card a link or button that deepens on hover.",
			},
		},
	},
	render: () => (
		<div className="q-sb-stat-card">
			<StatCard
				href="#stat-card"
				label="Open invoices"
				value={14}
				delta="+3"
				period="since Monday"
				icon="billing"
			/>
			<StatCard
				variant="outlined"
				onClick={() => {}}
				label="Artifacts"
				value={862}
				delta={4}
				icon="file"
			/>
		</div>
	),
};

function AnimatedDemo() {
	const [value, setValue] = useState(1204);
	return (
		<Column>
			<StatCard animate label="Runs this month" value={value} delta={12} period="vs last month" />
			<Row>
				<Button size="sm" variant="secondary" onClick={() => setValue((v) => v + 137)}>
					Add 137 runs
				</Button>
			</Row>
			<Note>Counts up on mount; later changes ease from the old value. Reduced motion jumps.</Note>
		</Column>
	);
}

export const Animated: Story = { render: () => <AnimatedDemo /> };
