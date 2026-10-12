import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusDot } from "../../../components/core/StatusDot";
import { Text } from "../../../components/core/Text";
import { Column, Row } from "../Story";
import "./StatusDot.scss";

const meta = {
	title: "Components/Core/StatusDot",
	component: StatusDot,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { status: "live" },
	argTypes: {
		ref: { table: { disable: true } },
	},
} satisfies Meta<typeof StatusDot>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Statuses: Story = {
	parameters: {
		docs: { description: { story: "Live takes the accent dot; the others stay in ink." } },
	},
	render: () => (
		<Row>
			<StatusDot status="live" />
			<StatusDot status="prototype" />
			<StatusDot status="archived" />
		</Row>
	),
};

export const CustomLabel: Story = {
	render: () => (
		<Row>
			<StatusDot status="live" label="Deployed to production" />
			<StatusDot status="archived" label="Retired on 3 Oct" />
		</Row>
	),
};

const WORKSPACES = [
	{ name: "Invoice reconciliation", status: "live" },
	{ name: "Support triage agent", status: "prototype" },
	{ name: "Legacy billing export", status: "archived" },
] as const;

export const InAList: Story = {
	render: () => (
		<Column>
			{WORKSPACES.map((w) => (
				<div key={w.name} className="q-sb-status-dot__row">
					<Text size="sm">{w.name}</Text>
					<StatusDot status={w.status} />
				</div>
			))}
		</Column>
	),
};
