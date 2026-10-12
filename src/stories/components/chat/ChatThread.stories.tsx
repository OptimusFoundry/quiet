import type { Meta, StoryObj } from "@storybook/react-vite";
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { type ChatAttachment, ChatComposer } from "../../../components/chat/ChatComposer";
import { ChatMessage } from "../../../components/chat/ChatMessage";
import { ChatDivider, ChatThread } from "../../../components/chat/ChatThread";
import { CodeBlock } from "../../../components/chat/CodeBlock";
import { PromptSuggestions } from "../../../components/chat/PromptSuggestions";
import { ToolCall } from "../../../components/chat/ToolCall";
import { Column, Note } from "../Story";
import { IMAGE, REPLY, SQL, STARTERS } from "./fixtures";
import "./ChatThread.scss";

const noop = () => {};

function Frame({
	children,
	height,
	bare,
}: {
	children: ReactNode;
	height?: number;
	bare?: boolean;
}) {
	return (
		<div
			className={bare ? "q-sb-chat-thread q-sb-chat-thread--bare" : "q-sb-chat-thread"}
			style={height ? ({ "--_height": `${height}px` } as CSSProperties) : undefined}
		>
			{children}
		</div>
	);
}

const SHORT = [
	<ChatDivider key="d">Today</ChatDivider>,
	<ChatMessage key="1" from="user">
		Did last night’s billing run finish?
	</ChatMessage>,
	<ChatMessage key="2">
		<p>
			Yes, at 02:14. It reconciled 1,204 invoices and flagged three for approval; they’re waiting in
			Approvals.
		</p>
	</ChatMessage>,
	<ChatMessage key="3" from="user">
		Who needs to approve them?
	</ChatMessage>,
	<ChatMessage key="4">
		<p>Mira, as the billing owner. I can send her a reminder if you like.</p>
	</ChatMessage>,
];

const meta = {
	title: "Components/Chat/ChatThread",
	component: ChatThread,
	subcomponents: { ChatDivider },
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { label: "Conversation", jumpLabel: "Jump to latest", children: SHORT },
	argTypes: {
		children: { control: false },
		empty: { control: false },
	},
	render: (args) => (
		<Frame bare height={420}>
			<ChatThread {...args} />
		</Frame>
	),
} satisfies Meta<typeof ChatThread>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Empty: Story = {
	parameters: {
		docs: {
			description: {
				story: "No turns yet: `empty` shows instead, usually a title and prompt suggestions.",
			},
		},
	},
	args: {
		children: [],
		empty: (
			<div className="q-sb-chat-thread__empty">
				<h2 className="q-sb-chat-thread__empty-title">What are we working on?</h2>
				<PromptSuggestions layout="grid" suggestions={STARTERS} />
			</div>
		),
	},
};

const RUN_IDS = [8100, 8101, 8102, 8103, 8104, 8105, 8106, 8107];
const LONG = RUN_IDS.flatMap((run) => [
	<ChatMessage key={`u${run}`} from="user">
		{`What happened in run ${run}?`}
	</ChatMessage>,
	<ChatMessage key={`a${run}`}>
		<p>
			{`Run ${run} finished in ${3 + (run % 4)}m with ${run % 3} failed steps. The artifacts are attached to the run; nothing needs approval.`}
		</p>
	</ChatMessage>,
]);

export const LongHistory: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Pinned to the newest turn. Scroll up and it stays put, offering “Jump to latest” when something new arrives.",
			},
		},
	},
	args: { children: [<ChatDivider key="d">Yesterday</ChatDivider>, ...LONG] },
};

type Turn = {
	id: string;
	role: "user" | "assistant";
	text: string;
	attachments?: ChatAttachment[];
	status?: "streaming" | "done" | "error";
	tool?: "running" | "done";
	code?: boolean;
	stopped?: boolean;
};

const HISTORY: Turn[] = [
	{
		id: "h1",
		role: "user",
		text: "Can you check why the approvals page feels slow?",
		attachments: [
			{ id: "a1", name: "approvals.png", size: 284_000, type: "image/png", src: IMAGE },
		],
	},
	{
		id: "h2",
		role: "assistant",
		text: "It loads every approval for the workspace before it renders the first one: 1,900 rows on yours. Paging to 50 would bring the first paint under a second.",
	},
	{ id: "h3", role: "user", text: "Good. Page it, and keep the filters as they are." },
	{
		id: "h4",
		role: "assistant",
		text: "Done. The page now loads 50 at a time, and the filters still apply to the whole set.",
	},
];

let nextId = 0;
const uid = () => `t${++nextId}`;

