import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Transcript, type TranscriptSession } from "../../../components/app/Transcript";
import { Button } from "../../../components/core/Button";
import { Column, Note, Row } from "../Story";

// The read-back of agentworks run 233f76c2 (trigger web-message, runner Orca). Session 1 is the
// first greeting, 2 hits a failing tool and a restart, 3 is empty, 4 is the latest.

const ME = "Shubhanshu Aarsay";

const CAPABILITIES = `Hi Shubhanshu! I can help with this project in a few ways:

- Search and read the project's **artifacts** and past runs
- Draft replies and post them to Slack with \`slack.send_message\`
- Open pull requests on the linked repository
- Summarise a run's cost and token use

What would you like to start with?`;

const SESSIONS: TranscriptSession[] = [
	{
		id: "s1",
		startedAt: "Oct 9, 14:02",
		items: [
			{ kind: "message", role: "user", author: ME, channel: "chat", at: "14:02", content: "Hi" },
			{
				kind: "tool",
				name: "ToolSearch",
				input: { query: "project capabilities", limit: 5 },
				output: ["artifacts.search", "runs.list", "slack.send_message", "github.open_pr"],
				duration: 412,
			},
			{
				kind: "message",
				role: "assistant",
				author: "Assistant",
				at: "14:02",
				content: CAPABILITIES,
			},
		],
	},
	{
		id: "s2",
		startedAt: "Oct 9, 14:10",
		items: [
			{ kind: "message", role: "user", author: ME, channel: "chat", at: "14:10", content: "hello" },
			{
				kind: "message",
				role: "user",
				author: ME,
				channel: "chat",
				at: "14:10",
				content: "can you post the weekly digest to #support?",
			},
			{
				kind: "tool",
				name: "ToolSearch",
				input: { query: "slack send message" },
				output: ["slack.send_message"],
				duration: 388,
			},
			{
				kind: "tool",
				name: "slack.send_message",
				input: { channel: "#support", text: "Weekly digest: 12 runs, $4.21" },
				output: "not_in_channel: the bot is not a member of #support",
				status: "error",
				duration: "1.3s",
			},
			{
				kind: "message",
				role: "assistant",
				author: "Assistant",
				at: "14:11",
				content:
					"I couldn't post to #support: the bot isn't a member of that channel. Invite it with `/invite @agentworks` and ask me again.",
			},
			{ kind: "event", label: "Run restarted", at: "14:14" },
		],
	},
	{ id: "s3", startedAt: "Oct 9, 14:14", items: [] },
	{
		id: "s4",
		startedAt: "Oct 9, 14:20",
		items: [
			{
				kind: "message",
				role: "user",
				author: ME,
				channel: "chat",
				at: "14:20",
				content: "try again",
			},
			{
				kind: "tool",
				name: "slack.send_message",
				input: { channel: "#support", text: "Weekly digest: 12 runs, $4.21" },
				output: { ok: true, ts: "1728483612.004100" },
				duration: "0.9s",
			},
			{
				kind: "message",
				role: "assistant",
				author: "Assistant",
				at: "14:20",
				content: `Posted the digest to #support. The message I sent:

\`\`\`md
Weekly digest: 12 runs, $4.21
\`\`\`

This run cost $0.902049 so far.`,
			},
			{
				kind: "tool",
				name: "runs.list",
				input: { project: "support-digest", since: "7d" },
				status: "running",
			},
		],
	},
];

const meta = {
	title: "Components/App/Transcript",
	component: Transcript,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	decorators: [
		(Story) => (
			<Column wide>
				<Story />
			</Column>
		),
	],
	args: { sessions: SESSIONS, defaultOpen: "latest", headingLevel: 3 },
	argTypes: {
		sessions: { control: false },
		open: { control: false },
		onOpenChange: { control: false },
		emptyLabel: { control: "text" },
	},
} satisfies Meta<typeof Transcript>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Run 233f76c2: the latest session open, earlier ones folded to a summary. Session 2 has a failed tool call and a restart; session 3 is empty. ↑/↓ move between session headings.",
			},
		},
	},
};

export const AllOpen: Story = {
	parameters: { docs: { description: { story: '`defaultOpen="all"` and custom labels.' } } },
	args: {
		sessions: SESSIONS.map((s, i) => ({ ...s, label: `Attempt ${i + 1}` })),
		defaultOpen: "all",
	},
};

function ControlledDemo() {
	const [open, setOpen] = useState<string[]>([]);
	return (
		<Column wide>
			<Row>
				<Button size="sm" variant="secondary" onClick={() => setOpen(SESSIONS.map((s) => s.id))}>
					Open all
				</Button>
				<Button size="sm" variant="ghost" onClick={() => setOpen([])}>
					Fold all
				</Button>
			</Row>
			<Transcript sessions={SESSIONS} open={open} onOpenChange={setOpen} />
			<Note>Open: {open.length ? open.join(", ") : "none"}</Note>
		</Column>
	);
}

export const Controlled: Story = {
	parameters: {
		docs: {
			description: { story: "`open` + `onOpenChange`: the app owns which sessions are open." },
		},
	},
	render: () => <ControlledDemo />,
};

export const SingleSession: Story = {
	args: { sessions: SESSIONS.slice(3) },
};

export const EmptySession: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"A session with no items is a plain heading that says so; `emptyLabel` sets the words.",
			},
		},
	},
	args: {
		sessions: [{ id: "s1", startedAt: "Oct 9, 14:14", items: [] }],
		emptyLabel: "No messages yet",
	},
};
