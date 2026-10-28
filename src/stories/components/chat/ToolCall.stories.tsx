import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ChatMessage } from "../../../components/chat/ChatMessage";
import { ToolCall } from "../../../components/chat/ToolCall";
import { Button } from "../../../components/core/Button";
import { Column, Note, Row } from "../Story";

const meta = {
	title: "Components/Chat/ToolCall",
	component: ToolCall,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		name: "query_database",
		kind: "tool",
		status: "done",
		duration: 840,
		summary: "runs · last 7 days",
		input: { table: "runs", range: "7d" },
		output: "7 rows · 412 runs",
	},
	argTypes: {
		summary: { control: "text" },
		children: { control: false },
		onOpenChange: { control: false },
	},
	decorators: [
		(Story) => (
			<Column wide>
				<Story />
			</Column>
		),
	],
} satisfies Meta<typeof ToolCall>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
	parameters: {
		docs: {
			description: {
				story: "Running, done, failed, and a thinking pass. Open one for its input and output.",
			},
		},
	},
	render: () => (
		<Column wide>
			<ToolCall name="web_search" status="running" summary="self-hosted runner queue limits" />
			<ToolCall
				name="query_database"
				status="done"
				duration={840}
				summary="runs · last 7 days"
				input={{ table: "runs", range: "7d" }}
				output="7 rows · 412 runs"
			/>
			<ToolCall
				name="send_email"
				status="error"
				duration={2100}
				summary="to 3 workspace owners"
				input={{ to: ["ada", "leo", "mira"], template: "runner-paused" }}
				output="SMTP 421: try again later"
			/>
			<ToolCall
				kind="thinking"
				status="done"
				duration={3400}
				summary="Weighing the two release notes"
				output="The second draft is shorter and keeps the one change that matters; the first buries it in the third sentence."
			/>
		</Column>
	),
};

export const Open: Story = {
	parameters: { docs: { description: { story: "`defaultOpen`: input and output in mono." } } },
	args: { defaultOpen: true },
};

export const Failed: Story = {
	args: {
		name: "approve_invoice",
		status: "error",
		duration: 1200,
		summary: "INV-2041 · $3,180",
		input: { invoice: "INV-2041", approver: "mira" },
		output: "403: approver lacks the billing role",
		defaultOpen: true,
	},
};

function Controlled() {
	const [open, setOpen] = useState(false);
	return (
		<Column wide>
			<Row>
				<Button size="sm" variant="secondary" onClick={() => setOpen((o) => !o)}>
					{open ? "Collapse" : "Expand"} from outside
				</Button>
			</Row>
			<ToolCall
				name="list_artifacts"
				status="done"
				duration={310}
				summary="run 8f21 · 3 artifacts"
				input={{ run: "8f21" }}
				output={["report.pdf", "diff.patch", "screenshot.png"]}
				open={open}
				onOpenChange={setOpen}
			/>
			<Note>{`open = ${open}: the story owns it through \`open\` + \`onOpenChange\`.`}</Note>
		</Column>
	);
}

export const ControlledOpen: Story = { render: () => <Controlled /> };

const LONG_URL = `https://api.open-meteo.com/v1/forecast?latitude=45.32&longitude=-75.67&hourly=${"temperature_2m,".repeat(40)}`;

export const LongSummary: Story = {
	parameters: {
		docs: {
			description: {
				story: "A summary that never wraps truncates inside a reply instead of widening it.",
			},
		},
	},
	render: () => (
		<Column wide>
			<ChatMessage from="assistant" name="Claude">
				<ToolCall name="Web fetch" status="error" summary={LONG_URL} input={{ url: LONG_URL }} />
			</ChatMessage>
		</Column>
	),
};
