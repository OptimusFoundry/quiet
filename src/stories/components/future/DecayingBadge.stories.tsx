import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Slider } from "../../../components/forms/Slider";
import { DecayingBadge } from "../../../components/future/DecayingBadge";
import { Column, Note, Row } from "../Story";
import "./DecayingBadge.scss";

// A fixed clock, so the stories render the same every time.
const HOUR = 3600e3;
const NOW = Date.UTC(2026, 9, 8, 12);

const meta = {
	title: "Components/Agent & trust/DecayingBadge",
	component: DecayingBadge,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { children: "Verified", checkedAt: NOW - 5 * HOUR, now: NOW, size: "md" },
	argTypes: {
		children: { control: "text" },
		checkedAt: { control: "date" },
		now: { control: "date" },
		staleLabel: { control: "text" },
		onRecheck: { control: false },
		size: { control: "inline-radio", options: ["sm", "md", "lg"] },
	},
} satisfies Meta<typeof DecayingBadge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Ages: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Checked 1h, 40h, 70h and 96h ago with the default 72h `staleAfter`, then never checked.",
			},
		},
	},
	render: () => (
		<Row>
			<DecayingBadge checkedAt={NOW - HOUR} now={NOW}>
				Verified
			</DecayingBadge>
			<DecayingBadge checkedAt={NOW - 40 * HOUR} now={NOW}>
				Verified
			</DecayingBadge>
			<DecayingBadge checkedAt={NOW - 70 * HOUR} now={NOW}>
				Verified
			</DecayingBadge>
			<DecayingBadge checkedAt={NOW - 96 * HOUR} now={NOW}>
				Verified
			</DecayingBadge>
			<DecayingBadge now={NOW}>Verified</DecayingBadge>
		</Row>
	),
};

export const Sizes: Story = {
	render: () => (
		<Row>
			<DecayingBadge size="sm" checkedAt={NOW - 5 * HOUR} now={NOW}>
				Synced
			</DecayingBadge>
			<DecayingBadge size="md" checkedAt={NOW - 5 * HOUR} now={NOW}>
				Synced
			</DecayingBadge>
			<DecayingBadge size="lg" checkedAt={NOW - 5 * HOUR} now={NOW}>
				Synced
			</DecayingBadge>
		</Row>
	),
};

export const Checking: Story = {
	args: { checkedAt: NOW - 60 * HOUR, checking: true, onRecheck: () => {} },
};

const DOMAINS = ["billing.northwind.dev", "runners.halcyon.io", "exports.fieldnote.app"];

function RecheckDemo() {
	const [later, setLater] = useState(0);
	const [checked, setChecked] = useState([NOW - 2 * HOUR, NOW - 30 * HOUR, NOW - 64 * HOUR]);
	const now = NOW + later * HOUR;
	return (
		<Column>
			<Slider
				label="Time passes"
				min={0}
				max={72}
				value={later}
				onChange={setLater}
				formatValue={(v) => `+${v}h`}
			/>
			{DOMAINS.map((d, i) => (
				<div key={d} className="q-sb-decaying-badge__row">
					<span>{d}</span>
					<DecayingBadge
						checkedAt={checked[i]}
						now={now}
						onRecheck={() => setChecked((c) => c.map((x, j) => (j === i ? now : x)))}
					>
						Verified
					</DecayingBadge>
				</div>
			))}
			<Note>Drag time forward, then press a badge to re-check its domain.</Note>
		</Column>
	);
}

export const Recheck: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"With `onRecheck` the badge is a button. Without `now` it reads the clock every 30s.",
			},
		},
	},
	render: () => <RecheckDemo />,
};
