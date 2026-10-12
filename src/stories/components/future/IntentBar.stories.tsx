import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { Button } from "../../../components/core/Button";
import { IntentBar } from "../../../components/future/IntentBar";
import { Column, Note } from "../Story";

const READING = [
	{ key: "action", label: "Action", value: "Pause", options: ["Pause", "Archive", "Notify owner"] },
	{
		key: "target",
		label: "Target",
		value: "Runners · eu-west",
		options: ["Runners · eu-west", "Runners · all", "Runs · eu-west"],
	},
	{
		key: "where",
		label: "Where",
		value: "failure rate > 5%",
		options: ["failure rate > 5%", "failure rate > 2%", "no runs"],
	},
	{
		key: "range",
		label: "Range",
		value: "this week",
		options: ["this week", "last 30d", "all time"],
	},
];
const TEXT = "pause eu-west runners failing over 5% this week";
const SUGGESTIONS = [
	"what failed this week",
	"draft release notes from the last 5 runs",
	"move Pro workspaces to the new webhook",
];
const summary = (
	<>
		Matches <strong>3 runners</strong> · 41 queued runs keep their place
	</>
);
const actions = (verb = "Pause") => (
	<>
		<Button size="sm" variant="ghost">
			Preview
		</Button>
		<Button size="sm" arrow>
			{verb} 3 runners
		</Button>
	</>
);

const meta = {
	title: "Components/Agent & trust/IntentBar",
	component: IntentBar,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		defaultValue: TEXT,
		status: "read",
		chips: READING,
		summary,
		actions: actions(),
		suggestions: SUGGESTIONS,
	},
	argTypes: {
		summary: { control: false },
		actions: { control: false },
		onChange: { control: false },
		onSubmit: { control: false },
		onChipChange: { control: false },
	},
	decorators: [
		(Story) => (
			<Column wide>
				<Story />
			</Column>
		),
	],
} satisfies Meta<typeof IntentBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Idle: Story = {
	parameters: {
		docs: { description: { story: "Before anything is read, suggestions fill the field." } },
	},
	args: { defaultValue: "", status: "idle", chips: [] },
};

export const Reading: Story = {
	parameters: {
		docs: {
			description: { story: '`status="reading"` shows skeleton chips while you parse the text.' },
		},
	},
	args: { status: "reading", chips: [] },
};

export const Read: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Chips with two or more `options` open a menu; the footer shows `summary` and `actions`.",
			},
		},
	},
	args: { status: "read" },
};

function IntentDemo() {
	const [status, setStatus] = useState<"idle" | "reading" | "read">("idle");
	const [chips, setChips] = useState(READING);
	const [text, setText] = useState(TEXT);
	useEffect(() => {
		if (status !== "reading") return;
		const t = setTimeout(() => setStatus("read"), 700);
		return () => clearTimeout(t);
	}, [status]);
	return (
		<>
			<IntentBar
				value={text}
				onChange={(t) => {
					setText(t);
					setStatus("idle");
				}}
				onSubmit={() => setStatus("reading")}
				status={status}
				chips={chips}
				onChipChange={(key, value) =>
					setChips((cs) => cs.map((c) => (c.key === key ? { ...c, value } : c)))
				}
				summary={summary}
				actions={actions(chips[0]?.value)}
				suggestions={SUGGESTIONS}
			/>
			<Note>Press Enter or Read; change a chip and the primary action follows it.</Note>
		</>
	);
}

export const Interactive: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Controlled: the caller owns the text, the status and the chips (here a 700ms fake read).",
			},
		},
	},
	render: () => <IntentDemo />,
};
