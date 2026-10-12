import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../../components/core/Button";
import { Icon } from "../../../components/core/Icon";
import { Tooltip } from "../../../components/feedback/Tooltip";
import { Note, Row } from "../Story";
import "./Tooltip.scss";

const meta = {
	title: "Components/Feedback/Tooltip",
	component: Tooltip,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		content: "Copies the run link",
		placement: "top",
		delay: 0,
		children: (
			<Button variant="secondary" leftIcon={<Icon name="link" />}>
				Copy link
			</Button>
		),
	},
	argTypes: {
		content: { control: "text" },
		children: { control: false },
	},
	render: (args) => (
		<div className="q-sb-tooltip">
			<Tooltip {...args} />
		</div>
	),
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Placements: Story = {
	parameters: {
		docs: { description: { story: "Hover or focus each button. Escape closes the tooltip." } },
	},
	render: () => (
		<div className="q-sb-tooltip">
			<Row>
				{(
					[
						["top", "Top"],
						["bottom", "Bottom"],
						["left", "Left"],
						["right", "Right"],
					] as const
				).map(([placement, label]) => (
					<Tooltip key={placement} content={`Shown ${placement}`} placement={placement}>
						<Button variant="secondary">{label}</Button>
					</Tooltip>
				))}
			</Row>
		</div>
	),
};

export const OnIconButtons: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"The common case: name what an icon-only button does. The button keeps its own `aria-label`; the tooltip describes it.",
			},
		},
	},
	render: () => (
		<div className="q-sb-tooltip">
			<Row>
				<Tooltip content="Download artifact">
					<Button variant="ghost" icon={<Icon name="download" />} aria-label="Download" />
				</Tooltip>
				<Tooltip content="Copy run ID">
					<Button variant="ghost" icon={<Icon name="copy" />} aria-label="Copy" />
				</Tooltip>
				<Tooltip content="Open in a new tab">
					<Button variant="ghost" icon={<Icon name="external" />} aria-label="Open" />
				</Tooltip>
			</Row>
		</div>
	),
};

export const WithDelay: Story = {
	parameters: {
		docs: {
			description: { story: "`delay` (ms) waits before showing, for dense toolbars." },
		},
	},
	render: () => (
		<div className="q-sb-tooltip">
			<Tooltip content="Shown after 500ms" delay={500}>
				<Button variant="secondary">Hover and wait</Button>
			</Tooltip>
		</div>
	),
};

export const OnPlainText: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"A plain element trigger becomes focusable (`tabIndex=0`) so keyboard users reach the tooltip too.",
			},
		},
	},
	render: () => (
		<div className="q-sb-tooltip">
			<Note>
				Billed on{" "}
				<Tooltip content="1 October 2026, 00:00 UTC">
					<span className="q-sb-tooltip__term">1 Oct</span>
				</Tooltip>{" "}
				to the Northwind workspace.
			</Note>
		</div>
	),
};

export const LongContent: Story = {
	parameters: {
		docs: { description: { story: "The bubble wraps at 240px." } },
	},
	render: () => (
		<div className="q-sb-tooltip">
			<Tooltip content="Approvers are workspace members with the maintainer role. A run waits up to 24 hours for one of them.">
				<Button variant="secondary" rightIcon={<Icon name="help" />}>
					Who can approve?
				</Button>
			</Tooltip>
		</div>
	),
};
