import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Avatar } from "../../../components/core/Avatar";
import { Button } from "../../../components/core/Button";
import { Skeleton } from "../../../components/core/Skeleton";
import { Text } from "../../../components/core/Text";
import { Column, Note, Row } from "../Story";
import "./Skeleton.scss";

const meta = {
	title: "Components/Core/Skeleton",
	component: Skeleton,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { variant: "text", lines: 3, animate: true, loading: true },
	argTypes: {
		children: { control: false },
		ref: { table: { disable: true } },
	},
	decorators: [
		(Story) => (
			<Column>
				<Story />
			</Column>
		),
	],
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Text lines, a circle for an avatar, a full-width block for a card, a pill the size of a button.",
			},
		},
	},
	render: () => (
		<>
			<Skeleton variant="text" lines={2} />
			<Row>
				<Skeleton variant="circular" width={40} height={40} />
				<Skeleton variant="rounded" width={96} />
			</Row>
			<Skeleton variant="rectangular" height={96} />
		</>
	),
};

export const Still: Story = {
	parameters: {
		docs: {
			description: {
				story: "`animate={false}` drops the pulse (it also stops under reduced motion).",
			},
		},
	},
	args: { animate: false },
};

export const Announced: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Hidden from screen readers by default. `label` makes it a `role="status"` with that name, for the one placeholder that stands for a region.',
			},
		},
	},
	args: { label: "Loading runs", lines: 4 },
};

function RunRow({ className, ...rest }: { className?: string; "data-state"?: string }) {
	return (
		<div {...rest} className={["q-sb-skeleton__row", className].filter(Boolean).join(" ")}>
			<Avatar name="Ada Lovelace" size="sm" />
			<div className="q-sb-skeleton__text">
				<Text size="sm" weight="medium">
					Nightly invoice reconciliation
				</Text>
				<Text size="xs" color="muted">
					run_8f2c1a · finished 4 min ago
				</Text>
			</div>
		</div>
	);
}

function LoadedDemo() {
	const [loading, setLoading] = useState(true);
	return (
		<>
			<Row>
				<Button variant="secondary" size="sm" onClick={() => setLoading((l) => !l)}>
					{loading ? "Finish loading" : "Load again"}
				</Button>
			</Row>
			<Skeleton variant="rectangular" height={44} label="Loading run" loading={loading}>
				<RunRow />
			</Skeleton>
			<Note>Size the placeholder like the row it stands for, so nothing shifts.</Note>
		</>
	);
}

export const Loaded: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`loading={false}` renders the children; content that replaces a visible skeleton fades in.",
			},
		},
	},
	render: () => <LoadedDemo />,
};
