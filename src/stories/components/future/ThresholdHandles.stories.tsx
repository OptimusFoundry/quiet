import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ThresholdHandles, type ThresholdValue } from "../../../components/future/ThresholdHandles";
import { Column, Note } from "../Story";

// 40 days of run failure rate (%), with a few spikes and a late drift.
const FAILURES = Array.from(
	{ length: 40 },
	(_, i) => 3 + Math.sin(i / 4) * 1.5 + (i % 9 === 0 ? 2.5 : 0) + (i > 30 ? 1.2 : 0),
);
const SPEND = FAILURES.map((v) => Math.round(v * 9));
const pct = (v: number) => `${v.toFixed(1)}%`;
const fired = (n: number, t: number) => `Would have fired ${n}× in ${t} days`;

const meta = {
	title: "Components/Agent & trust/ThresholdHandles",
	component: ThresholdHandles,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		label: "Failure rate · alert band",
		data: FAILURES,
		defaultValue: { low: 1.8, high: 5.5 },
		max: 8,
		formatValue: pct,
		summary: fired,
	},
	argTypes: {
		label: { control: "text" },
		data: { control: false },
		value: { control: false },
		defaultValue: { control: false },
		onChange: { control: false },
		formatValue: { control: false },
		summary: { control: false },
	},
	decorators: [
		(Story) => (
			<Column wide>
				<Story />
			</Column>
		),
	],
} satisfies Meta<typeof ThresholdHandles>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const HighOnly: Story = {
	parameters: {
		docs: { description: { story: "Omit `low` for a high-only alert (here, spend per day)." } },
	},
	args: {
		label: "Runner spend per day",
		data: SPEND,
		defaultValue: { high: 50 },
		max: undefined,
		step: 1,
		formatValue: (v) => `$${v}`,
	},
};

export const LowOnly: Story = {
	args: {
		label: "Successful runs per day",
		data: FAILURES.map((v) => Math.round(120 - v * 8)),
		defaultValue: { low: 80 },
		max: undefined,
		step: 1,
		formatValue: (v) => `${v}`,
	},
};

function ControlledDemo() {
	const [value, setValue] = useState<ThresholdValue>({ low: 2, high: 5 });
	return (
		<>
			<ThresholdHandles
				label="Failure rate · alert band"
				data={FAILURES}
				value={value}
				onChange={setValue}
				max={8}
				formatValue={pct}
				summary={fired}
			/>
			<Note>
				Saved rule: below {pct(value.low ?? 0)} or above {pct(value.high ?? 0)}. Each line is a
				vertical slider: arrows, PageUp/PageDown, Home/End.
			</Note>
		</>
	);
}

export const Controlled: Story = { render: () => <ControlledDemo /> };
