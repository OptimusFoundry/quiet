import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "../../../components/core/Spinner";
import { Row } from "../Story";
import "./Spinner.scss";

const meta = {
	title: "Components/Core/Spinner",
	component: Spinner,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { size: "md", tone: "default" },
	argTypes: {
		size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
		tone: { control: "select", options: ["default", "muted", "on-accent", "accent"] },
		ref: { table: { disable: true } },
	},
} satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
	parameters: {
		docs: { description: { story: "From 32px up the ring draws a thicker stroke." } },
	},
	render: () => (
		<Row>
			<Spinner size="xs" />
			<Spinner size="sm" />
			<Spinner size="md" />
			<Spinner size="lg" />
			<Spinner size="xl" />
		</Row>
	),
};

export const Tones: Story = {
	parameters: {
		docs: {
			description: {
				story: "`on-accent` is for an accent fill (a primary button shows it while loading).",
			},
		},
	},
	render: () => (
		<Row>
			<Spinner tone="default" />
			<Spinner tone="muted" />
			<Spinner tone="accent" />
			<span className="q-sb-spinner__on-accent">
				<Spinner tone="on-accent" size="sm" />
			</span>
		</Row>
	),
};

export const WithLabel: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'`label` shows beside the ring and names the `role="status"`; without it the name is "Loading".',
			},
		},
	},
	render: () => (
		<Row>
			<Spinner size="sm" label="Starting runner" />
		</Row>
	),
};
