import type { Meta, StoryObj } from "@storybook/react-vite";
import { HonestButton } from "../../../components/future/HonestButton";
import { Note, Row } from "../Story";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const meta = {
	title: "Components/Agent & trust/HonestButton",
	component: HonestButton,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { children: "Verify domain", expected: 4, size: "md" },
	argTypes: {
		children: { control: "text" },
		doneLabel: { control: "text" },
		onPress: { control: false },
	},
} satisfies Meta<typeof HonestButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ExpectedWait: Story = {
	parameters: {
		docs: {
			description: {
				story: "Length grows with the log of `expected`: a quick save is short, a render is long.",
			},
		},
	},
	render: () => (
		<Row>
			<HonestButton expected={0.3}>Save</HonestButton>
			<HonestButton expected={4}>Verify domain</HonestButton>
			<HonestButton expected={42}>Render 3 clips</HonestButton>
		</Row>
	),
};

export const RealWork: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`onPress` returns a promise. This one takes 3.2s against an estimate of 2s, so the fill holds just short of full until it settles.",
			},
		},
	},
	render: () => (
		<Row>
			<HonestButton expected={2} onPress={() => wait(3200)}>
				Sync contacts
			</HonestButton>
			<Note>Press it: the button is the progress bar, then says "Done".</Note>
		</Row>
	),
};

export const Sizes: Story = {
	render: () => (
		<Row>
			<HonestButton size="sm" expected={4}>
				Small
			</HonestButton>
			<HonestButton size="md" expected={4}>
				Medium
			</HonestButton>
			<HonestButton size="lg" expected={4}>
				Large
			</HonestButton>
		</Row>
	),
};

export const Disabled: Story = {
	render: () => (
		<Row>
			<HonestButton disabled expected={4}>
				Verify domain
			</HonestButton>
		</Row>
	),
};

export const CustomDoneLabel: Story = {
	render: () => (
		<Row>
			<HonestButton expected={1.5} doneLabel="Invoice sent" doneFor={2000}>
				Send invoice
			</HonestButton>
		</Row>
	),
};
