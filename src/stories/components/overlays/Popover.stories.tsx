import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../../components/core/Button";
import { Text } from "../../../components/core/Text";
import { TextField } from "../../../components/forms/TextField";
import { Popover } from "../../../components/overlays/Popover";
import { Column, Note, Row } from "../Story";
import "./Popover.scss";

const meta = {
	title: "Components/Overlays/Popover",
	component: Popover,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		trigger: <Button variant="secondary">Share run</Button>,
		title: "Share run 482",
		children: <Text>Anyone in the agentworks workspace can open it. Links expire in 7 days.</Text>,
		placement: "bottom",
		align: "center",
		width: 280,
		trapFocus: true,
		closeOnClickOutside: true,
		closeOnEscape: true,
		showClose: false,
	},
	argTypes: {
		trigger: { control: false },
		title: { control: "text" },
		children: { control: false },
		open: { control: false },
		onOpenChange: { control: false },
	},
	decorators: [
		(Story) => (
			<div className="q-sb-popover q-sb-popover--centred">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Placements: Story = {
	parameters: {
		docs: {
			description: { story: "`placement` picks the side, `align` the edge it lines up with." },
		},
	},
	render: (args) => (
		<Row>
			<Popover {...args} trigger={<Button variant="secondary">Top</Button>} placement="top" />
			<Popover
				{...args}
				trigger={<Button variant="secondary">Bottom start</Button>}
				align="start"
			/>
			<Popover {...args} trigger={<Button variant="secondary">Right</Button>} placement="right" />
		</Row>
	),
};

export const CloseOptions: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Escape and an outside click close it by default. `showClose` adds a ×; turning both off makes it sticky.",
			},
		},
	},
	render: () => (
		<Row>
			<Popover trigger={<Button variant="secondary">Default</Button>} title="Share this run">
				<Text>Escape or a click outside closes it.</Text>
			</Popover>
			<Popover
				trigger={<Button variant="secondary">With close</Button>}
				title="Invite a teammate"
				showClose
			>
				<Text>The × closes it too.</Text>
			</Popover>
			<Popover
				trigger={<Button variant="secondary">Sticky</Button>}
				title="Pinned note"
				closeOnClickOutside={false}
				closeOnEscape={false}
				showClose
			>
				<Text>Only the × or the trigger closes it.</Text>
			</Popover>
		</Row>
	),
};

function FormDemo() {
	const [open, setOpen] = useState(false);
	const [budget, setBudget] = useState("40");
	return (
		<Column>
			<Row>
				<Popover
					open={open}
					onOpenChange={setOpen}
					trigger={<Button variant="secondary">Budget: ${budget}</Button>}
					title="Monthly run budget"
					width={300}
				>
					<Column>
						<TextField
							label="Limit in dollars"
							value={budget}
							onChange={(e) => setBudget(e.target.value)}
						/>
						<Row>
							<Button size="sm" onClick={() => setOpen(false)}>
								Save
							</Button>
						</Row>
					</Column>
				</Popover>
			</Row>
			<Note>Controlled with `open` + `onOpenChange`. Focus moves to the field when it opens.</Note>
		</Column>
	);
}

export const WithAForm: Story = { render: () => <FormDemo /> };
