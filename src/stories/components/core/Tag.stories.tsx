import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Avatar } from "../../../components/core/Avatar";
import { Button } from "../../../components/core/Button";
import { Icon } from "../../../components/core/Icon";
import { Tag } from "../../../components/core/Tag";
import { Column, Note, Row } from "../Story";

const meta = {
	title: "Components/Core/Tag",
	component: Tag,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { children: "Billing", tone: "default", size: "md" },
	argTypes: {
		tone: { control: "select", options: ["default", "strong"] },
		icon: { control: false },
		avatar: { control: false },
		onRemove: { control: false },
		onSelect: { control: false },
		ref: { table: { disable: true } },
	},
} satisfies Meta<typeof Tag>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
	parameters: {
		docs: {
			description: {
				story: "`strong` sits on a deeper ground; `status` reads the theme's status tokens.",
			},
		},
	},
	render: () => (
		<Column>
			<Row label="Tone">
				<Tag>Billing</Tag>
				<Tag tone="strong">Production</Tag>
			</Row>
			<Row label="Status">
				<Tag status="info">Scheduled</Tag>
				<Tag status="success">Verified</Tag>
				<Tag status="warning">Expiring</Tag>
				<Tag status="error">Blocked</Tag>
			</Row>
		</Column>
	),
};

export const Sizes: Story = {
	render: () => (
		<Row>
			<Tag size="sm">Small</Tag>
			<Tag size="md">Medium</Tag>
		</Row>
	),
};

export const WithIconOrAvatar: Story = {
	parameters: {
		docs: { description: { story: "`avatar` takes an `xs` Avatar, flush left." } },
	},
	render: () => (
		<Row>
			<Tag icon={<Icon name="runs" />}>Runner</Tag>
			<Tag icon={<Icon name="file" />}>report.pdf</Tag>
			<Tag avatar={<Avatar name="Ada Lovelace" size="xs" />}>Ada Lovelace</Tag>
		</Row>
	),
};

export const Selectable: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`selectable` renders a toggle button (`aria-pressed`); selected takes the accent tint. Uncontrolled with `defaultSelected`.",
			},
		},
	},
	render: () => (
		<Row>
			<Tag selectable defaultSelected>
				Live
			</Tag>
			<Tag selectable>Prototype</Tag>
			<Tag selectable>Archived</Tag>
			<Tag selectable disabled>
				Deleted
			</Tag>
		</Row>
	),
};

function RemovableDemo() {
	const initial = ["invoices", "approvals", "nightly"];
	const [tags, setTags] = useState(initial);
	return (
		<Column>
			<Row>
				{tags.map((t) => (
					<Tag key={t} onRemove={() => setTags((all) => all.filter((x) => x !== t))}>
						{t}
					</Tag>
				))}
				{tags.length === 0 && (
					<Button variant="ghost" size="sm" onClick={() => setTags(initial)}>
						Reset
					</Button>
				)}
			</Row>
			<Note>The × fades the tag out, then calls `onRemove`; the parent drops it.</Note>
		</Column>
	);
}

export const Removable: Story = { render: () => <RemovableDemo /> };

function FiltersDemo() {
	const [tags, setTags] = useState(["Design", "Research", "Ops"]);
	const [picked, setPicked] = useState<string[]>(["Design"]);
	return (
		<Column>
			<Row>
				{tags.map((t) => (
					<Tag
						key={t}
						selectable
						selected={picked.includes(t)}
						onSelect={(on) => setPicked((p) => (on ? [...p, t] : p.filter((x) => x !== t)))}
						onRemove={() => setTags((all) => all.filter((x) => x !== t))}
					>
						{t}
					</Tag>
				))}
			</Row>
			<Note>Selected: {picked.filter((p) => tags.includes(p)).join(", ") || "none"}</Note>
		</Column>
	);
}

export const ControlledFilters: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Selectable and removable, controlled with `selected`/`onSelect`: the label and the × are sibling buttons.",
			},
		},
	},
	render: () => <FiltersDemo />,
};
