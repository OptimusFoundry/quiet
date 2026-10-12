import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "../../../components/core/Icon";
import { ICON_ALIASES, ICONS, type IconName } from "../../../components/core/icons";
import { Text } from "../../../components/core/Text";
import { Column, Row } from "../Story";
import "./Icon.scss";

const NAMES = Object.keys(ICONS) as IconName[];

const meta = {
	title: "Components/Core/Icon",
	component: Icon,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { name: "runs", size: "lg", color: "inherit" },
	argTypes: {
		size: { control: "select", options: ["xs", "sm", "md", "lg", "xl", "2xl"] },
		color: {
			control: "select",
			options: ["inherit", "default", "muted", "quiet", "primary", "success", "warning", "error"],
		},
		name: { control: "select", options: NAMES },
		ref: { table: { disable: true } },
	},
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Gallery: Story = {
	parameters: {
		docs: {
			description: {
				story: `Every icon in the set (\`ICONS\` in \`icons.ts\`). Old names still resolve: ${Object.entries(
					ICON_ALIASES,
				)
					.map(([from, to]) => `\`${from}\` → \`${to}\``)
					.join(", ")}.`,
			},
		},
	},
	render: () => (
		<div className="q-sb-icon">
			{NAMES.map((name) => (
				<div key={name} className="q-sb-icon__cell">
					<Icon name={name} size="lg" />
					<span className="q-sb-icon__name">{name}</span>
				</div>
			))}
		</div>
	),
};

export const Sizes: Story = {
	parameters: {
		docs: { description: { story: "Named steps, or a number for a custom pixel size." } },
	},
	render: () => (
		<Row>
			<Icon name="approvals" size="xs" />
			<Icon name="approvals" size="sm" />
			<Icon name="approvals" size="md" />
			<Icon name="approvals" size="lg" />
			<Icon name="approvals" size="xl" />
			<Icon name="approvals" size="2xl" />
			<Icon name="approvals" size={40} />
		</Row>
	),
};

export const Colors: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`inherit` (default) follows the text colour; the others read quiet's ink and status tokens.",
			},
		},
	},
	render: () => (
		<Row>
			<Icon name="info" size="lg" color="default" />
			<Icon name="info" size="lg" color="muted" />
			<Icon name="info" size="lg" color="quiet" />
			<Icon name="info" size="lg" color="primary" />
			<Icon name="check" size="lg" color="success" />
			<Icon name="warning" size="lg" color="warning" />
			<Icon name="close" size="lg" color="error" />
		</Row>
	),
};

export const InText: Story = {
	parameters: {
		docs: {
			description: {
				story: "Sized in em, so it matches the text beside it at any size.",
			},
		},
	},
	render: () => (
		<Column>
			<Text size="sm">
				<Icon name="runs" /> 12 runs queued
			</Text>
			<Text size="lg">
				<Icon name="runs" /> 12 runs queued
			</Text>
		</Column>
	),
};

export const Labelled: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Decorative (`aria-hidden`) by default. Give `label` when the icon carries meaning on its own.",
			},
		},
	},
	render: () => (
		<Row>
			<Icon name="warning" size="lg" color="warning" label="Needs approval" />
			<Text size="sm" color="muted">
				Announced as "Needs approval"
			</Text>
		</Row>
	),
};
