import React from "react";
import { rovingKeyDown } from "../../a11y/hooks";
import { ChatMessage, ClaudeMark } from "../chat/ChatMessage";
import { CodeBlock } from "../chat/CodeBlock";
import { ToolCall } from "../chat/ToolCall";
import { Badge } from "../core/Badge";
import { Icon } from "../core/Icon";
import "./Transcript.scss";

/** A message said in a session. String content renders paragraphs, `- ` lists, `inline code`, **bold** and fenced code. */
export interface TranscriptMessage {
	kind: "message";
	role: "user" | "assistant" | "system";
	/** Who said it; consecutive messages from the same author (and channel) share one header */
	author?: string;
	/** Where it came from, shown as a chip: "chat", "slack", "web-message" … */
	channel?: string;
	/** When; shown once per group, from its first message */
	at?: React.ReactNode;
	content: React.ReactNode;
}

/** A tool the agent called, folded to one line (ToolCall); opens to its input and output. */
export interface TranscriptTool {
	kind: "tool";
	name: string;
	/** Strings print as-is; objects as JSON */
	input?: unknown;
	output?: unknown;
	status?: "running" | "done" | "error";
	/** Milliseconds, or a ready string ("1.2s") */
	duration?: number | string;
	/** One line after the name; defaults to the input's first string value */
	summary?: React.ReactNode;
}

/** Something that happened to the run itself, e.g. "Run restarted". */
export interface TranscriptEvent {
	kind: "event";
	label: React.ReactNode;
	at?: React.ReactNode;
}

export type TranscriptItem = TranscriptMessage | TranscriptTool | TranscriptEvent;

export interface TranscriptSession {
	id: string;
	/** Default "Session n" */
	label?: React.ReactNode;
	startedAt?: React.ReactNode;
	items: TranscriptItem[];
}

/**
 * The read-back of an agent run: sessions as collapsible groups, each a thread of messages
 * (ChatMessage), tool calls (ToolCall) and run events. Consecutive messages from one author share a
 * header; a folded session shows a one-line summary ("12 messages · 3 tool calls").
 * @startingPoint section="App" subtitle="Agent run transcript" viewport="800x640"
 */
