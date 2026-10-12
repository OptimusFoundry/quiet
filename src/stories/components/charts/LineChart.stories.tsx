import type { Meta, StoryObj } from "@storybook/react-vite";
import { LineChart } from "../../../components/charts/LineChart";
import { Column, Note } from "../Story";
import { DAYS, LAST_MONTH, RUNS, usd } from "./fixtures";

const meta = {
	title: "Components/Charts/LineChart",
	component: LineChart,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		title: "Completed runs · September",
		labels: DAYS,
		series: [
			{ name: "This month", data: RUNS },
			{ name: "Last month", data: LAST_MONTH },
		],
		area: true,
		height: 240,
	},
	argTypes: {
		title: { control: "text" },
		formatValue: { control: false },
		formatLabel: { control: false },
	},
	decorators: [
		(Story) => (
			<Column wide>
				<Story />
			</Column>
		),
	],
} satisfies Meta<typeof LineChart>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Keyboard: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"The plot is a slider over the x points: hover, or Tab in and use the arrow keys, Home/End and PageUp/PageDown.",
			},
		},
	},
	render: (args) => (
		<Column wide>
			<LineChart {...args} />
			<Note>The crosshair moves the same way for pointer and keys; values are announced.</Note>
		</Column>
	),
};

export const FourSeries: Story = {
	parameters: {
		docs: {
			description: {
				story: "Series 1 is the accent, comparisons ink then greys; series 4 and 5 also dash.",
			},
		},
	},
	args: {
		title: "Weekly runs by plan",
		height: 200,
		area: false,
		labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
		series: [
			{ name: "Pro", data: [320, 340, 365, 390, 402, 431, 455, 470] },
			{ name: "Team", data: [210, 214, 230, 228, 240, 251, 249, 262] },
			{ name: "Starter", data: [150, 160, 158, 170, 176, 171, 182, 190] },
			{ name: "Trial", data: [90, 120, 104, 98, 130, 112, 125, 118] },
		],
	},
};

export const ReferenceLine: Story = {
	parameters: { docs: { description: { story: "A target or limit drawn across the plot." } } },
	args: {
		series: [{ name: "Completed runs", data: RUNS }],
		reference: { value: 150, label: "Target 150/day" },
	},
};

export const Highlight: Story = {
	parameters: {
		docs: {
			description: {
				story: "Mark one point (`highlight.index`) or a stretch (`highlight.range`).",
			},
		},
	},
	args: {
		series: [{ name: "Completed runs", data: RUNS }],
		highlight: { range: [9, 13] },
	},
};

export const GapsAndFormatting: Story = {
	parameters: {
		docs: {
			description: {
				story: "`null` breaks the line; `formatValue` formats axis ticks and tooltip values.",
			},
		},
	},
	args: {
		title: "Agent spend per day",
		area: false,
		zero: true,
		labels: DAYS.slice(0, 12),
		series: [
			{
				name: "Spend",
				data: [820, 910, 880, null, null, 1040, 1120, 990, 1210, 1340, 1280, 1420],
			},
		],
		formatValue: usd,
	},
};
