import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Avatar } from "../../../components/core/Avatar";
import { Button } from "../../../components/core/Button";
import { RunScrubber } from "../../../components/future/RunScrubber";
import { Column, Note } from "../Story";

const agent = <Avatar name="Meerkat" size="sm" shape="square" />;

const RUN = [
	{
		label: "Read 14 runners",
		detail: "I'll check failures over 7 days; that's the rule from August.",
	},
	{ label: "Compute rates", detail: "Three are over 5%. eu-west-2 is 7.9%, unusually high." },
	{
		label: "Look at eu-west-2",
		detail: "212 of 268 failures are image pulls. That's a registry problem, not the jobs.",
	},
	{
		label: "Decide",
		detail: "Pausing all three is the rule, but eu-west-2 might just need a mirror. I'll ask.",
	},
	{ label: "Ask you", detail: "Question posted. Holding 3 runs." },
];

const meta = {
	title: "Components/Agent & trust/RunScrubber",
	component: RunScrubber,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { steps: RUN, defaultValue: 2, label: "Meerkat's run", agent },
	argTypes: {
		steps: { control: false },
		agent: { control: false },
		caption: { control: false },
		actions: { control: false },
		onChange: { control: false },
	},
	decorators: [
		(Story) => (
			<Column wide>
				<Story />
			</Column>
		),
	],
} satisfies Meta<typeof RunScrubber>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithActions: Story = {
	parameters: {
		docs: {
			description: {
				story: "`actions` as a function gets the current step, so Branch can name it.",
			},
		},
	},
	args: {
		caption: (i) => `Step ${i + 1} · what it was thinking`,
		actions: (i) => (
			<>
				<Button size="sm" variant="secondary">
					Branch from step {i + 1}
				</Button>
				<Button size="sm" variant="ghost">
					Correct this thought
				</Button>
			</>
		),
	},
};

function ControlledDemo() {
	const [step, setStep] = useState(0);
	return (
		<>
			<RunScrubber
				steps={RUN}
				value={step}
				onChange={setStep}
				label="Meerkat's run"
				agent={agent}
			/>
			<Note>
				Step {step + 1} of {RUN.length}. Arrows, Home/End, PageUp/PageDown, or drag.
			</Note>
		</>
	);
}

export const Controlled: Story = { render: () => <ControlledDemo /> };

export const ShortRun: Story = {
	args: { steps: RUN.slice(0, 2), defaultValue: 1, agent: undefined },
};
