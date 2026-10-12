import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../../components/core/Button";
import { Card } from "../../../components/display/Card";
import { BorderProgress } from "../../../components/future/BorderProgress";
import { Column, Row } from "../Story";

const meta = {
	title: "Components/Agent & trust/BorderProgress",
	component: BorderProgress,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { value: 40, max: 100, label: "Building release artifacts" },
	argTypes: {
		value: { control: { type: "range", min: 0, max: 100, step: 1 } },
		label: { control: "text" },
		children: { control: false },
	},
	render: (args) => (
		<Column>
			<BorderProgress {...args}>
				<Card eyebrow="runner-02" title="Building release artifacts" meta={`${args.value ?? 0}%`}>
					3 bundles · about 4 min left
				</Card>
			</BorderProgress>
		</Column>
	),
} satisfies Meta<typeof BorderProgress>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Idle at 0, a travelling segment when the length is unknown, a full ink edge when done.",
			},
		},
	},
	render: () => (
		<Row>
			<BorderProgress value={0} aria-label="Queued export">
				<Card eyebrow="Queued" title="Export" />
			</BorderProgress>
			<BorderProgress value={65} aria-label="Invoice sync">
				<Card eyebrow="65%" title="Invoice sync" />
			</BorderProgress>
			<BorderProgress indeterminate aria-label="Indexing workspace">
				<Card eyebrow="Unknown length" title="Indexing" />
			</BorderProgress>
			<BorderProgress value={100} aria-label="Import">
				<Card eyebrow="Done" title="Import" />
			</BorderProgress>
		</Row>
	),
};

function RunningCard() {
	const [p, setP] = useState(40);
	const left = Math.ceil((100 - p) / 16);
	return (
		<Column>
			<BorderProgress
				value={p}
				label="Building release artifacts"
				valueText={`${p}%, about ${left} min left`}
			>
				<Card eyebrow="runner-02" title="Building release artifacts" meta={`${p}%`}>
					3 bundles · about {left} min left
				</Card>
			</BorderProgress>
			<Row>
				<Button
					size="sm"
					variant="secondary"
					onClick={() => setP((x) => Math.min(100, x + 20))}
					disabled={p >= 100}
				>
					Advance
				</Button>
				<Button size="sm" variant="ghost" onClick={() => setP(0)}>
					Restart
				</Button>
			</Row>
		</Column>
	);
}

export const Running: Story = {
	parameters: {
		docs: {
			description: {
				story: "`valueText` is what a screen reader hears; it defaults to the percentage.",
			},
		},
	},
	render: () => <RunningCard />,
};
