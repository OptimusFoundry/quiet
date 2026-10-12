import { Attachment } from "../../../components/chat/Attachment";
import { ChatComposer } from "../../../components/chat/ChatComposer";
import { ChatMessage } from "../../../components/chat/ChatMessage";
import { ChatThread } from "../../../components/chat/ChatThread";
import { CodeBlock } from "../../../components/chat/CodeBlock";
import { PromptSuggestions } from "../../../components/chat/PromptSuggestions";
import { ToolCall } from "../../../components/chat/ToolCall";
import { IMAGE } from "../../components/chat/fixtures";
import type { Tile } from "./types";

export const tiles: Tile[] = [
	{
		name: "ChatThread",
		blurb: "The scrolling conversation, pinned to the newest turn while you read at the bottom.",
		wide: true,
		render: () => (
			<div className="q-sb-tile-stack">
				<ChatThread label="Example conversation">
					<ChatMessage from="user">Did last night’s billing run finish?</ChatMessage>
					<ChatMessage>Yes, at 02:14. Three invoices wait for approval.</ChatMessage>
				</ChatThread>
			</div>
		),
	},
	{
		name: "ChatComposer",
		blurb: "The message box: grows as you type, takes files, Send becomes Stop.",
		wide: true,
		render: () => (
			<div className="q-sb-tile-stack">
				<ChatComposer
					label="Example message"
					defaultValue="Summarise run 8f21, failures first"
					hint="Enter to send"
				/>
			</div>
		),
	},
	{
		name: "ChatMessage",
		blurb: "One turn: a soft bubble for a person, plain prose for Claude.",
		wide: true,
		render: () => (
			<div className="q-sb-tile-stack">
				<ChatMessage from="user" showCopy={false}>
					Why is September’s invoice higher?
				</ChatMessage>
				<ChatMessage status="streaming" showCopy={false}>
					<p>The backfill on the 10th ran 38 hours on</p>
				</ChatMessage>
			</div>
		),
	},
	{
		name: "ToolCall",
		blurb: "What Claude did inside a reply, folded to one line you can open.",
		wide: true,
		render: () => (
			<div className="q-sb-tile-stack">
				<ToolCall name="query_database" status="done" duration={840} summary="runs · 7 days" />
				<ToolCall name="web_search" status="running" summary="runner queue limits" />
				<ToolCall name="send_email" status="error" duration={2100} summary="to 3 owners" />
			</div>
		),
	},
	{
		name: "Attachment",
		blurb: "A file in a conversation: a chip in the composer, a card in a message.",
		render: () => (
			<div className="q-sb-tile-row">
				<Attachment
					name="invoice.pdf"
					size={1_240_000}
					type="application/pdf"
					onRemove={() => {}}
				/>
				<Attachment
					name="runs.png"
					size={284_000}
					type="image/png"
					src={IMAGE}
					onRemove={() => {}}
				/>
			</div>
		),
	},
	{
		name: "PromptSuggestions",
		blurb: "A few concrete starts for an empty thread instead of a blank box.",
		render: () => (
			<PromptSuggestions
				label="Example starters"
				suggestions={["Summarise this run", "Draft a reply", "Explain this invoice"]}
			/>
		),
	},
	{
		name: "CodeBlock",
		blurb: "Code in a reply: mono, a language label and Copy, no highlighter.",
		wide: true,
		render: () => (
			<div className="q-sb-tile-stack">
				<CodeBlock
					language="sql"
					code={"select count(*) as runs\nfrom runs\nwhere status = 'failed';"}
				/>
			</div>
		),
	},
];
