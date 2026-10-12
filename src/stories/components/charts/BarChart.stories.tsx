import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart } from "../../../components/charts/BarChart";
import { Column } from "../Story";
import { usd } from "./fixtures";

const meta = {
	title: "Components/Charts/BarChart",
	component: BarChart,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		title: "Runs by trigger",
		categories: ["Q1", "Q2", "Q3", "Q4"],
		series: [
			{ name: "Scheduled", data: [420, 510, 640, 720] },
			{ name: "Manual", data: [180, 240, 260, 310] },
			{ name: "Webhook", data: [90, 120, 80, 140] },
		],
		orientation: "vertical",
		stacked: false,
		valueLabels: false,
	},
	argTypes: {
		title: { control: "text" },
		formatValue: { control: false },
	},
	decorators: [
		(Story) => (
			<Column wide>
				<Story />
			</Column>
		),
	],
} satisfies Meta<typeof BarChart>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Grouped: Story = {
	parameters: {
		docs: {
			description: {
				story: "Grouped to compare. Tab in once, then arrows move between bars.",
			},
		},
	},
};

export const Stacked: Story = {
	parameters: { docs: { description: { story: "Stacked to total; value labels print totals." } } },
	args: { stacked: true, valueLabels: true },
};

export const HorizontalStacked: Story = {
	parameters: {
		docs: { description: { story: "Horizontal for long category names; sizes to its rows." } },
	},
	args: {
		title: "Agent spend by workspace",
		orientation: "horizontal",
		stacked: true,
		valueLabels: true,
		formatValue: usd,
		categories: ["Billing ops", "Support triage", "Research", "Release notes"],
		series: [
			{ name: "Replying", data: [240, 80, 30, 120] },
			{ name: "Drafting", data: [110, 140, 60, 40] },
			{ name: "Rendering", data: [20, 400, 0, 60] },
		],
	},
};

export const SingleSeries: Story = {
	parameters: { docs: { description: { story: "One series: all accent, no legend." } } },
	args: {
		title: "Approvals waiting, by day",
		categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],
		series: [{ name: "Approvals", data: [12, 18, 9, 22, 14] }],
		valueLabels: true,
		height: 200,
	},
};