function Words({ text }: { text: string }) {
	return (
		<>
			{text.split("\n\n").map((p) => (
				<p key={p.slice(0, 24)}>{p}</p>
			))}
		</>
	);
}

/** The whole thing working: thread + composer, a faked streamed reply with a tool call and code. */
function Conversation({ history = HISTORY }: { history?: Turn[] }) {
	const [turns, setTurns] = useState<Turn[]>(history);
	const [busy, setBusy] = useState(false);
	const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
	const stream = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

	useEffect(
		() => () => {
			for (const t of timers.current) clearTimeout(t);
			clearInterval(stream.current);
		},
		[],
	);

	const patch = (id: string, p: Partial<Turn>) =>
		setTurns((ts) => ts.map((t) => (t.id === id ? { ...t, ...p } : t)));

	const finish = (id: string, stopped = false) => {
		clearInterval(stream.current);
		for (const t of timers.current) clearTimeout(t);
		timers.current = [];
		setTurns((ts) =>
			ts.map((t) =>
				t.id === id
					? { ...t, status: "done", tool: t.tool && "done", code: t.code || !stopped, stopped }
					: t,
			),
		);
		setBusy(false);
	};

	const reply = () => {
		const id = uid();
		setTurns((ts) => [
			...ts,
			{ id, role: "assistant", text: "", status: "streaming", tool: "running" },
		]);
		setBusy(true);
		const words = REPLY.join("\n\n").split(" ");
		timers.current.push(
			setTimeout(() => {
				patch(id, { tool: "done" });
				let i = 0;
				stream.current = setInterval(() => {
					i += 1;
					patch(id, { text: words.slice(0, i).join(" ") });
					if (i >= words.length) {
						clearInterval(stream.current);
						patch(id, { code: true });
						timers.current.push(setTimeout(() => finish(id), 300));
					}
				}, 45);
			}, 900),
		);
	};

	const send = ({ text, attachments }: { text: string; attachments: ChatAttachment[] }) => {
		setTurns((ts) => [...ts, { id: uid(), role: "user", text, attachments }]);
		reply();
	};

	const lastId = turns[turns.length - 1]?.id;
	return (
		<Frame>
			<ChatThread
				empty={
					<div className="q-sb-chat-thread__empty">
						<h2 className="q-sb-chat-thread__empty-title">What are we working on?</h2>
						<PromptSuggestions
							layout="grid"
							suggestions={STARTERS}
							onSelect={(prompt) => send({ text: prompt, attachments: [] })}
						/>
					</div>
				}
			>
				{turns.length > 0 && <ChatDivider>Today</ChatDivider>}
				{turns.map((t) =>
					t.role === "user" ? (
						<ChatMessage
							key={t.id}
							from="user"
							attachments={t.attachments}
							copyText={t.text}
							onEdit={noop}
						>
							{t.text}
						</ChatMessage>
					) : (
						<ChatMessage
							key={t.id}
							status={t.status}
							copyText={t.text}
							onRetry={t.id === lastId && t.status !== "streaming" ? noop : undefined}
						>
							{t.tool && (
								<ToolCall
									name="query_database"
									status={t.tool}
									duration={t.tool === "done" ? 840 : undefined}
									summary="runs · last 7 days"
									input={{ table: "runs", range: "7d" }}
									output={t.tool === "done" ? "7 rows · 412 runs" : undefined}
								/>
							)}
							{t.text && <Words text={t.text} />}
							{t.code && <CodeBlock language="sql" code={SQL} />}
							{t.stopped && <p>Stopped.</p>}
						</ChatMessage>
					),
				)}
			</ChatThread>
			<ChatComposer
				busy={busy}
				onSubmit={send}
				onStop={() => {
					const streaming = turns.find((t) => t.status === "streaming");
					if (streaming) finish(streaming.id, true);
				}}
				accept="image/*,.pdf,.csv,.txt,.md,.docx,.xlsx,.json"
				maxSize={20 * 1024 * 1024}
				toolbar={<span className="q-sb-chat-thread__model">Claude Opus 5.5</span>}
				hint="Enter to send"
			/>
		</Frame>
	);
}

export const FullConversation: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Thread + composer working together. Send a message (attach a file if you like): the reply is faked with a timer, streams in with a tool call and code, and Stop ends it.",
			},
		},
	},
	render: () => (
		<Column wide>
			<Conversation />
			<Note>UI only: a product wires `onSubmit` to the API and streams the reply into a turn.</Note>
		</Column>
	),
};

export const NewConversation: Story = {
	parameters: {
		docs: { description: { story: "The same, empty: pick a starter or type." } },
	},
	render: () => <Conversation history={[]} />,
};
