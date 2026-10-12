import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { Button } from "../../../components/core/Button";
import { BudgetLeash } from "../../../components/future/BudgetLeash";
import { Column, Note, Row } from "../Story";

const meta = {
	title: "Components/Agent & trust/BudgetLeash",
	component: BudgetLeash,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		label: "runner-11 · vendor research",
		agent: "runner-11",
		spent: 8.4,
		cap: 40,
		atCap: "asks before spending more",
	},
	argTypes: {
		agent: { control: "text" },
		spent: { control: { type: "range", min: 0, max: 80, step: 0.1 } },
		format: { control: false },
		onCapChange: { control: false },
		speeds: { control: false },
	},
	render: (args) => (
		<Column wide>
			<BudgetLeash {...args} />
		</Column>
	),
} satisfies Meta<typeof BudgetLeash>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tension: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Slack while there is room; slowing past `slowAt`; taut and accented past `crawlAt`; stopped at the cap.",
			},
		},
	},
	render: (args) => (
		<Column wide>
			<BudgetLeash {...args} label="runner-11 · full speed" spent={8.4} />
			<BudgetLeash {...args} label="runner-11 · slowing" spent={27} />
			<BudgetLeash {...args} label="runner-11 · crawling" spent={36} />
			<BudgetLeash {...args} label="runner-11 · at the leash" spent={40} />
		</Column>
	),
};

function LiveLeash() {
	const [cap, setCap] = useState(40);
	const [spent, setSpent] = useState(8.4);
	const [running, setRunning] = useState(false);
	useEffect(() => {
		if (!running) return;
		const t = setInterval(() => setSpent((s) => Math.min(cap, +(s + 1.9).toFixed(2))), 500);
		return () => clearInterval(t);
	}, [running, cap]);
	return (
		<Column wide>
			<BudgetLeash
				label="runner-11 · vendor research"
				agent="runner-11"
				spent={spent}
				cap={cap}
				onCapChange={setCap}
				presets={[20, 40, 80]}
				slack={10}
				atCap="asks before spending more"
			/>
			<Row>
				<Button size="sm" variant="secondary" onClick={() => setRunning((r) => !r)}>
					{running ? "Pause spending" : "Let it spend"}
				</Button>
				<Button
					size="sm"
					variant="ghost"
					onClick={() => {
						setRunning(false);
						setSpent(8.4);
					}}
				>
					Reset
				</Button>
			</Row>
			<Note>
				The caller owns the cap: presets and “Give slack” (shown with `slack` + `onCapChange`) call
				`onCapChange`.
			</Note>
		</Column>
	);
}

export const Live: Story = { render: () => <LiveLeash /> };

export const CustomFormat: Story = {
	parameters: {
		docs: { description: { story: "`format` and `speeds` for budgets that aren't dollars." } },
	},
	args: {
		label: "runner-04 · reindexing",
		agent: "runner-04",
		spent: 41000,
		cap: 50000,
		format: (v) => `${Math.round(v / 1000)}k tokens`,
		speeds: ["full speed", "pacing itself", "nearly out", "out of tokens"],
		atCap: "stops and reports",
	},
};
