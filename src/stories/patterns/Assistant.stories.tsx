import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState } from "react";
import {
	Button,
	type ChatAttachment,
	ChatComposer,
	ChatDivider,
	ChatMessage,
	ChatThread,
	Checkpoints,
	CodeBlock,
	Drawer,
	PromptSuggestions,
	Receipt,
	SectionHeader,
	Text,
	ToolCall,
	toast,
} from "../../index";
import { AppFrame, useNarrow } from "./AppFrame";
import "./Assistant.scss";

// Assistant — a full chat-with-Claude page. The thread and composer take the main column; the side
// panel holds what the assistant changed (Checkpoints) and the receipt for its last action.
// The reply is faked with a timer; a product wires onSubmit to the API and streams into ChatMessage.

const IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" width="480" height="300" viewBox="0 0 480 300"><rect width="480" height="300" fill="#f4f4f5"/><rect x="40" y="40" width="240" height="18" rx="9" fill="#18181b"/><rect x="40" y="76" width="380" height="10" rx="5" fill="#d4d4d8"/><rect x="40" y="150" width="400" height="100" rx="14" fill="#e4e4e7"/></svg>',
)}`;

const REPLY =
	"Beta · EU is the only campaign over the line: 6.4% bounces this week, almost all from one corporate domain that rejects new senders.\n\nI've drafted a pause for it and left the other thirteen alone. The query I ran is below if you want it as a weekly check.";
const CODE = `select campaign, count(*) filter (where bounced) * 100.0 / count(*) as bounce_pct
from sends
where sent_at > now() - interval '7 days'
group by 1
having count(*) filter (where bounced) * 100.0 / count(*) > 5;`;

type Turn = {
	id: string;
	from: "user" | "assistant";
	text: string;
	attachments?: ChatAttachment[];
	status?: "streaming" | "done";
	tool?: "running" | "done";
	code?: boolean;
};
const HISTORY: Turn[] = [
	{
		id: "h1",
		from: "user",
		text: "Here's last week's export. Which campaigns are bouncing?",
		attachments: [
			{ id: "a1", name: "sends-week-40.csv", size: 182_000, type: "text/csv" },
			{ id: "a2", name: "dashboard.png", size: 284_000, type: "image/png", src: IMAGE },
		],
	},
	{
		id: "h2",
		from: "assistant",
		text: "Two are above 3%, and one is above your 5% line. Want me to look at why before touching anything?",
	},
];
const CHECKPOINTS = [
	{ id: "c1", label: "Imported sends-week-40.csv", who: "Ada", time: "09:02", changes: 1 },
	{
		id: "c2",
		label: "Tagged 3 bouncing campaigns",
		who: "Meerkat",
		time: "09:04",
		agent: true,
		changes: 3,
	},
	{
		id: "c3",
		label: "Drafted pause for Beta · EU",
		who: "Meerkat",
		time: "09:05",
		agent: true,
		changes: 1,
	},
	{ id: "c4", label: "Edited the pause notice", who: "Ada", time: "09:07", changes: 1 },
];
const STARTERS = [
	{
		label: "Which campaigns are bouncing?",
		description: "From this week's sends",
		prompt: "Which campaigns are bouncing?",
	},
	{
		label: "Draft a launch post",
		description: "Short, one claim per sentence",
		prompt: "Draft a launch post for the waitlist.",
	},
];

let seq = 0;
const uid = () => `t${++seq}`;

function Conversation() {
	const narrow = useNarrow();
	const [turns, setTurns] = useState<Turn[]>(HISTORY);
	const [busy, setBusy] = useState(false);
	const timers = useRef<number[]>([]);
	useEffect(() => () => timers.current.forEach(clearTimeout), []);
	const patch = (id: string, p: Partial<Turn>) =>
		setTurns((ts) => ts.map((t) => (t.id === id ? { ...t, ...p } : t)));
	const stop = () => {
		timers.current.forEach(clearTimeout);
		timers.current = [];
		setTurns((ts) =>
			ts.map((t) =>
				t.status === "streaming" ? { ...t, status: "done", tool: t.tool && "done" } : t,
			),
		);
		setBusy(false);
	};
	const send = ({ text, attachments }: { text: string; attachments: ChatAttachment[] }) => {
		const id = uid();
		setTurns((ts) => [
			...ts,
			{ id: uid(), from: "user", text, attachments },
			{ id, from: "assistant", text: "", status: "streaming", tool: "running" },
		]);
		setBusy(true);
		const words = REPLY.split(" ");
		timers.current.push(
			window.setTimeout(() => {
				patch(id, { tool: "done" });
				words.forEach((_, i) => {
					timers.current.push(
						window.setTimeout(
							() => patch(id, { text: words.slice(0, i + 1).join(" ") }),
							40 * (i + 1),
						),
					);
				});
				timers.current.push(
					window.setTimeout(
						() => {
							patch(id, { code: true, status: "done" });
							setBusy(false);
						},
						40 * words.length + 200,
					),
				);
			}, 800),
		);
	};
	const last = turns[turns.length - 1]?.id;
	return (
		<div className="q-sb-assistant__chat">
			{/* ChatMessage names are h3s; give the thread an h2 so the outline holds. */}
			<h2 className="q-sr-only">Messages</h2>
			<ChatThread
				label="Conversation with Claude"
				empty={
					<PromptSuggestions
						layout="grid"
						suggestions={STARTERS}
						onSelect={(prompt) => send({ text: prompt, attachments: [] })}
					/>
				}
			>
				<ChatDivider>Today</ChatDivider>
				{turns.map((t) =>
					t.from === "user" ? (
						<ChatMessage key={t.id} from="user" attachments={t.attachments} copyText={t.text}>
							{t.text}
						</ChatMessage>
					) : (
						<ChatMessage
							key={t.id}
							from="assistant"
							status={t.status}
							copyText={t.text}
							onRetry={
								t.id === last && t.status === "done"
									? () => toast({ title: "Retrying." })
									: undefined
							}
						>
							{t.tool && (
								<ToolCall
									name="query_database"
									status={t.tool}
									duration={t.tool === "done" ? 640 : undefined}
									summary="sends · last 7 days"
									input={{ table: "sends", range: "7d", group: "campaign" }}
									output={t.tool === "done" ? "14 rows · 1 above 5%" : undefined}
								/>
							)}
							{t.text.split("\n\n").map((p) => (
								<p key={p.slice(0, 24)}>{p}</p>
							))}
							{t.code && <CodeBlock language="sql" code={CODE} />}
						</ChatMessage>
					),
				)}
			</ChatThread>
			<ChatComposer
				label="Message Claude"
				busy={busy}
				onSubmit={send}
				onStop={stop}
				accept="image/*,.pdf,.csv,.txt,.md,.docx,.xlsx,.json"
				maxSize={20 * 1024 * 1024}
				placeholder="Ask about your campaigns, or drop a file"
				toolbar={
					<Text size="xs" mono>
						Claude Opus 5.5
					</Text>
				}
				hint={narrow ? undefined : "⏎ send · ⇧⏎ line"}
			/>
		</div>
	);
}

function SidePanel() {
	const [undone, setUndone] = useState<string[]>([]);
	return (
		<div className="q-sb-app-frame__stack q-sb-app-frame__stack--section">
			<div className="q-sb-app-frame__stack q-sb-app-frame__stack--stack">
				<SectionHeader
					size="sm"
					as="h2"
					title="Changes"
					description="Every step you or Meerkat took in this conversation."
				/>
				<Checkpoints
					label="Conversation checkpoints"
					checkpoints={CHECKPOINTS}
					defaultValue={CHECKPOINTS.length - 1}
					onRestore={(c) => toast({ title: "Restored.", meta: c.label })}
				/>
			</div>
			<div className="q-sb-app-frame__stack q-sb-app-frame__stack--stack">
				<SectionHeader size="sm" as="h2" title="Last action" />
				<Receipt
					actor="Meerkat"
					time="09:05"
					reference="run 0412"
					reason="Beta · EU passed 5% bounces for three days."
					lines={[
						{
							id: "tag",
							verb: "Tagged",
							object: "3 campaigns as bouncing",
							undoable: true,
							undone: undone.includes("tag"),
						},
						{
							id: "draft",
							verb: "Drafted",
							object: "a pause for Beta · EU",
							undoable: true,
							undone: undone.includes("draft"),
						},
						{ id: "notify", verb: "Told", object: "Leo, the campaign owner" },
					]}
					onUndo={(line) => setUndone((u) => [...u, String(line.id)])}
				/>
			</div>
		</div>
	);
}

function AssistantPage() {
	const narrow = useNarrow();
	const [panel, setPanel] = useState(false);
	return (
		<div className={narrow ? "q-sb-assistant q-sb-assistant--narrow" : "q-sb-assistant"}>
			<section
				aria-label="Conversation: Bouncing campaigns"
				className="q-sb-assistant__conversation"
			>
				<div className="q-sb-app-frame__row q-sb-app-frame__row--stack q-sb-assistant__header">
					<Text as="h1" heading={4}>
						Bouncing campaigns
					</Text>
					{narrow && (
						<Button
							size="sm"
							variant="outline"
							aria-expanded={panel}
							onClick={() => setPanel(true)}
						>
							Changes
						</Button>
					)}
				</div>
				<div className="q-sb-assistant__column">
					<Conversation />
				</div>
			</section>
			{narrow ? (
				<Drawer open={panel} onClose={() => setPanel(false)} size="md" title="Changes">
					<SidePanel />
				</Drawer>
			) : (
				<aside aria-label="Changes and receipts" className="q-sb-assistant__panel">
					<SidePanel />
				</aside>
			)}
		</div>
	);
}

const meta: Meta = { title: "Patterns/Assistant", parameters: { layout: "fullscreen" } };
export default meta;
export const Default: StoryObj = {
	render: () => (
		<AppFrame
			active="assistant"
			padded={false}
			crumbs={[
				{ label: "Workspace", href: "#" },
				{ label: "Assistant", href: "#" },
				{ label: "Bouncing campaigns" },
			]}
		>
			<AssistantPage />
		</AppFrame>
	),
};
