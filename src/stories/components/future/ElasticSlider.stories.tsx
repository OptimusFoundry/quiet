import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ElasticSlider } from "../../../components/future/ElasticSlider";
import { Column, Note } from "../Story";

const perDay = (n: number) => `${(n * 100).toLocaleString("en")} runs / day`;

const meta = {
	title: "Components/Agent & trust/ElasticSlider",
	component: ElasticSlider,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		label: "Daily run limit",
		min: 0,
		max: 100,
		safe: 60,
		defaultValue: 40,
		formatValue: perDay,
		hint: "Safe up to 6,000 a day on this workspace's plan.",
		overHint: "Past the plan's safe line. The overage is yours to answer for.",
	},
	argTypes: {
		label: { control: "text" },
		hint: { control: "text" },
		overHint: { control: "text" },
		overrideLabel: { control: "text" },
		overrideOnLabel: { control: "text" },
		formatValue: { control: false },
		onChange: { control: false },
		onOverrideChange: { control: false },
	},
	render: (args) => (
		<Column wide>
			<ElasticSlider {...args} />
		</Column>
	),
} satisfies Meta<typeof ElasticSlider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Drag past the safe line: the thumb stretches and springs back. The keyboard stops at the line until the override is held.",
			},
		},
	},
};

export const OverrideHeld: Story = {
	args: { defaultOverride: true, defaultValue: 82 },
};

export const NoSafeLine: Story = {
	parameters: {
		docs: { description: { story: "Without `safe` it is a plain slider with no resistance." } },
	},
	args: { safe: undefined, hint: undefined },
};

function ControlledLimit() {
	const [v, setV] = useState(40);
	const [held, setHeld] = useState(false);
	return (
		<Column wide>
			<ElasticSlider
				label="Daily run limit"
				min={0}
				max={100}
				safe={60}
				value={v}
				onChange={setV}
				override={held}
				onOverrideChange={setHeld}
				formatValue={perDay}
				hint="Safe up to 6,000 a day on this workspace's plan."
				overHint="Past the plan's safe line. The overage is yours to answer for."
			/>
			<Note>
				value {v}, override {held ? "held" : "off"}
			</Note>
		</Column>
	);
}

export const Controlled: Story = {
	parameters: {
		docs: { description: { story: "`value`/`onChange` and `override`/`onOverrideChange`." } },
	},
	render: () => <ControlledLimit />,
};

export const Disabled: Story = { args: { disabled: true } };
