import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, useState } from "react";
import { Button } from "../../../components/core/Button";
import { Dialog } from "../../../components/feedback/Dialog";
import { TextField } from "../../../components/forms/TextField";
import { Note, Row } from "../Story";

type DialogDemoProps = Omit<ComponentProps<typeof Dialog>, "open" | "onClose"> & {
	trigger?: string;
};

// Dialogs open from a button: an open modal makes the rest of the page inert, Docs included.
function DialogDemo({ trigger = "Open dialog", actions, ...props }: DialogDemoProps) {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);
	return (
		<>
			<Button variant="secondary" onClick={() => setOpen(true)}>
				{trigger}
			</Button>
			<Dialog
				{...props}
				open={open}
				onClose={close}
				actions={
					actions ?? (
						<>
							<Button variant="ghost" onClick={close}>
								Cancel
							</Button>
							<Button variant="destructive" onClick={close}>
								Delete runner
							</Button>
						</>
					)
				}
			/>
		</>
	);
}

const meta = {
	title: "Components/Feedback/Dialog",
	component: Dialog,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		open: false,
		eyebrow: "Runner · Meerkat",
		title: "Delete this runner?",
		children: "Its schedule and history go with it. Runs in progress finish first.",
		size: "md",
		dismissible: true,
		showClose: true,
	},
	argTypes: {
		open: { control: false },
		onClose: { control: false },
		eyebrow: { control: "text" },
		title: { control: "text" },
		children: { control: "text" },
		icon: {
			control: "select",
			options: ["none", "info", "success", "warning", "error"],
			mapping: { none: undefined },
		},
		actions: { control: false },
	},
	render: ({ open: _open, onClose: _onClose, ...args }) => <DialogDemo {...args} />,
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const StatusIcons: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`icon` draws the bare status icon above the title: warning and error in the accent, info and success in ink.",
			},
		},
	},
	render: () => (
		<Row>
			<DialogDemo
				trigger="Info"
				icon="info"
				title="Runs pause on Sunday"
				actions={<Button>Got it</Button>}
			>
				Maintenance runs from 02:00 to 03:00 UTC. Scheduled runs start again after.
			</DialogDemo>
			<DialogDemo
				trigger="Success"
				icon="success"
				title="Workspace created"
				actions={<Button>Open workspace</Button>}
			>
				Northwind is ready. Invite your team or connect a repository next.
			</DialogDemo>
			<DialogDemo trigger="Warning" icon="warning" title="Delete this runner?">
				Its schedule and history go with it. Runs in progress finish first.
			</DialogDemo>
			<DialogDemo
				trigger="Error"
				icon="error"
				title="Deploy failed"
				actions={<Button>View logs</Button>}
			>
				Run #4182 stopped at the migrate step. Nothing was released.
			</DialogDemo>
		</Row>
	),
};

export const Sizes: Story = {
	parameters: {
		docs: { description: { story: "`size` sets the max width; `width` (px) overrides it." } },
	},
	render: () => (
		<Row>
			{(["sm", "md", "lg", "xl"] as const).map((size) => (
				<DialogDemo
					key={size}
					trigger={`Size ${size}`}
					size={size}
					title="Rename artifact"
					actions={<Button>Done</Button>}
				>
					Artifacts keep their history when renamed. Links to the old name redirect.
				</DialogDemo>
			))}
		</Row>
	),
};

export const NonDismissible: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`dismissible={false}`: no Escape, no scrim click, no close button. The actions are the only way out.",
			},
		},
	},
	render: () => (
		<DialogDemo trigger="Review approval" dismissible={false} title="Approve this deploy?">
			Run #4182 wants to release billing-service 2.14 to production. Choose one to continue.
		</DialogDemo>
	),
};

function RenameDemo() {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("Northwind");
	const [draft, setDraft] = useState(name);
	return (
		<Row>
			<Button
				variant="secondary"
				onClick={() => {
					setDraft(name);
					setOpen(true);
				}}
			>
				Rename workspace
			</Button>
			<Note>Current name: {name}</Note>
			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				size="sm"
				eyebrow="Workspace settings"
				title="Rename workspace"
				actions={
					<>
						<Button variant="ghost" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button
							disabled={!draft.trim()}
							onClick={() => {
								setName(draft.trim());
								setOpen(false);
							}}
						>
							Save
						</Button>
					</>
				}
			>
				<TextField
					label="Workspace name"
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
				/>
			</Dialog>
		</Row>
	);
}

export const WithAForm: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Focus moves into the dialog and is trapped there; it returns to the trigger on close.",
			},
		},
	},
	render: () => <RenameDemo />,
};
