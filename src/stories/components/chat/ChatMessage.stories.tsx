import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatMessage, ClaudeMark } from "../../../components/chat/ChatMessage";
import { CodeBlock } from "../../../components/chat/CodeBlock";
import { ToolCall } from "../../../components/chat/ToolCall";
import { Column, Row } from "../Story";
import { IMAGE, SQL } from "./fixtures";

const noop = () => {};

const meta = {
	title: "Components/Chat/ChatMessage",
	component: ChatMessage,
	subcomponents: { ClaudeMark },
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		from: "assistant",
		children:
			"Three runs failed overnight, all on the self-hosted runner in eu-west. Each one timed out waiting for the artifact upload; the hosted runners were fine.",
		status: "done",
	},
	argTypes: {
		avatar: { control: false },
		actions: { control: false },
		error: { control: "text" },
		time: { control: "date" },
		onRetry: { control: false },
		onEdit: { control: false },
	},
	decorators: [
		(Story) => (
			<Column wide>
				<Story />
			</Column>
		),
	],
} satisfies Meta<typeof ChatMessage>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FromAPerson: Story = {
	parameters: {
		docs: {
			description: { story: "A soft bubble on the right, with attachments as cards above it." },
		},
	},
	render: () => (
		<ChatMessage
			from="user"
			time={new Date(2026, 9, 8, 9, 41)}
			attachments={[
				{ name: "invoice-2026-09.pdf", size: 1_240_000, type: "application/pdf" },
				{ name: "dashboard.png", size: 284_000, type: "image/png", src: IMAGE },
			]}
			onEdit={noop}
		>
			Why is September’s invoice higher? The dashboard shows fewer runs than August.
		</ChatMessage>
	),
};

export const FromClaude: Story = {
	parameters: {
		docs: {
			description: { story: "Plain prose under a name row, no bubble; a Copy icon and Retry." },
		},
	},
	render: () => (
		<ChatMessage time={new Date(2026, 9, 8, 9, 42)} onRetry={noop}>
			<p>
				Fewer runs, but longer ones. The backfill on the 10th ran 38 hours on hosted runners, which
				bill by the minute.
			</p>
			<p>Everything else is in line with August. I left the add-ons out; they didn’t change.</p>
		</ChatMessage>
	),
};

export const Streaming: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"A soft caret trails the text; assistive tech hears “Claude is responding” once, not every token.",
			},
		},
	},
	render: () => (
		<ChatMessage status="streaming">
			<p>Reading the run logs now. The first failure starts at</p>
		</ChatMessage>
	),
};

export const Failed: Story = {
	parameters: {
		docs: {
			description: { story: '`status="error"` keeps what arrived, shows `error` and Retry.' },
		},
	},
	render: () => (
		<ChatMessage
			status="error"
			error="The connection dropped before the reply finished."
			onRetry={noop}
		>
			<p>Comparing the two invoices, the biggest change is</p>
		</ChatMessage>
	),
};

export const WithToolCallAndCode: Story = {
	parameters: {
		docs: {
			description: { story: "A reply carries what Claude did (ToolCall) and code (CodeBlock)." },
		},
	},
	render: () => (
		<ChatMessage onRetry={noop}>
			<ToolCall
				name="query_database"
				status="done"
				duration={840}
				summary="runs · last 7 days"
				input={{ table: "runs", range: "7d" }}
				output="7 rows · 412 runs"
			/>
			<p>412 runs this week, 61% scheduled. This is the query I ran:</p>
			<CodeBlock language="sql" code={SQL} />
		</ChatMessage>
	),
};

export const System: Story = {
	render: () => (
		<ChatMessage from="system">Claude can now read artifacts in this workspace</ChatMessage>
	),
};

export const Mark: Story = {
	parameters: {
		docs: {
			description: { story: "`ClaudeMark`, the accent asterisk in a reply's name row." },
		},
	},
	render: () => (
		<Row>
			<ClaudeMark size="sm" />
			<ClaudeMark />
		</Row>
	),
};
