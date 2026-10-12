import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Transcript, type TranscriptSession } from "../../components/app/Transcript";
import "./Transcript.scss";

// App/Transcript: the read-back of agentworks run 233f76c2 (trigger web-message, runner Orca).
// Session 1 is the first greeting, 2 hits a failing tool and a restart, 3 is empty, 4 is the latest.

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

function Block({ id, label, children }: { id: string; label: string; children: ReactNode }) {
	return (
		<section id={id} className="q-sb-transcript__block" aria-labelledby={`${id}-label`}>
			<h2 id={`${id}-label`} className="q-sb-transcript__label">
				{label}
			</h2>
			{children}
		</section>
	);
}

function TranscriptPage() {
	return (
		<main className="q-sb-transcript">
			<h1 className="q-sb-transcript__title">Transcript</h1>
			<Block id="latest" label="Run 233f76c2: latest session open, earlier ones folded">
				<Transcript sessions={SESSIONS} />
			</Block>
			<Block id="all" label="All sessions open, custom labels">
				<Transcript
					sessions={SESSIONS.map((s, i) => ({ ...s, label: `Attempt ${i + 1}` }))}
					defaultOpen="all"
				/>
			</Block>
		</main>
	);
}

const meta: Meta = {
	title: "App/Transcript",
	parameters: { layout: "fullscreen", density: "app" },
};
export default meta;
export const All: StoryObj = { render: () => <TranscriptPage /> };
