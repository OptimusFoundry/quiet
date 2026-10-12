import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import { Button } from "../../../components/core/Button";
import { Icon } from "../../../components/core/Icon";
import { TextField } from "../../../components/forms/TextField";
import { Column, Note, Row } from "../Story";
import { FormDemo } from "./FormDemo";

const meta = {
	title: "Components/Forms/TextField",
	component: TextField,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		label: "Workspace name",
		placeholder: "Acme research",
		helperText: "Shown on invoices and in the workspace switcher.",
		size: "md",
		variant: "default",
	},
	argTypes: {
		label: { control: "text" },
		helperText: { control: "text" },
		error: { control: "text" },
		leftIcon: { control: false },
		rightIcon: { control: false },
		onChange: { control: false },
		ref: { table: { disable: true } },
	},
	decorators: [
		(Story) => (
			<Column>
				<Story />
			</Column>
		),
	],
} satisfies Meta<typeof TextField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
	parameters: {
		docs: { description: { story: "Filled sits on a well ground, for fields inside a Panel." } },
	},
	render: () => (
		<>
			<TextField label="Default" placeholder="Run name" />
			<TextField label="Filled" variant="filled" placeholder="Run name" />
		</>
	),
};

export const Sizes: Story = {
	render: () => (
		<>
			<TextField label="Small" size="sm" defaultValue="nightly-eval" />
			<TextField label="Medium" size="md" defaultValue="nightly-eval" />
			<TextField label="Large" size="lg" defaultValue="nightly-eval" />
		</>
	),
};

function PasswordField() {
	const [shown, setShown] = useState(false);
	return (
		<TextField
			label="API key"
			type={shown ? "text" : "password"}
			defaultValue="sk-live-4f9a2c"
			leftIcon={<Icon name="key" />}
			rightIcon={
				<Button variant="ghost" size="sm" onClick={() => setShown(!shown)} aria-pressed={shown}>
					{shown ? "Hide" : "Show"}
				</Button>
			}
		/>
	);
}

export const WithIcons: Story = {
	parameters: {
		docs: {
			description: {
				story: "The left icon is decorative; the right slot can hold a control, like show/hide.",
			},
		},
	},
	render: () => (
		<>
			<TextField
				label="Search runs"
				hideLabel
				placeholder="Search runs"
				leftIcon={<Icon name="search" />}
			/>
			<PasswordField />
		</>
	),
};

export const States: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`error` replaces the helper text and sets `aria-invalid`; disabled dims and is skipped.",
			},
		},
	},
	render: () => (
		<>
			<TextField
				label="Billing email"
				required
				defaultValue="finance@"
				error="Enter a full email address."
			/>
			<TextField
				label="Workspace ID"
				disabled
				defaultValue="ws_7h2k9"
				helperText="Set when the workspace was created."
			/>
			<TextField label="Runner label" readOnly defaultValue="gpu-runner-03" />
		</>
	),
};

export const InANativeForm: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`name` submits with the form; `required` blocks submit and the browser points at the field.",
			},
		},
	},
	render: () => (
		<FormDemo label="New workspace">
			<TextField name="workspace" label="Workspace name" required placeholder="Acme research" />
			<TextField name="email" type="email" label="Billing email" placeholder="finance@acme.com" />
		</FormDemo>
	),
};

function RefDemo() {
	const input = useRef<HTMLInputElement>(null);
	return (
		<>
			<TextField ref={input} label="Run name" data-testid="run-name" defaultValue="nightly-eval" />
			<Row>
				<Button variant="secondary" size="sm" onClick={() => input.current?.select()}>
					Select the text
				</Button>
			</Row>
			<Note>`ref` and rest props (`data-*`, `aria-*`, handlers) land on the native input.</Note>
		</>
	);
}

export const RefAndRestProps: Story = { render: () => <RefDemo /> };
