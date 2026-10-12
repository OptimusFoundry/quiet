import { Panel, Transcript } from "@optimusfoundry/quiet";

const ME = "Ada Park";

const SESSIONS = [
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
				content:
					"Hi Ada! I can help with this project in a few ways:\n\n- Search and read the project's **artifacts** and past runs\n- Draft replies and post them to Slack with `slack.send_message`\n- Summarise a run's cost and token use\n\nWhat would you like to start with?",
			},
		],
	},
	{
		id: "s2",
		startedAt: "Oct 9, 14:10",
		items: [
			{ kind: "message", role: "user", author: ME, channel: "chat", at: "14:10", content: "can you post the weekly digest to #support?" },
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
				content: "I couldn't post to #support: the bot isn't a member of that channel. Invite it with `/invite @agentworks` and ask me again.",
			},
			{ kind: "event", label: "Run restarted", at: "14:14" },
		],
	},
	{ id: "s3", startedAt: "Oct 9, 14:14", items: [] },
	{
		id: "s4",
		startedAt: "Oct 9, 14:20",
		items: [
			{ kind: "message", role: "user", author: ME, channel: "chat", at: "14:20", content: "try again" },
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
				content: "Posted the digest to #support. This run cost $0.902049 so far.",
			},
			{ kind: "tool", name: "runs.list", input: { project: "support-digest", since: "7d" }, status: "running" },
		],
	},
];

export const RunTranscript = () => (
	<div style={{ width: 680 }}>
		<Panel variant="plain" title="Transcript" count={`${SESSIONS.length} sessions`}>
			<Transcript sessions={SESSIONS as never} />
		</Panel>
	</div>
);

export const FailedToolCall = () => (
	<div style={{ width: 680 }}>
		<Transcript sessions={[{ ...SESSIONS[1], label: "Attempt 2" }] as never} />
	</div>
);

export const AllSessionsOpen = () => (
	<div style={{ width: 680 }}>
		<Transcript sessions={[SESSIONS[0], SESSIONS[2]].map((s, i) => ({ ...s, label: `Attempt ${i + 1}` })) as never} defaultOpen="all" />
	</div>
);
