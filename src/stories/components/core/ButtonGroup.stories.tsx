import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../../components/core/Button";
import { ButtonGroup } from "../../../components/core/ButtonGroup";
import { Icon } from "../../../components/core/Icon";
import { Column, Row } from "../Story";

const meta = {
	title: "Components/Core/ButtonGroup",
	component: ButtonGroup,
	subcomponents: { Button },
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		label: "Run actions",
		spacing: "sm",
		children: (
			<>
				<Button size="sm">Approve</Button>
				<Button size="sm" variant="secondary">
					Reject
				</Button>
			</>
		),
	},
	argTypes: {
		spacing: { control: "select", options: ["sm", "md", "lg"] },
		children: { control: false },
		ref: { table: { disable: true } },
	},
} satisfies Meta<typeof ButtonGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Spacing: Story = {
	parameters: {
		docs: { description: { story: "`sm`, `md`, `lg`, or a number of pixels between buttons." } },
	},
	render: () => (
		<Column>
			{(["sm", "md", "lg"] as const).map((s) => (
				<Row key={s} label={s}>
					<ButtonGroup spacing={s}>
						<Button size="sm">Approve</Button>
						<Button size="sm" variant="secondary">
							Reject
						</Button>
					</ButtonGroup>
				</Row>
			))}
		</Column>
	),
};

export const Attached: Story = {
	parameters: {
		docs: {
			description: { story: "`attached` joins secondaries into one segmented pill." },
		},
	},
	render: () => (
		<ButtonGroup attached label="Range">
			<Button variant="secondary" size="sm">
				Day
			</Button>
			<Button variant="secondary" size="sm">
				Week
			</Button>
			<Button variant="secondary" size="sm">
				Month
			</Button>
		</ButtonGroup>
	),
};

export const Toolbar: Story = {
	parameters: {
		docs: {
			description: { story: "Icon buttons in an attached group; `label` names the group." },
		},
	},
	render: () => (
		<ButtonGroup attached label="Artifact actions">
			<Button variant="secondary" size="sm" icon={<Icon name="copy" />} aria-label="Copy" />
			<Button variant="secondary" size="sm" icon={<Icon name="download" />} aria-label="Download" />
			<Button variant="secondary" size="sm" icon={<Icon name="link" />} aria-label="Copy link" />
		</ButtonGroup>
	),
};

export const Vertical: Story = {
	render: () => (
		<ButtonGroup vertical label="Invoice actions">
			<Button size="sm">Pay invoice</Button>
			<Button size="sm" variant="secondary">
				Download PDF
			</Button>
			<Button size="sm" variant="ghost">
				Dispute
			</Button>
		</ButtonGroup>
	),
};

export const FullWidth: Story = {
	render: () => (
		<Column>
			<ButtonGroup fullWidth label="Confirm">
				<Button variant="secondary">Cancel</Button>
				<Button>Create workspace</Button>
			</ButtonGroup>
		</Column>
	),
};
