import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../../components/core/Button";
import { GhostFuture } from "../../../components/future/GhostFuture";
import { Column, Note, Row } from "../Story";
import "./GhostFuture.scss";

const GHOSTS = [
	{ label: "Your first scheduled run", hint: "tonight, 02:00" },
	{ label: "A run that waits for approval", hint: "day 2" },
	{ label: "A failed run, retried", hint: "day 4, automatic" },
	{ label: "Run #100", hint: "around day 9" },
];
const CAPTION =
	"Dashed rows are what the first fortnight looked like for 40 workspaces like this one. They fold away as real runs arrive.";
const RUNS = [
	"Nightly export",
	"Invoice sync",
	"EU backfill",
	"Reconcile October",
	"Release artifacts",
];

function RunRow({ name }: { name: string }) {
	return (
		<div className="q-sb-ghost-future__row">
			<span>{name}</span>
			<span className="q-sb-ghost-future__when">just now</span>
		</div>
	);
}

const meta = {
	title: "Components/Agent & trust/GhostFuture",
	component: GhostFuture,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { ghosts: GHOSTS, caption: CAPTION },
	argTypes: {
		ghosts: { control: false },
		caption: { control: "text" },
		children: { control: false },
		renderGhost: { control: false },
	},
	render: (args) => (
		<Column wide>
			<GhostFuture {...args} />
		</Column>
	),
} satisfies Meta<typeof GhostFuture>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	parameters: { docs: { description: { story: "Empty: every ghost shows, with the caption." } } },
};

export const PartlyFilled: Story = {
	parameters: {
		docs: {
			description: { story: "Each real row replaces the first remaining ghost." },
		},
	},
	render: (args) => (
		<Column wide>
			<GhostFuture {...args}>
				<RunRow name="Nightly export" />
				<RunRow name="Invoice sync" />
			</GhostFuture>
		</Column>
	),
};

function FillingUp() {
	const [n, setN] = useState(0);
	return (
		<Column wide>
			<GhostFuture ghosts={GHOSTS} caption={CAPTION}>
				{RUNS.slice(0, n).map((r) => (
					<RunRow key={r} name={r} />
				))}
			</GhostFuture>
			<Row>
				<Button
					size="sm"
					variant="secondary"
					onClick={() => setN((x) => Math.min(RUNS.length, x + 1))}
					disabled={n >= RUNS.length}
				>
					A run arrives
				</Button>
				<Button size="sm" variant="ghost" onClick={() => setN(0)}>
					Reset
				</Button>
			</Row>
			<Note>Once real rows outnumber the ghosts, the caption goes too.</Note>
		</Column>
	);
}

export const FillingUpLive: Story = { render: () => <FillingUp /> };

export const CustomGhost: Story = {
	parameters: {
		docs: {
			description: { story: "`renderGhost` replaces the ghost's content; the dashed frame stays." },
		},
	},
	args: {
		renderGhost: (g) => (
			<>
				<span>{g.label}</span>
				<span className="q-sb-ghost-future__when">{g.hint}</span>
			</>
		),
	},
};
