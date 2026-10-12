import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "../../../components/core/Icon";
import { Link } from "../../../components/core/Link";
import { Text } from "../../../components/core/Text";
import { Column, Row } from "../Story";

const meta = {
	title: "Components/Core/Link",
	component: Link,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { children: "Billing guide", href: "#billing", variant: "default", underline: "hover" },
	argTypes: {
		rightIcon: { control: false },
		ref: { table: { disable: true } },
	},
} satisfies Meta<typeof Link>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
	render: () => (
		<Row>
			<Link href="#run">View run</Link>
			<Link href="#run" variant="primary">
				View run
			</Link>
			<Link href="#run" variant="muted">
				View run
			</Link>
		</Row>
	),
};

export const Underline: Story = {
	parameters: {
		docs: {
			description: {
				story: "`hover` (default) firms up a soft underline; `always` for links in dense prose.",
			},
		},
	},
	render: () => (
		<Row>
			<Link href="#a" underline="hover">
				Hover
			</Link>
			<Link href="#a" underline="always">
				Always
			</Link>
			<Link href="#a" underline="none">
				None
			</Link>
		</Row>
	),
};

export const Sizes: Story = {
	parameters: {
		docs: { description: { story: "`inherit` (default) takes the size of the text around it." } },
	},
	render: () => (
		<Row>
			<Link href="#a" size="sm">
				Small
			</Link>
			<Link href="#a" size="md">
				Medium
			</Link>
			<Link href="#a" size="lg">
				Large
			</Link>
		</Row>
	),
};

export const External: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'`external` opens a new tab, adds the arrow and tells screen readers "(opens in new tab)".',
			},
		},
	},
	render: () => (
		<Row>
			<Link href="https://example.com/api" external>
				API reference
			</Link>
			<Link href="#artifacts" rightIcon={<Icon name="arrow-right" />}>
				All artifacts
			</Link>
		</Row>
	),
};

export const InText: Story = {
	render: () => (
		<Column>
			<Text>
				Invoices are emailed on the first of the month. Read the{" "}
				<Link href="#billing">billing guide</Link> or the{" "}
				<Link href="https://example.com/api" external>
					API reference
				</Link>
				.
			</Text>
		</Column>
	),
};
