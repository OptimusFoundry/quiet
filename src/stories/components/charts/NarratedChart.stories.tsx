import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { NarratedChart } from "../../../components/charts/NarratedChart";
import { Column, Note } from "../Story";
import { DAYS, RUNS } from "./fixtures";

const BEATS = [
	{ text: "Quiet first week, around 50 runs a day.", range: [0, 6] as [number, number] },
	{ text: "Scheduled runs switched on the 10th: nearly doubled.", index: 9 },
	{ text: "Dip on the 13th when the hosted runners hit their quota.", index: 12 },
	{ text: "Recovered and climbing. Best day: 204.", index: 23 },
];

const meta = {
	title: "Components/Charts/NarratedChart",
	component: NarratedChart,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		title: "Completed runs · September",
		labels: DAYS,
		series: [{ name: "Completed runs", data: RUNS }],
		area: true,
		beats: BEATS,
	},
	argTypes: {
		title: { control: "text" },
		onBeatChange: { control: false },
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
} satisfies Meta<typeof NarratedChart>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Each sentence is a button that marks its point or stretch. One tab stop; arrows move between beats.",
			},
		},
	},
};

export const StartsOnABeat: Story = {
	parameters: { docs: { description: { story: "`defaultBeat` picks the sentence shown first." } } },
	args: { defaultBeat: 2 },
};

function Controlled() {
	const [beat, setBeat] = useState(1);
	return (
		<Column wide>
			<NarratedChart
				title="Completed runs · September"
				labels={DAYS}
				series={[{ name: "Completed runs", data: RUNS }]}
				area
				beats={BEATS}
				beat={beat}
				onBeatChange={setBeat}
			/>
			<Note>{`Beat ${beat + 1} of ${BEATS.length}, owned by the story (\`beat\` + \`onBeatChange\`).`}</Note>
		</Column>
	);
}

export const ControlledBeat: Story = { render: () => <Controlled /> };
