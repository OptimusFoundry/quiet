import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { CostMeter } from "../../../components/future/CostMeter";
import { Column, Note } from "../Story";

const ITEMS = [
	{ label: "Reconciling invoices", value: 2.4, cap: 4 },
	{ label: "Drafting customer notes", value: 1.1, cap: 3 },
	{ label: "Building release artifacts", value: 6.8, cap: 8 },
];

const meta = {
	title: "Components/Agent & trust/CostMeter",
	component: CostMeter,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { label: "Runners · today", items: ITEMS, budget: 20 },
	argTypes: {
		label: { control: "text" },
		items: { control: false },
		format: { control: false },
		warnAt: { control: { type: "range", min: 0.5, max: 1, step: 0.05 } },
	},
	render: (args) => (
		<Column wide>
			<CostMeter {...args} />
		</Column>
	),
} satisfies Meta<typeof CostMeter>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const NearingCaps: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"A line at or past `warnAt` of its cap takes the accent; so does the budget when the total nears it.",
			},
		},
	},
	args: {
		items: [
			{ label: "Reconciling invoices", value: 3.8, cap: 4 },
			{ label: "Drafting customer notes", value: 1.1, cap: 3 },
			{ label: "Building release artifacts", value: 13.2, cap: 12 },
		],
	},
};

export const WithoutCaps: Story = {
	parameters: {
		docs: {
			description: {
				story: "Omit `cap` on a line for no bar; omit `budget` to show the total alone.",
			},
		},
	},
	args: {
		label: "Runners · this week",
		budget: undefined,
		items: [
			{ label: "Research", value: 41.2 },
			{ label: "Exports", value: 12.75 },
		],
	},
};

function TickingMeter() {
	const [t, setT] = useState(0);
	useEffect(() => {
		const id = setInterval(() => setT((x) => (x < 40 ? x + 1 : x)), 900);
		return () => clearInterval(id);
	}, []);
	return (
		<Column wide>
			<CostMeter
				label="Runners · today"
				budget={20}
				items={[
					{ label: "Reconciling invoices", value: 2.4 + t * 0.03, cap: 4 },
					{ label: "Drafting customer notes", value: 1.1 + t * 0.012, cap: 3 },
					{ label: "Building release artifacts", value: 6.8 + t * 0.09, cap: 8 },
				]}
			/>
			<Note>Spend ticks every 0.9s; the artifact builds reach their cap first.</Note>
		</Column>
	);
}

export const Live: Story = { render: () => <TickingMeter /> };

export const Monthly: Story = {
	args: {
		label: "Northwind · October",
		period: "monthly",
		budget: 500,
		format: (v) => `€${v.toFixed(0)}`,
		items: [
			{ label: "Invoice runs", value: 182, cap: 250 },
			{ label: "Support drafts", value: 96, cap: 150 },
		],
	},
};
