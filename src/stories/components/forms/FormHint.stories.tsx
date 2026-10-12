import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "../../../components/core/Icon";
import { FormHint } from "../../../components/forms/FormHint";
import { TextField } from "../../../components/forms/TextField";
import { Column } from "../Story";

const meta = {
	title: "Components/Forms/FormHint",
	component: FormHint,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { children: "Runs over $50 wait for an approver.", variant: "default" },
	argTypes: {
		children: { control: "text" },
		icon: { control: false },
	},
	decorators: [
		(Story) => (
			<Column>
				<Story />
			</Column>
		),
	],
} satisfies Meta<typeof FormHint>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Errors and successes carry an icon by default; an error is announced (`role="alert"`).',
			},
		},
	},
	render: () => (
		<>
			<FormHint>Shown on invoices and in the workspace switcher.</FormHint>
			<FormHint variant="error">Enter a full email address.</FormHint>
			<FormHint variant="success">Domain verified.</FormHint>
		</>
	),
};

export const Icons: Story = {
	parameters: {
		docs: {
			description: {
				story: "`icon`: `true` for the variant's icon, a node for your own, `false` for none.",
			},
		},
	},
	render: () => (
		<>
			<FormHint icon>With the info icon.</FormHint>
			<FormHint icon={<Icon name="key" />}>Keys are shown once; store it now.</FormHint>
			<FormHint variant="error" icon={false}>
				An error without its icon.
			</FormHint>
		</>
	),
};

export const UnderAControl: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Hand-built: point the control's `aria-describedby` at the hint's `id`. A field's own `helperText`/`error` or FormField does this for you.",
			},
		},
	},
	render: () => (
		<>
			<TextField label="Monthly budget" aria-describedby="sb-hint-budget" defaultValue="400" />
			<FormHint id="sb-hint-budget">Spend above this pauses new runs.</FormHint>
		</>
	),
};
