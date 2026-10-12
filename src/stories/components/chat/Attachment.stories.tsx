import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import { Attachment } from "../../../components/chat/Attachment";
import { Button } from "../../../components/core/Button";
import { Column, Note, Row } from "../Story";
import { IMAGE } from "./fixtures";

const noop = () => {};

const meta = {
	title: "Components/Chat/Attachment",
	component: Attachment,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		name: "invoice-2026-09.pdf",
		size: 1_240_000,
		type: "application/pdf",
		variant: "chip",
		status: "done",
		onRemove: noop,
	},
	argTypes: {
		file: { control: false },
		error: { control: "text" },
		onRemove: { control: false },
		onOpen: { control: false },
		removeRef: { table: { disable: true } },
	},
} satisfies Meta<typeof Attachment>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Chips: Story = {
	parameters: {
		docs: {
			description: {
				story: "Waiting in the composer, removable. Images show themselves; documents their type.",
			},
		},
	},
	render: () => (
		<Row>
			<Attachment name="board-deck.pdf" size={4_200_000} type="application/pdf" onRemove={noop} />
			<Attachment name="runs.csv" size={82_000} type="text/csv" onRemove={noop} />
			<Attachment
				name="dashboard.png"
				size={284_000}
				type="image/png"
				src={IMAGE}
				onRemove={noop}
			/>
		</Row>
	),
};

export const UploadStates: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Uploading with `progress` (0–1), indeterminate without it, and an error in place of the size.",
			},
		},
	},
	render: () => (
		<Row>
			<Attachment
				name="run-recording.m4a"
				size={18_000_000}
				type="audio/mp4"
				status="uploading"
				progress={0.42}
				onRemove={noop}
			/>
			<Attachment
				name="artifacts.zip"
				size={60_000_000}
				type="application/zip"
				status="uploading"
				onRemove={noop}
			/>
			<Attachment
				name="contract.docx"
				size={210_000}
				status="error"
				error="Too large, 20 MB max"
				onRemove={noop}
			/>
		</Row>
	),
};

export const Cards: Story = {
	parameters: {
		docs: {
			description: {
				story: "Sent with a message: `onOpen` makes it a button, `href` a link.",
			},
		},
	},
	render: () => (
		<Row>
			<Attachment
				variant="card"
				name="dashboard.png"
				size={640_000}
				type="image/png"
				src={IMAGE}
				onOpen={noop}
			/>
			<Attachment variant="card" name="q3-invoices.xlsx" size={96_000} onOpen={noop} />
			<Attachment
				variant="card"
				name="runbook.pdf"
				size={320_000}
				type="application/pdf"
				href="#runbook"
			/>
		</Row>
	),
};

export const LongName: Story = {
	render: () => (
		<Row>
			<Attachment
				name="billing-runner-approval-log-workspace-acme-2026-09-30-final-v2.csv"
				size={1_900_000}
				type="text/csv"
				onRemove={noop}
			/>
		</Row>
	),
};

function RemoveFocus() {
	const [files, setFiles] = useState(["runs.csv", "invoice.pdf", "notes.md"]);
	const add = useRef<HTMLButtonElement>(null);
	return (
		<Column>
			<Row>
				{files.map((name) => (
					<Attachment
						key={name}
						name={name}
						size={42_000}
						onRemove={() => {
							setFiles((f) => f.filter((x) => x !== name));
							add.current?.focus();
						}}
					/>
				))}
			</Row>
			<Row>
				<Button
					ref={add}
					size="sm"
					variant="secondary"
					onClick={() => setFiles(["runs.csv", "invoice.pdf", "notes.md"])}
				>
					Reset files
				</Button>
			</Row>
			<Note>
				Removing a chip takes its button away: move focus somewhere sensible (here, Reset).
				`removeRef` reaches each remove button.
			</Note>
		</Column>
	);
}

export const RemovingFiles: Story = { render: () => <RemoveFocus /> };
