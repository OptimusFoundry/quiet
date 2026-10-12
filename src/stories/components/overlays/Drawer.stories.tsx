import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DescriptionList } from "../../../components/app/DescriptionList";
import { Badge } from "../../../components/core/Badge";
import { Button } from "../../../components/core/Button";
import { TextArea } from "../../../components/forms/TextArea";
import { Drawer, type DrawerProps } from "../../../components/overlays/Drawer";
import { Column, Note, Row } from "../Story";

// A drawer is modal and fixed to the viewport, so every story opens it from a button.
function DrawerDemo({
	label = "Open drawer",
	...props
}: Partial<DrawerProps> & { label?: string }) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button variant="secondary" onClick={() => setOpen(true)}>
				{label}
			</Button>
			<Drawer {...props} open={open} onClose={() => setOpen(false)} />
		</>
	);
}

const meta = {
	title: "Components/Overlays/Drawer",
	component: Drawer,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		open: false,
		eyebrow: "Run 482",
		title: "Reconcile March invoices",
		description: "Started by Ada Lovelace on eu-west-2, 12 minutes ago.",
		children:
			"The run matched 214 of 220 invoices against purchase orders. Six need a person to look at them before the export goes out.",
		side: "right",
		size: "md",
		dismissible: true,
	},
	argTypes: {
		open: { control: false },
		onClose: { control: false },
		eyebrow: { control: "text" },
		title: { control: "text" },
		description: { control: "text" },
		children: { control: "text" },
		footer: { control: false },
		accent: { table: { disable: true } },
	},
	render: ({ open: _open, onClose: _onClose, ...args }) => <DrawerDemo {...args} />,
} satisfies Meta<typeof Drawer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SidesAndSizes: Story = {
	parameters: {
		docs: {
			description: {
				story: "Right by default; `left` for navigation. `size` is sm, md, lg or a pixel width.",
			},
		},
	},
	render: (args) => (
		<Row>
			<DrawerDemo {...args} label="Left" side="left" />
			<DrawerDemo {...args} label="Small" size="sm" />
			<DrawerDemo {...args} label="Large" size="lg" />
			<DrawerDemo {...args} label="560px" size={560} />
		</Row>
	),
};

function ApprovalDemo() {
	const [open, setOpen] = useState(false);
	const [decision, setDecision] = useState<string | null>(null);
	const decide = (d: string) => {
		setDecision(d);
		setOpen(false);
	};
	return (
		<Column>
			<Row>
				<Button onClick={() => setOpen(true)}>Review approval</Button>
			</Row>
			<Note>{decision ? `Run 482 ${decision}.` : "Waiting for your sign-off."}</Note>
			<Drawer
				open={open}
				onClose={() => setOpen(false)}
				eyebrow="Approval"
				title="Send 6 vendor replies"
				description="The run drafted these replies; nothing is sent until you approve."
				footer={
					<>
						<Button variant="ghost" onClick={() => decide("rejected")}>
							Reject
						</Button>
						<Button onClick={() => decide("approved")}>Approve and send</Button>
					</>
				}
			>
				<Column>
					<DescriptionList
						items={[
							{ label: "Run", value: "run-482", mono: true },
							{ label: "Runner", value: "eu-west-2" },
							{ label: "Status", value: <Badge variant="warning">Waiting for approval</Badge> },
						]}
					/>
					<TextArea label="Note to the team" rows={3} placeholder="Optional" />
				</Column>
			</Drawer>
		</Column>
	);
}

export const WithFooter: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"A review pane: details, a field, and the decision in the footer. Focus is trapped inside.",
			},
		},
	},
	render: () => <ApprovalDemo />,
};

export const NotDismissible: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`dismissible={false}` drops the close button, Escape and the scrim click: the footer is the only way out.",
			},
		},
	},
	render: () => <BlockingDemo />,
};

function BlockingDemo() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button variant="secondary" onClick={() => setOpen(true)}>
				Rotate API key
			</Button>
			<Drawer
				open={open}
				dismissible={false}
				size="sm"
				title="Rotating the production key"
				description="Runs using the old key keep working for 10 minutes."
				footer={<Button onClick={() => setOpen(false)}>Done</Button>}
			>
				Copy the new key now: it won't be shown again.
			</Drawer>
		</>
	);
}