export interface TranscriptProps {
	sessions: TranscriptSession[];
	/** Which sessions start open (uncontrolled): the latest only (default) or all */
	defaultOpen?: "latest" | "all";
	/** Controlled: the ids of the open sessions */
	open?: string[];
	/** Called with the ids of the open sessions */
	onOpenChange?: (open: string[]) => void;
	/** Level of each session heading, 2–5 (speaker headings sit one below). Default 3 */
	headingLevel?: 2 | 3 | 4 | 5;
	/** Shown in a session with no items. Default "No messages" */
	emptyLabel?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

// ── Rich text: a small, safe subset of markdown, rendered as React nodes ─────────────────────────

function inline(text: string, key: string): React.ReactNode[] {
	const out: React.ReactNode[] = [];
	const re = /`([^`]+)`|\*\*([^*]+)\*\*/g;
	let last = 0;
	let m: RegExpExecArray | null = re.exec(text);
	while (m) {
		if (m.index > last) out.push(text.slice(last, m.index));
		out.push(
			m[1] != null ? (
				<code key={`${key}-${m.index}`} className="q-transcript__code">
					{m[1]}
				</code>
			) : (
				<strong key={`${key}-${m.index}`}>{m[2]}</strong>
			),
		);
		last = m.index + m[0].length;
		m = re.exec(text);
	}
	if (last < text.length) out.push(text.slice(last));
	return out;
}

const BULLET = /^\s*[-*•]\s+/;
const NUMBER = /^\s*\d+[.)]\s+/;

function richText(text: string): React.ReactNode {
	const lines = text.replace(/\r\n?/g, "\n").split("\n");
	const out: React.ReactNode[] = [];
	let para: string[] = [];
	let list: { ordered: boolean; items: string[] } | null = null;
	const flushPara = () => {
		if (para.length) {
			const k = `p${out.length}`;
			out.push(<p key={k}>{inline(para.join(" "), k)}</p>);
		}
		para = [];
	};
	const flushList = () => {
		if (list) {
			const k = `l${out.length}`;
			const items = list.items.map((it, i) => <li key={i}>{inline(it, `${k}-${i}`)}</li>);
			out.push(
				list.ordered ? (
					<ol key={k} className="q-transcript__list">
						{items}
					</ol>
				) : (
					<ul key={k} className="q-transcript__list">
						{items}
					</ul>
				),
			);
		}
		list = null;
	};
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i]!;
		const fence = line.match(/^\s*```\s*([\w+-]*)/);
		if (fence) {
			flushPara();
			flushList();
			const code: string[] = [];
			i++;
			while (i < lines.length && !/^\s*```/.test(lines[i]!)) code.push(lines[i++]!);
			out.push(
				<CodeBlock
					key={`c${out.length}`}
					code={code.join("\n")}
					language={fence[1] || undefined}
				/>,
			);
			continue;
		}
		const bullet = BULLET.test(line);
		const numbered = !bullet && NUMBER.test(line);
		if (bullet || numbered) {
			flushPara();
			if (list && list.ordered !== numbered) flushList();
			list ??= { ordered: numbered, items: [] };
			list.items.push(line.replace(bullet ? BULLET : NUMBER, ""));
		} else if (line.trim() === "") {
			flushPara();
			flushList();
		} else if (list && /^\s{2,}/.test(line)) {
			// An indented line continues the last list item.
			list.items[list.items.length - 1] += ` ${line.trim()}`;
		} else {
			flushList();
			para.push(line.trim());
		}
	}
	flushPara();
	flushList();
	return out;
}

// ── Grouping ────────────────────────────────────────────────────────────────────────────────────

type Block =
	| {
			type: "group";
			role: "user" | "assistant";
			author?: string;
			channel?: string;
			at?: React.ReactNode;
			entries: (TranscriptMessage | TranscriptTool)[];
	  }
	| { type: "tools"; entries: TranscriptTool[] }
	| { type: "system"; item: TranscriptMessage }
	| { type: "event"; item: TranscriptEvent };

function toBlocks(items: TranscriptItem[]): Block[] {
	const blocks: Block[] = [];
	for (const it of items) {
		const last = blocks[blocks.length - 1];
		if (it.kind === "event") blocks.push({ type: "event", item: it });
		else if (it.kind === "tool") {
			// A tool call belongs to the reply it sits in; one with no reply before it stands alone.
			if (last?.type === "group" && last.role === "assistant") last.entries.push(it);
			else if (last?.type === "tools") last.entries.push(it);
			else blocks.push({ type: "tools", entries: [it] });
		} else if (it.role === "system") blocks.push({ type: "system", item: it });
		else if (
			last?.type === "group" &&
			last.role === it.role &&
			last.author === it.author &&
			last.channel === it.channel
		)
			last.entries.push(it);
		else
			blocks.push({
				type: "group",
				role: it.role,
				author: it.author,
				channel: it.channel,
				at: it.at,
				entries: [it],
			});
	}
	return blocks;
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

function summarize(items: TranscriptItem[]) {
	let messages = 0;
	let tools = 0;
	let failed = 0;
	for (const it of items) {
		if (it.kind === "message") messages++;
		else if (it.kind === "tool") {
			tools++;
			if (it.status === "error") failed++;
		}
	}
	return [
		plural(messages, "message", "messages"),
		tools > 0 && plural(tools, "tool call", "tool calls"),
		failed > 0 && `${failed} failed`,
	]
		.filter(Boolean)
		.join(" · ");
}

const toolSummary = (t: TranscriptTool): React.ReactNode => {
	if (t.summary != null) return t.summary;
	if (typeof t.input === "string") return t.input;
	if (t.input && typeof t.input === "object") {
		const first = Object.values(t.input).find((v) => typeof v === "string");
		if (typeof first === "string") return first;
	}
	return undefined;
};

function Tool({ tool }: { tool: TranscriptTool }) {
	return (
		<ToolCall
			name={tool.name}
			status={tool.status ?? "done"}
			duration={tool.duration}
			summary={toolSummary(tool)}
			input={tool.input}
			output={tool.output}
		/>
	);
}

function Group({
	block,
	headingLevel,
}: {
	block: Extract<Block, { type: "group" }>;
	headingLevel: 3 | 4 | 5 | 6;
}) {
	const isUser = block.role === "user";
	const who = block.author ?? (isUser ? "User" : "Assistant");
	return (
		<div className={`q-transcript__group q-transcript__group--${block.role}`}>
			<div className="q-transcript__byline">
				{!isUser && <ClaudeMark size="sm" />}
				<span className="q-transcript__author">{who}</span>
				{block.channel && (
					<Badge variant="outline" size="sm" className="q-transcript__channel">
						{block.channel}
					</Badge>
				)}
				{block.at != null && <span className="q-transcript__time">{block.at}</span>}
			</div>
			{block.entries.map((e, i) =>
				e.kind === "tool" ? (
					<Tool key={i} tool={e} />
				) : (
					<ChatMessage
						key={i}
						from={block.role}
						name={who}
						showCopy={false}
						headingLevel={headingLevel}
						className="q-transcript__message"
					>
						{typeof e.content === "string" ? richText(e.content) : e.content}
					</ChatMessage>
				),
			)}
		</div>
	);
}

function SessionBody({
	items,
	headingLevel,
}: {
	items: TranscriptItem[];
	headingLevel: 3 | 4 | 5 | 6;
}) {
	return (
		<div className="q-transcript__body">
			{toBlocks(items).map((b, i) => {
				if (b.type === "group") return <Group key={i} block={b} headingLevel={headingLevel} />;
				if (b.type === "tools")
					return (
						<div key={i} className="q-transcript__group q-transcript__group--tools">
							{b.entries.map((t, j) => (
								<Tool key={j} tool={t} />
							))}
						</div>
					);
				if (b.type === "system")
					return (
						<ChatMessage key={i} from="system">
							{b.item.content}
						</ChatMessage>
					);
				return (
					<ChatMessage key={i} from="system" className="q-transcript__event">
						<span>
							{b.item.label}
							{b.item.at != null && (
								<>
									{" · "}
									<span className="q-transcript__event-time">{b.item.at}</span>
								</>
							)}
						</span>
					</ChatMessage>
				);
			})}
		</div>
	);
}

function Session({
	session,
	index,
	open,
	onToggle,
	headingLevel,
	emptyLabel,
}: {
	session: TranscriptSession;
	index: number;
	open: boolean;
	onToggle: () => void;
	headingLevel: 2 | 3 | 4 | 5;
	emptyLabel: React.ReactNode;
}) {
	const id = React.useId();
	const H = `h${headingLevel}` as "h2" | "h3" | "h4" | "h5";
	const label = session.label ?? `Session ${index + 1}`;
	const empty = session.items.length === 0;
	const head = (
		<>
			<span className="q-transcript__label">{label}</span>
			{session.startedAt != null && (
				<span className="q-transcript__started">{session.startedAt}</span>
			)}
			<span className="q-transcript__summary">{empty ? emptyLabel : summarize(session.items)}</span>
		</>
	);
	// An empty session has nothing to open: a plain heading that says so, never an empty one.
	if (empty)
		return (
			<section className="q-transcript__session q-transcript__session--empty">
				<H className="q-transcript__heading">
					<span className="q-transcript__head">
						<span aria-hidden="true" className="q-transcript__chevron" />
						{head}
					</span>
				</H>
			</section>
		);
	return (
		<section className="q-transcript__session" data-open={open}>
			<H className="q-transcript__heading">
				<button
					type="button"
					id={`${id}h`}
					aria-expanded={open}
					aria-controls={`${id}p`}
					data-transcript-toggle=""
					onClick={onToggle}
					className="q-transcript__head q-transcript__toggle"
				>
					<Icon name="chevron-right" size="sm" className="q-transcript__chevron" />
					{head}
				</button>
			</H>
			<div
				id={`${id}p`}
				role="region"
				aria-labelledby={`${id}h`}
				inert={!open}
				className="q-collapse"
				data-open={open}
			>
				<div className="q-collapse-inner">
					<SessionBody items={session.items} headingLevel={(headingLevel + 1) as 3 | 4 | 5 | 6} />
				</div>
			</div>
		</section>
	);
}

export function Transcript({
	sessions,
	defaultOpen = "latest",
	open: openProp,
	onOpenChange,
	headingLevel = 3,
	emptyLabel = "No messages",
	className,
	style,
}: TranscriptProps) {
	const [inner, setInner] = React.useState<string[]>(() => {
		if (defaultOpen === "all") return sessions.map((s) => s.id);
		const latest = sessions[sessions.length - 1];
		return latest ? [latest.id] : [];
	});
	const open = openProp ?? inner;
	const toggle = (id: string) => {
		const next = open.includes(id) ? open.filter((x) => x !== id) : [...open, id];
		if (openProp === undefined) setInner(next);
		onOpenChange?.(next);
	};
	const nav = rovingKeyDown("[data-transcript-toggle]", "vertical");
	return (
		<div
			className={["q-transcript", className].filter(Boolean).join(" ")}
			style={style}
			onKeyDown={(e: React.KeyboardEvent<HTMLElement>) =>
				(e.target as HTMLElement).hasAttribute("data-transcript-toggle") && nav(e)
			}
		>
			{sessions.map((s, i) => (
				<Session
					key={s.id}
					session={s}
					index={i}
					open={open.includes(s.id)}
					onToggle={() => toggle(s.id)}
					headingLevel={headingLevel}
					emptyLabel={emptyLabel}
				/>
			))}
		</div>
	);
}
