import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../../components/core/Button";
import { DoubtMarker, type DoubtMarkerProps } from "../../../components/future/DoubtMarker";
import { Column, Note, Row } from "../Story";
import "./DoubtMarker.scss";

const meta = {
	title: "Components/Agent & trust/DoubtMarker",
	component: DoubtMarker,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		children: "Most of the overage came from the EU backfill.",
		reason: "Run costs are tagged by schedule; 4 in 10 runs this month had no tag.",
		confidence: 0.58,
		status: "doubt",
	},
	argTypes: {
		children: { control: "text" },
		reason: { control: "text" },
		revision: { control: "text" },
		confidence: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
		status: { control: "inline-radio", options: ["doubt", "checking", "confirmed", "revised"] },
		onRecheck: { control: false },
	},
	render: (args) => (
		<p className="q-sb-doubt-marker__claim">
			October spend rose 12%. <DoubtMarker {...args} />
		</p>
	),
} satisfies Meta<typeof DoubtMarker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
	parameters: {
		docs: {
			description: {
				story: "Hover or focus each claim for its reason. Escape closes the bubble.",
			},
		},
	},
	render: () => (
		<Row>
			<DoubtMarker reason="Two sources disagree." confidence={0.4}>
				Unsure
			</DoubtMarker>
			<DoubtMarker status="checking" reason="Going back to the runs table.">
				Re-checking
			</DoubtMarker>
			<DoubtMarker status="confirmed" reason="Matched against 4,812 runs.">
				Confirmed
			</DoubtMarker>
			<DoubtMarker
				status="revised"
				revision="Rewritten"
				reason="The first figure double-counted retries."
			>
				Original
			</DoubtMarker>
		</Row>
	),
};

export const Revised: Story = {
	args: {
		status: "revised",
		revision: "About 61% came from the EU backfill; 39% of runs had no tag.",
		reason: "Re-checked against the run log. The untagged share was larger than assumed.",
	},
};

type Status = NonNullable<DoubtMarkerProps["status"]>;

function RecheckDemo() {
	const [st, setSt] = useState<Record<number, Status>>({});
	const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
	useEffect(() => () => timers.current.forEach(clearTimeout), []);
	const check = (i: number, outcome: Status) => {
		setSt((s) => ({ ...s, [i]: "checking" }));
		timers.current.push(setTimeout(() => setSt((s) => ({ ...s, [i]: outcome })), 1200));
	};
	return (
		<Column wide>
			<p className="q-sb-doubt-marker__claim">
				October spend rose 12%.{" "}
				<DoubtMarker
					status={st[1] ?? "doubt"}
					confidence={0.58}
					reason="Run costs are tagged by schedule; 4 in 10 runs this month had no tag."
					revision="About 61% came from the EU backfill; 39% of runs had no tag."
					onRecheck={() => check(1, "revised")}
				>
					Most of the overage came from the EU backfill.
				</DoubtMarker>{" "}
				<DoubtMarker
					status={st[2] ?? "doubt"}
					confidence={0.72}
					reason="The success rate came from a sample of 400 runs, not all of them."
					onRecheck={() => check(2, "confirmed")}
				>
					Runs succeeded 91% of the time.
				</DoubtMarker>
			</p>
			<Row>
				<Note>Press a claim you doubt: the first is revised, the second confirmed.</Note>
				{Object.keys(st).length > 0 && (
					<Button size="sm" variant="ghost" onClick={() => setSt({})}>
						Reset
					</Button>
				)}
			</Row>
		</Column>
	);
}

export const Recheck: Story = {
	parameters: {
		docs: {
			description: {
				story: "With `onRecheck` a doubted claim is a button; the caller sets `status` as it goes.",
			},
		},
	},
	render: () => <RecheckDemo />,
};
