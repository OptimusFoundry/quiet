import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { type ChatAttachment, ChatComposer } from "../../../components/chat/ChatComposer";
import { Column, Note } from "../Story";
import { IMAGE } from "./fixtures";
import "./ChatComposer.scss";

const meta = {
	title: "Components/Chat/ChatComposer",
	component: ChatComposer,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		label: "Message",
		placeholder: "Ask about a run, or drop files here",
		accept: "image/*,.pdf,.csv,.txt,.md",
		maxFiles: 4,
		maxSize: 5 * 1024 * 1024,
		hint: "4 files · 5 MB each",
		busy: false,
		disabled: false,
	},
	argTypes: {
		toolbar: { control: false },
		hint: { control: "text" },
		onChange: { control: false },
		onSubmit: { control: false },
		onStop: { control: false },
		onAttachmentsChange: { control: false },
		attachments: { control: false },
		defaultAttachments: { control: false },
		progress: { control: false },
	},
	decorators: [
		(Story) => (
			<Column wide>
				<Story />
			</Column>
		),
	],
} satisfies Meta<typeof ChatComposer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Enter sends, Shift+Enter is a new line. Attach, drag a file onto the box, or paste an image.",
			},
		},
	},
};

export const WithToolbar: Story = {
	parameters: {
		docs: {
			description: { story: "`toolbar` (left) for a model or tool picker; `hint` (right)." },
		},
	},
	render: (args) => (
		<ChatComposer
			{...args}
			toolbar={<span className="q-sb-chat-composer__model">Claude Opus 5.5</span>}
			hint="Enter to send"
		/>
	),
};

function Uploading() {
	const [files, setFiles] = useState<ChatAttachment[]>([
		{ id: "u1", name: "q3-invoices.pdf", size: 4_200_000, type: "application/pdf" },
		{ id: "u2", name: "runs.csv", size: 82_000, type: "text/csv" },
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
			defaultValue="Here are the invoices and the raw run counts. What’s missing?"
			hint="Uploading…"
		/>
	);
}

export const UploadingFiles: Story = {
	parameters: {
		docs: {
			description: {
				story: "Attachments controlled by the story; `progress` by id fills each chip.",
			},
		},
	},
	render: () => <Uploading />,
};

export const Responding: Story = {
	parameters: {
		docs: { description: { story: "`busy`: Send becomes Stop and Enter doesn’t send." } },
	},
	args: { busy: true, placeholder: "Claude is responding…" },
};

export const Disabled: Story = {
	args: { disabled: true, placeholder: "This workspace is read-only" },
};

function Controlled() {
	const [value, setValue] = useState("Summarise run 8f21");
	const [sent, setSent] = useState<string[]>([]);
	return (
		<Column wide>
			<ChatComposer
				label="Message, controlled example"
				value={value}
				onChange={setValue}
				onSubmit={({ text }) => {
					setSent((s) => [...s, text]);
					setValue("");
				}}
			/>
			<Note>
				{sent.length ? `Sent: ${sent.join(" · ")}` : `value = "${value}". Press Enter to send.`}
			</Note>
		</Column>
	);
}

export const ControlledValue: Story = { render: () => <Controlled /> };
