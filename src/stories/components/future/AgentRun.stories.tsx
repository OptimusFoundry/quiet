import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { Button } from "../../../components/core/Button";
import { AgentRun, type AgentRunProps } from "../../../components/future/AgentRun";
import { Column, Note } from "../Story";

const STEPS = [
	{ label: "Read 42 open invoices", tool: "billing.db", duration: "0.4s" },
	{ label: "Match payments from the bank feed", tool: "ledger", duration: "1.1s" },
	{ label: "Flag 3 that don't reconcile", tool: "filter", duration: "0.1s" },
	{ label: "Draft notes to the account owners", tool: "runner-07", duration: "2.3s" },
	{ label: "Waiting for your approval", tool: "you" },
];

const meta = {
	title: "Components/Agent & trust/AgentRun",
	component: AgentRun,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		title: "Reconciling October invoices",
		meta: "runner-07 · started 4s ago",
		steps: STEPS,
		current: 2,
		status: "running",
	},
	argTypes: {
		title: { control: "text" },
		meta: { control: "text" },
		steps: { control: false },
		actions: { control: false },
		onPause: { control: false },
		onResume: { control: false },
		onTakeOver: { control: false },
		onStop: { control: false },
		status: { control: "inline-radio", options: ["running", "paused", "stopped", "done"] },
		current: { control: { type: "number", min: 0, max: STEPS.length - 1 } },
	},
	render: (args) => (
		<Column wide>
			<AgentRun {...args} />
		</Column>
	),
} satisfies Meta<typeof AgentRun>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

type RunStatus = NonNullable<AgentRunProps["status"]>;

function LiveRun() {
	const [current, setCurrent] = useState(0);
	const [status, setStatus] = useState<RunStatus>("running");
	useEffect(() => {
		if (status !== "running" || current >= STEPS.length - 1) return;
		const t = setTimeout(() => setCurrent((i) => i + 1), 1300);
		return () => clearTimeout(t);
	}, [current, status]);
	const restart = () => {
		setCurrent(0);
		setStatus("running");
	};
	return (
		<Column wide>
			<AgentRun
				title="Reconciling October invoices"
				meta="runner-07 · started 4s ago"
				steps={STEPS}
				current={current}
				status={status}
				onPause={() => setStatus("paused")}
				onResume={() => setStatus("running")}
				onTakeOver={() => setStatus("paused")}
				onStop={() => setStatus("stopped")}
				actions={
					<>
						<Button size="sm">Review 3 notes</Button>
						<Button size="sm" variant="ghost" onClick={restart}>
							Discard
						</Button>
					</>
				}
			/>
			<Note>Controlled: the story advances `current` every 1.3s. Pause, take over or stop it.</Note>
		</Column>
	);
}

export const Live: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Each control renders only when its handler is given. At the human step the marker takes the accent and `actions` appear.",
			},
		},
	},
	render: () => <LiveRun />,
};

export const WaitingForYou: Story = {
	args: {
		current: STEPS.length - 1,
		actions: (
			<>
				<Button size="sm">Review 3 notes</Button>
				<Button size="sm" variant="ghost">
					Discard
				</Button>
			</>
		),
	},
};

export const Paused: Story = {
	args: {
		title: "Rendering release artifacts",
		meta: "runner-02 · 2 of 4",
		status: "paused",
		onResume: () => {},
	},
};

export const Stopped: Story = {
	args: {
		title: "Researching vendor pricing",
		meta: "runner-11 · hit its $40 budget",
		current: 1,
		status: "stopped",
	},
};

export const Done: Story = {
	args: { status: "done", meta: "runner-07 · finished in 3.9s" },
};
