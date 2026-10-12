import type { Meta, StoryObj } from "@storybook/react-vite";
import { DescriptionList, type DescriptionListItem } from "../../../components/app/DescriptionList";
import { Badge } from "../../../components/core/Badge";
import { Link } from "../../../components/core/Link";
import "./DescriptionList.scss";

const ARTIFACT: DescriptionListItem[] = [
	{ label: "Project", value: <Link href="/projects/assistant">Assistant</Link> },
	{ label: "Kind", value: "Spreadsheet" },
	{ label: "Location", value: "Internal", hint: "Visible to members of this organisation" },
	{ label: "Current version", value: "v1" },
	{ label: "ID", value: "art_7f3c91d2e4a8", mono: true, copy: "art_7f3c91d2e4a8" },
	{
		label: "Type",
		value: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		mono: true,
	},
];

const RUN: DescriptionListItem[] = [
	{ label: "Trigger", value: "web-message" },
	{ label: "Project", value: <Link href="/projects/newsroom">Newsroom</Link> },
	{ label: "Cost", value: "$0.902049" },
	{ label: "Runner", value: "Orca" },
	{ label: "Status", value: <Badge variant="success">Succeeded</Badge> },
	{ label: "Created", value: "11 Oct 2026, 14:02", hint: "6 hours ago" },
	{ label: "Run ID", value: "233f76c2", mono: true, copy: "233f76c2" },
];

const EMPTY: DescriptionListItem[] = [
	{ label: "Trigger", value: "schedule" },
	{ label: "Runner", value: "Headless" },
	{ label: "Parent run" },
	{ label: "Approved by", value: "" },
	{ label: "Finished", value: null },
	{ label: "Cost", value: "$0.000000" },
];

const meta = {
	title: "Components/App/DescriptionList",
	component: DescriptionList,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { items: RUN, layout: "inline", columns: 1, size: "md" },
	argTypes: { items: { control: false } },
} satisfies Meta<typeof DescriptionList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ArtifactDetails: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Links, a hint under a value, mono IDs and MIME types, and a copy button (`copy`) named by its label.",
			},
		},
	},
	args: { items: ARTIFACT },
};

export const StackedInASidePanel: Story = {
	parameters: { docs: { description: { story: "Label above value, for narrow columns." } } },
	render: () => (
		<div className="q-sb-description-list__panel">
			<DescriptionList items={RUN} layout="stacked" size="sm" />
		</div>
	),
};

export const TwoColumns: Story = {
	parameters: {
		docs: { description: { story: "Pairs per row on wide screens; one column under 720px." } },
	},
	render: () => (
		<div className="q-sb-description-list__wide">
			<DescriptionList items={ARTIFACT} columns={2} />
		</div>
	),
};

export const StackedThreeColumns: Story = {
	render: () => (
		<div className="q-sb-description-list__wide">
			<DescriptionList items={RUN.slice(0, 6)} layout="stacked" columns={3} />
		</div>
	),
};

export const EmptyValues: Story = {
	parameters: {
		docs: {
			description: { story: "A missing or empty value is a muted dash, read as “Not set”." },
		},
	},
	args: { items: EMPTY },
};

export const Small: Story = { args: { size: "sm" } };
