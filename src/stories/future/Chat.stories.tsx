import type { Meta, StoryObj } from "@storybook/react-vite";
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { Attachment } from "../../components/chat/Attachment";
import { type ChatAttachment, ChatComposer } from "../../components/chat/ChatComposer";
import { ChatMessage } from "../../components/chat/ChatMessage";
import { ChatDivider, ChatThread } from "../../components/chat/ChatThread";
import { CodeBlock } from "../../components/chat/CodeBlock";
import { PromptSuggestions } from "../../components/chat/PromptSuggestions";
import { ToolCall } from "../../components/chat/ToolCall";
import { Concept, FuturePage, Spec } from "./Concept.jsx";

// Chat — quiet's AI chat set: thread, messages, rich composer, attachments, tool calls, code.
// UI only. The demo fakes Claude's streamed reply with a timer; a product wires onSubmit to the API.

const mono: CSSProperties = {
	fontFamily: "var(--q-font-mono)",
	fontSize: "var(--q-text-2xs)",
	letterSpacing: "var(--q-tracking-mono)",
	textTransform: "uppercase",
	color: "var(--q-fg-muted)",
};

// A small placeholder image, so image attachments have something to show without network.
const IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" width="480" height="300" viewBox="0 0 480 300"><rect width="480" height="300" fill="#f4f4f5"/><rect x="40" y="40" width="240" height="18" rx="9" fill="#18181b"/><rect x="40" y="76" width="380" height="10" rx="5" fill="#d4d4d8"/><rect x="40" y="98" width="320" height="10" rx="5" fill="#d4d4d8"/><rect x="40" y="150" width="120" height="100" rx="14" fill="#e4e4e7"/><rect x="180" y="150" width="120" height="100" rx="14" fill="#e4e4e7"/><rect x="320" y="150" width="120" height="100" rx="14" fill="#e0531a"/></svg>',
)}`;

const STARTERS = [
	{
		label: "Summarise this week’s signups",
		description: "From the CSV you attach",
		prompt: "Summarise this week’s signups.",
	},
	{
		label: "Draft a launch post",
		description: "Short, one claim per sentence",
		prompt: "Draft a launch post for the waitlist.",
	},
	{
		label: "Review a component",
		description: "Paste code or attach a file",
		prompt: "Review this component for accessibility.",
	},
	{
		label: "Explain a chart",
		description: "Attach a screenshot",
		prompt: "What stands out in this chart?",
	},
];

const REPLY = [
	"Here’s the shape of it. Signups were steady until Thursday, then the referral link carried most of the week:",
	"412 new signups, 61% from referrals, and bounces stayed under 3%. The one outlier is the EU beta list, which grew slower than the rest.",
	"If you want this as a recurring brief, the query below is what I ran — you can schedule it as is.",
];
const CODE = `select date_trunc('day', created_at) as day,
       count(*)                                     as signups,
       avg((source = 'referral')::int)              as referral_share
