import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef } from "react";
import { Button } from "../../../components/core/Button";
import { ButtonGroup } from "../../../components/core/ButtonGroup";
import { Icon } from "../../../components/core/Icon";
import { Column, Note, Row } from "../Story";

const meta = {
	title: "Components/Core/Button",
	component: Button,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { children: "Save changes", variant: "primary", size: "md" },
	argTypes: {
		leftIcon: { control: false },
		rightIcon: { control: false },
		icon: { control: false },
		ref: { table: { disable: true } },
	},
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
	parameters: {
		docs: {
			description: { story: "One primary per view. Ghost for toolbars, destructive to delete." },
		},
	},
	render: () => (
		<Row>
			<Button>Primary</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="destructive">Delete</Button>
		</Row>
	),
};

export const Sizes: Story = {
	render: () => (
		<Row>
			<Button size="sm">Small</Button>
			<Button size="md">Medium</Button>
			<Button size="lg">Large</Button>
		</Row>
	),
};

export const WithIcons: Story = {
	parameters: {
		docs: { description: { story: "Icon-only buttons are circles and need an `aria-label`." } },
	},
	render: () => (
		<Row>
			<Button variant="secondary" leftIcon={<Icon name="plus" />}>
				Add field
			</Button>
			<Button arrow>Continue</Button>
			<Button variant="ghost" icon={<Icon name="more" />} aria-label="More" />
			<Button variant="secondary" size="sm" icon={<Icon name="plus" />} aria-label="Add" />
		</Row>
	),
};

export const States: Story = {
	parameters: {
		docs: {
			description: {
				story: "Loading keeps the width, shows a spinner and blocks clicks; disabled dims.",
			},
		},
	},
	render: () => (
		<Row>
			<Button loading>Saving</Button>
			<Button variant="secondary" loading>
				Saving
			</Button>
			<Button disabled>Disabled</Button>
			<Button variant="secondary" disabled>
				Disabled
			</Button>
		</Row>
	),
};

export const AsLink: Story = {
	parameters: {
		docs: {
			description: {
				story: "`href` renders an `<a>` (through `QuietRoot linkComponent` when one is set).",
			},
		},
	},
	render: () => (
		<Row>
			<Button href="#billing" variant="secondary" arrow>
				Open billing
			</Button>
		</Row>
	),
};

export const FullWidth: Story = {
	render: () => (
		<Column>
			<Button fullWidth>Create workspace</Button>
			<Button fullWidth variant="secondary">
				Cancel
			</Button>
		</Column>
	),
};

export const InAGroup: Story = {
	parameters: { docs: { description: { story: "`ButtonGroup attached` joins a segmented set." } } },
	render: () => (
		<ButtonGroup attached>
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

function RefDemo() {
	const target = useRef<HTMLButtonElement>(null);
	return (
		<Column>
			<Row>
				<Button variant="secondary" onClick={() => target.current?.focus()}>
					Focus the other button
				</Button>
				<Button ref={target} data-testid="target">
					Target
				</Button>
			</Row>
			<Note>`ref` reaches the native button; rest props (`data-*`, `aria-*`) land on it too.</Note>
		</Column>
	);
}

export const RefAndRestProps: Story = { render: () => <RefDemo /> };
