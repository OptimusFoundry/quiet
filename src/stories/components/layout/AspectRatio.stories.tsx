import type { Meta, StoryObj } from "@storybook/react-vite";
import { AspectRatio } from "../../../components/layout/AspectRatio";
import { Grid } from "../../../components/layout/Grid";
import { Column } from "../Story";

const meta = {
	title: "Components/Layout/AspectRatio",
	component: AspectRatio,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { ratio: "video" },
	argTypes: {
		ratio: {
			control: "select",
			options: ["square", "video", "portrait", "wide", "photo"],
		},
		label: { control: "text" },
		children: { control: false },
	},
	render: (args) => (
		<Column>
			<AspectRatio {...args} />
		</Column>
	),
} satisfies Meta<typeof AspectRatio>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Presets: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Empty, a frame is a placeholder on the warm ground, labelled with its preset and ratio.",
			},
		},
	},
	render: () => (
		<Grid columns={5} gap="sm" align="start">
			{(["square", "video", "portrait", "wide", "photo"] as const).map((ratio) => (
				<AspectRatio key={ratio} ratio={ratio} />
			))}
		</Grid>
	),
};

export const CustomRatioAndLabel: Story = {
	parameters: {
		docs: {
			description: {
				story: "A number is width over height. `label` names the placeholder for what goes there.",
			},
		},
	},
	args: { ratio: 2.35, label: "Run replay" },
};

const CHART = `data:image/svg+xml,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90"><rect width="160" height="90" fill="#f4f1ec"/><polyline points="0,70 30,58 60,62 90,40 120,44 160,20" fill="none" stroke="#e5531a" stroke-width="2"/></svg>',
)}`;

export const WithMedia: Story = {
	parameters: {
		docs: {
			description: { story: "An `img` or `video` child covers the frame, cropped to the ratio." },
		},
	},
	render: () => (
		<Column>
			<AspectRatio ratio="video">
				<img src={CHART} alt="Runs per day, rising over the week" />
			</AspectRatio>
		</Column>
	),
};
