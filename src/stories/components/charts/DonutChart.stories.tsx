import type { Meta, StoryObj } from "@storybook/react-vite";
import { DonutChart } from "../../../components/charts/DonutChart";
import { Row } from "../Story";
import { usd } from "./fixtures";

const PLANS = [
	{ label: "Pro", value: 9400 },
	{ label: "Team", value: 2600 },
	{ label: "Starter", value: 900 },
	{ label: "Add-ons", value: 300 },
];

const meta = {
	title: "Components/Charts/DonutChart",
	component: DonutChart,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { title: "Invoiced by plan", data: PLANS, formatValue: usd },
	argTypes: {
		title: { control: "text" },
		centerLabel: { control: "text" },
		centerValue: { control: "text" },
		formatValue: { control: false },
	},
} satisfies Meta<typeof DonutChart>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ShareOfTotal: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Largest share in the accent. Hover or focus a segment (Tab in, then arrows) and the centre shows its share.",
			},
		},
	},
	args: {
		title: "Runs by runner",
		formatValue: undefined,
		data: [
			{ label: "Hosted", value: 3120 },
			{ label: "Self-hosted", value: 1240 },
			{ label: "Local", value: 452 },
		],
	},
};

export const CenterAndSize: Story = {
	parameters: {
		docs: { description: { story: "`centerLabel`/`centerValue` replace the total; size scales." } },
	},
	render: () => (
		<Row>
			<DonutChart
				size={140}
				thickness={14}
				legend={false}
				aria-label="Approvals"
				centerLabel="Approved"
				centerValue="82%"
				data={[
					{ label: "Approved", value: 82 },
					{ label: "Rejected", value: 11 },
					{ label: "Waiting", value: 7 },
				]}
			/>
			<DonutChart size={200} data={PLANS} formatValue={usd} aria-label="Invoiced by plan" />
		</Row>
	),
};

export const Unsorted: Story = {
	parameters: {
		docs: {
			description: {
				story: "`sort={false}` keeps your order (and colour) when order means something.",
			},
		},
	},
	args: {
		title: "Runs by status",
		sort: false,
		formatValue: undefined,
		data: [
			{ label: "Succeeded", value: 412 },
			{ label: "Failed", value: 38 },
			{ label: "Cancelled", value: 12 },
		],
	},
};
