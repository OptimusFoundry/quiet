import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeBlock } from "../../../components/chat/CodeBlock";
import { Column } from "../Story";
import { SQL } from "./fixtures";

const SCSS = `.q-button {
  display: inline-flex;
  align-items: center;
  gap: var(--q-button-gap);
  height: var(--_height);
  padding: 0 var(--_px);
  border-radius: var(--q-button-radius);
  font-weight: var(--q-button-weight);
  transition: background var(--q-dur-hover) var(--q-ease-soft);
}

.q-button--primary {
  background: var(--q-button-primary-bg);
  color: var(--q-button-primary-fg);
}`;

const LONG_LINE = `curl -X POST https://api.example.com/v1/workspaces/acme/runs -H "Authorization: Bearer $TOKEN" -d '{"runner":"self-hosted-eu-west","trigger":"manual","artifacts":true}'`;

const meta = {
	title: "Components/Chat/CodeBlock",
	component: CodeBlock,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { code: SQL, language: "sql" },
	argTypes: { children: { control: false } },
	decorators: [
		(Story) => (
			<Column wide>
				<Story />
			</Column>
		),
	],
} satisfies Meta<typeof CodeBlock>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FileWithMaxHeight: Story = {
	parameters: {
		docs: { description: { story: "`filename` labels it; `maxHeight` scrolls a long file." } },
	},
	args: { code: SCSS, language: "scss", filename: "Button.scss", maxHeight: 160 },
};

export const LongLine: Story = {
	parameters: {
		docs: { description: { story: "Scrolls sideways by default; `wrap` wraps instead." } },
	},
	render: () => (
		<Column wide>
			<CodeBlock language="bash" code={LONG_LINE} />
			<CodeBlock language="bash" code={LONG_LINE} wrap />
		</Column>
	),
};

export const NoLanguage: Story = {
	args: { code: "run 8f21 finished in 4m 12s · 3 artifacts", language: undefined },
};
