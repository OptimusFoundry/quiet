import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, useState } from "react";
import { DescriptionList } from "../../../components/app/DescriptionList";
import { Button } from "../../../components/core/Button";
import { Text } from "../../../components/core/Text";
import { PageTransition } from "../../../components/layout/PageTransition";
import { Tabs } from "../../../components/navigation/Tabs";
import { Column, Row } from "../Story";

const VIEWS: Record<string, string> = {
	Runs: "12 runs today, 2 waiting for approval.",
	Runners: "4 runners online in eu-west.",
	Artifacts: "318 artifacts, 2.4 GB in total.",
};

type Variant = NonNullable<ComponentProps<typeof PageTransition>["variant"]>;

function TabbedDemo({ variant, duration }: { variant?: Variant; duration?: number }) {
	const [view, setView] = useState("Runs");
	return (
		<Column>
			<Tabs label="Workspace views" tabs={Object.keys(VIEWS)} value={view} onChange={setView} />
			<PageTransition transitionKey={view} variant={variant} duration={duration}>
				<Text>{VIEWS[view]}</Text>
			</PageTransition>
		</Column>
	);
}

const meta = {
	title: "Components/Layout/PageTransition",
	component: PageTransition,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { transitionKey: "Runs", variant: "fade", duration: 400 },
	argTypes: {
		transitionKey: { control: false },
		children: { control: false },
	},
	render: (args) => <TabbedDemo variant={args.variant} duration={args.duration} />,
} satisfies Meta<typeof PageTransition>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Switch tabs: the old view fades out, then the new one enters. `transitionKey` is the tab value here; in an app, the route.",
			},
		},
	},
};

function ReplayDemo({ variant }: { variant: Variant }) {
	const [n, setN] = useState(1);
	return (
		<Column>
			<Row>
				<Button size="sm" variant="secondary" onClick={() => setN((x) => x + 1)}>
					Replay {variant}
				</Button>
			</Row>
			<PageTransition transitionKey={n} variant={variant}>
				<DescriptionList
					items={[
						{ label: "Run", value: `#${4180 + n}` },
						{ label: "Runner", value: "Nightly export" },
					]}
				/>
			</PageTransition>
		</Column>
	);
}

export const Variants: Story = {
	parameters: {
		docs: {
			description: {
				story: "fade, slide (from the side), slideUp and scale. Reduced motion swaps instantly.",
			},
		},
	},
	render: () => (
		<Row>
			{(["fade", "slide", "slideUp", "scale"] as const).map((v) => (
				<ReplayDemo key={v} variant={v} />
			))}
		</Row>
	),
};

export const SlowerDuration: Story = {
	parameters: {
		docs: { description: { story: "`duration` in ms for the enter (default 400)." } },
	},
	args: { variant: "slideUp", duration: 800 },
};
