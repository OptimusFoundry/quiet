import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { PromptSuggestions } from "../../../components/chat/PromptSuggestions";
import { Column, Note } from "../Story";
import { STARTERS } from "./fixtures";

const meta = {
	title: "Components/Chat/PromptSuggestions",
	component: PromptSuggestions,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		label: "Starters",
		layout: "wrap",
		suggestions: [
			"Summarise this run",
			"Draft a reply to the approver",
			"Find the failed steps",
			"Explain this invoice",
		],
	},
	argTypes: { onSelect: { control: false } },
} satisfies Meta<typeof PromptSuggestions>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Cards: Story = {
	parameters: {
		docs: {
			description: {
				story: '`layout="grid"` with a description each; `prompt` can be longer than the label.',
			},
		},
	},
	render: () => (
		<Column wide>
			<PromptSuggestions layout="grid" label="Starters with detail" suggestions={STARTERS} />
		</Column>
	),
};

function Picking() {
	const [picked, setPicked] = useState("");
	return (
		<Column>
			<PromptSuggestions
				label="Starters"
				suggestions={STARTERS.map((s) => ({ label: s.label, prompt: s.prompt }))}
				onSelect={setPicked}
			/>
			<Note>
				{picked ? `Sends: ${picked}` : "One tab stop; arrows, Home and End move. Pick one."}
			</Note>
		</Column>
	);
}

export const OnSelect: Story = {
	parameters: {
		docs: {
			description: { story: "`onSelect(prompt, suggestion)` hands back the full prompt." },
		},
	},
	render: () => <Picking />,
};