from signups
where created_at > now() - interval '7 days'
group by 1
order by 1;`;

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
		text: "Can you check whether the waitlist page passes contrast?",
		attachments: [{ id: "a1", name: "waitlist.png", size: 284_000, type: "image/png", src: IMAGE }],
	},
	{
		id: "h2",
		role: "assistant",
		text: "It mostly does. The muted helper text under the email field is 2.98:1 against the page — fine for non-essential copy, but the error message reuses that colour and needs to be ink. Everything else clears 4.5:1.",
	},
	{
		id: "h3",
		role: "user",
		text: "Good. Make the error ink then, and keep the helper as it is.",
	},
	{
		id: "h4",
		role: "assistant",
		text: "Done — the error now uses the ink colour, with a molten dot beside it so it still reads as a problem without relying on colour alone.",
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

/** The whole thing working: thread + composer, a fake streamed reply with a tool call and code. */
function ChatDemo({
	history = HISTORY,
	height = 560,
	label,
}: {
	history?: Turn[];
	height?: number;
	label?: string;
}) {
	const [turns, setTurns] = useState<Turn[]>(history);
	const [busy, setBusy] = useState(false);
	const timers = useRef<number[]>([]);
	const stream = useRef<number>(0);

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
			window.setTimeout(() => {
				patch(id, { tool: "done" });
				let i = 0;
				stream.current = window.setInterval(() => {
					i += 1;
					patch(id, { text: words.slice(0, i).join(" ") });
					if (i >= words.length) {
						clearInterval(stream.current);
						patch(id, { code: true });
						timers.current.push(window.setTimeout(() => finish(id), 300));
					}
				}, 45);
			}, 900),
		);
		return id;
	};

	const lastId = turns[turns.length - 1]?.id;
	const send = ({ text, attachments }: { text: string; attachments: ChatAttachment[] }) => {
		setTurns((ts) => [
			...ts,
			{
				id: uid(),
				role: "user",
				text,
				attachments: attachments.map((a) => ({ ...a, src: a.src })),
			},
		]);
		reply();
	};

	return (
		<div
			style={{
				display: "grid",
				gridTemplateRows: "minmax(0, 1fr) auto",
				gap: 16,
				height,
				padding: 16,
				border: "1px solid var(--q-border)",
				borderRadius: "var(--q-radius-xl)",
				background: "var(--q-bg)",
			}}
		>
			<ChatThread
				empty={
					<div
						style={{
							display: "grid",
							gap: 20,
							width: "100%",
							justifyItems: "center",
							textAlign: "center",
						}}
					>
						<div
							style={{ fontSize: "var(--q-text-2xl)", fontWeight: 600, letterSpacing: "-0.02em" }}
						>
							What are we working on?
						</div>
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
							onEdit={() => {}}
						>
							{t.text}
						</ChatMessage>
					) : (
						<ChatMessage
							key={t.id}
							status={t.status}
							copyText={t.text}
							onRetry={t.id === lastId && t.status !== "streaming" ? () => {} : undefined}
						>
							{t.tool && (
								<ToolCall
									name="query_database"
									status={t.tool}
									duration={t.tool === "done" ? 840 : undefined}
									summary="signups · last 7 days"
									input={{ table: "signups", range: "7d" }}
									output={t.tool === "done" ? "7 rows · 412 signups" : undefined}
								/>
							)}
							{t.text && <Words text={t.text} />}
							{t.code && <CodeBlock language="sql" code={CODE} />}
							{t.stopped && <p style={mono}>Stopped</p>}
						</ChatMessage>
					),
				)}
			</ChatThread>
			<ChatComposer
				label={label}
				busy={busy}
				onSubmit={send}
				onStop={() => {
					const streaming = turns.find((t) => t.status === "streaming");
					if (streaming) finish(streaming.id, true);
				}}
				accept="image/*,.pdf,.csv,.txt,.md,.docx,.xlsx,.json"
				maxSize={20 * 1024 * 1024}
				toolbar={<span style={mono}>Claude Opus 5.5</span>}
				hint="⏎ send · ⇧⏎ line"
			/>
		</div>
	);
}

function UploadingComposer() {
	const [files, setFiles] = useState<ChatAttachment[]>([
		{ id: "u1", name: "q3-board-deck.pdf", size: 4_200_000, type: "application/pdf" },
		{ id: "u2", name: "signups.csv", size: 82_000, type: "text/csv" },
		{ id: "u3", name: "dashboard.png", size: 640_000, type: "image/png", src: IMAGE },
	]);
	const [progress, setProgress] = useState<Record<string, number>>({ u1: 0.15, u3: 0.6 });
	useEffect(() => {
		const t = setInterval(
			() =>
				setProgress((p) => {
					const next: Record<string, number> = {};
					for (const [k, v] of Object.entries(p)) if (v < 1) next[k] = Math.min(1, v + 0.05);
					return next;
				}),
			400,
		);
		return () => clearInterval(t);
	}, []);
	return (
		<ChatComposer
			label="Message, uploading example"
			attachments={files}
			onAttachmentsChange={setFiles}
			progress={progress}
			defaultValue="Here’s the deck and the raw numbers — what’s missing?"
			hint="Uploading…"
		/>
	);
}

function Gallery({ children }: { children: ReactNode }) {
	return (
		<div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>
			{children}
		</div>
	);
}

function Page() {
	const [picked, setPicked] = useState("");
	return (
		<FuturePage
			title="Chat"
			intro="Everything for talking to Claude inside a product: a thread that stays out of your way, calm messages, a rich composer that takes images and documents, and the tool calls and code a reply carries. UI only — the product wires it to the API."
		>
			<Concept
				id="chat-thread"
				index={1}
				name="Chat thread"
				from="Comment lists, support widgets"
				idea="Pinned to the newest turn while you’re at the bottom; scroll up to read and it leaves you there, offering Jump to latest when something new arrives. New turns are announced politely; streamed tokens are not."
			>
				<Spec label="Working demo" col>
					<ChatDemo />
					<span style={mono}>
						Send a message (attach a file if you like) — the reply is faked with a timer
					</span>
				</Spec>
				<Spec label="Empty" col>
					<ChatDemo history={[]} height={420} label="New chat message" />
				</Spec>
			</Concept>

			<Concept
				id="chat-message"
				index={2}
				name="Chat message"
				from="Chat bubbles"
				idea="A person’s turn is a soft bubble on the right. Claude’s reply is plain prose under a small name row — no bubble, so long answers read like writing, not like texting."
			>
				<Spec label="User" col>
					<ChatMessage
						from="user"
						time={new Date(2026, 9, 8, 9, 41)}
						attachments={[
							{ name: "launch-plan.pdf", size: 1_240_000, type: "application/pdf" },
							{ name: "hero.png", size: 284_000, type: "image/png", src: IMAGE },
						]}
						onEdit={() => {}}
					>
						Can you turn this plan into three posts? Keep the hero image for the first.
					</ChatMessage>
				</Spec>
				<Spec label="Claude" col>
					<ChatMessage time={new Date(2026, 9, 8, 9, 42)} onRetry={() => {}}>
						<p>
							Three posts, one claim each. The first leads with the image; the other two are text
							only.
						</p>
						<p>
							I kept the dates from the plan and left pricing out, since the plan marks it as
							unconfirmed.
						</p>
					</ChatMessage>
				</Spec>
				<Spec label="Streaming" col>
					<ChatMessage status="streaming">
						<p>Reading the deck now. The first section covers the</p>
					</ChatMessage>
				</Spec>
				<Spec label="Error" col>
					<ChatMessage status="error" onRetry={() => {}}>
						<p>Comparing the two quarters, the biggest change is</p>
					</ChatMessage>
				</Spec>
				<Spec label="System" col>
					<ChatMessage from="system">Claude can now read files in this project</ChatMessage>
				</Spec>
			</Concept>

			<Concept
				id="chat-composer"
				index={3}
				name="Chat composer"
				from="Textarea + file input"
				idea="Text grows as you write. Files come in by the attach button, drag-and-drop or paste, and wait above the text as chips you can remove. Enter sends, Shift+Enter is a new line; while Claude answers, Send becomes Stop."
			>
				<Spec label="Ready" col>
					<ChatComposer
						label="Message, ready example"
						placeholder="Ask anything, or drop files here"
						accept="image/*,.pdf,.csv,.txt,.md"
						maxFiles={4}
						maxSize={5 * 1024 * 1024}
						toolbar={<span style={mono}>Claude Opus 5.5</span>}
						hint="4 files · 5 MB each"
					/>
				</Spec>
				<Spec label="Uploading" col>
					<UploadingComposer />
				</Spec>
				<Spec label="Responding" col>
					<ChatComposer
						label="Message, responding example"
						busy
						placeholder="Claude is responding…"
						onStop={() => {}}
					/>
				</Spec>
			</Concept>

			<Concept
				id="attachment"
				index={4}
				name="Attachment"
				from="File lists"
				idea="One shape for a file wherever it is: a chip waiting in the composer, a card sent with a message. Images show themselves; documents show their type, name and size."
			>
				<Spec label="Chips">
					<Gallery>
						<Attachment
							name="board-deck.pdf"
							size={4_200_000}
							type="application/pdf"
							onRemove={() => {}}
						/>
						<Attachment name="signups.csv" size={82_000} type="text/csv" onRemove={() => {}} />
						<Attachment
							name="hero.png"
							size={284_000}
							type="image/png"
							src={IMAGE}
							onRemove={() => {}}
						/>
					</Gallery>
				</Spec>
				<Spec label="States">
					<Gallery>
						<Attachment
							name="recording.m4a"
							size={18_000_000}
							type="audio/mp4"
							status="uploading"
							progress={0.42}
							onRemove={() => {}}
						/>
						<Attachment
							name="archive.zip"
							size={60_000_000}
							type="application/zip"
							status="uploading"
							onRemove={() => {}}
						/>
						<Attachment
							name="contract.docx"
							size={210_000}
							status="error"
							error="Too large — 20 MB max"
							onRemove={() => {}}
						/>
					</Gallery>
				</Spec>
				<Spec label="Cards">
					<Gallery>
						<Attachment
							variant="card"
							name="dashboard.png"
							size={640_000}
							type="image/png"
							src={IMAGE}
							onOpen={() => {}}
						/>
						<Attachment variant="card" name="q3-numbers.xlsx" size={96_000} onOpen={() => {}} />
					</Gallery>
				</Spec>
			</Concept>

			<Concept
				id="tool-call"
				index={5}
				name="Tool call"
				from="Spinners, “Thinking…”"
				idea="What Claude did inside a reply, folded to one line — the tool, its state, how long. Open it for the exact input and output; nothing hides behind a spinner."
			>
				<Spec label="States" col>
					<ToolCall name="web_search" status="running" summary="quiet design system contrast" />
					<ToolCall
						name="query_database"
						status="done"
						duration={840}
						summary="signups · last 7 days"
						input={{ table: "signups", range: "7d" }}
						output="7 rows · 412 signups"
						defaultOpen
					/>
					<ToolCall
						name="send_email"
						status="error"
						duration={2100}
						summary="to 3 owners"
						input={{ to: ["ada", "leo", "mira"], template: "pause-notice" }}
						output="SMTP 421: try again later"
					/>
					<ToolCall
						kind="thinking"
						status="done"
						duration={3400}
						summary="Weighing the two drafts"
						output="The second draft is shorter and keeps the one claim that matters; the first buries it in the third sentence."
					/>
				</Spec>
			</Concept>

			<Concept
				id="code-block"
				index={6}
				name="Code block"
				from="Pasted code"
				idea="Mono, scrolls sideways instead of wrapping, with its language and a Copy button. No highlighter: plain ink keeps a reply quiet."
			>
				<Spec label="SQL" col>
					<CodeBlock language="sql" code={CODE} />
				</Spec>
				<Spec label="File" col>
					<CodeBlock
						filename="Button.scss"
						language="scss"
						maxHeight={160}
						code={`.q-button {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--q-button-gap);\n  height: var(--_height);\n  padding: 0 var(--_px);\n  border-radius: var(--q-button-radius);\n  font-weight: var(--q-button-weight);\n  transition: background var(--q-dur-hover) var(--q-ease-soft);\n}\n\n.q-button--primary {\n  background: var(--q-button-primary-bg);\n  color: var(--q-button-primary-fg);\n}`}
					/>
				</Spec>
			</Concept>

			<Concept
				id="prompt-suggestions"
				index={7}
				name="Prompt suggestions"
				from="Empty states"
				idea="An empty thread offers a few concrete starts instead of a blank box. One tab stop; arrows move between them."
			>
				<Spec label="Pills" col>
					<PromptSuggestions
						label="Starters"
						suggestions={[
							"Summarise this thread",
							"Draft a reply",
							"Find the action items",
							"Translate to Swedish",
						]}
						onSelect={setPicked}
					/>
					<span style={mono} aria-live="polite">
						{picked ? `Picked: ${picked}` : "Pick one"}
					</span>
				</Spec>
				<Spec label="Cards" col>
					<PromptSuggestions
						layout="grid"
						label="Starters with detail"
						suggestions={STARTERS}
						onSelect={setPicked}
					/>
				</Spec>
			</Concept>
		</FuturePage>
	);
}

const meta: Meta = { title: "Chat", component: Page, parameters: { layout: "fullscreen" } };
export default meta;
export const All: StoryObj = {};
