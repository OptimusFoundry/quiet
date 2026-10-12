import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { DescriptionList, type DescriptionListItem } from "../../components/app/DescriptionList";
import { Badge } from "../../components/core/Badge";
import { Link } from "../../components/core/Link";
import "./DescriptionList.scss";

// App/DescriptionList — an entity's properties, each value right beside its label (agentworks used
// to put them 900px apart).

const meta = {
	title: "App/DescriptionList",
	parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;

function Section({
	id,
	title,
	note,
	children,
}: {
	id: string;
	title: string;
	note?: string;
	children: ReactNode;
}) {
	return (
		<section id={id} className="q-sb-description-list__section" aria-labelledby={`${id}-title`}>
			<h2 id={`${id}-title`} className="q-sb-description-list__title">
				{title}
			</h2>
			{note && <p className="q-sb-description-list__note">{note}</p>}
			{children}
		</section>
	);
}

const ARTIFACT: DescriptionListItem[] = [
	{ label: "Project", value: <Link href="/projects/assistant">Assistant</Link> },
	{ label: "Kind", value: "Spreadsheet" },
	{ label: "Location", value: "Internal", hint: "Visible to members of this organisation" },
	{ label: "Current version", value: "v1" },
	{
		label: "ID",
		value: "art_7f3c91d2e4a8",
		mono: true,
		copy: "art_7f3c91d2e4a8",
	},
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

export const All: StoryObj = {
	render: () => (
		<div className="q-sb-description-list">
			<Section id="artifact" title="Artifact details">
				<DescriptionList items={ARTIFACT} />
			</Section>

			<Section id="run" title="Run details">
				<DescriptionList items={RUN} />
			</Section>

			<Section
				id="stacked"
				title="Stacked, in a side panel"
				note="Label above value for narrow columns."
			>
				<div className="q-sb-description-list__panel">
					<DescriptionList items={RUN} layout="stacked" size="sm" />
				</div>
			</Section>

			<Section
				id="columns"
				title="Two columns"
				note="Pairs per row on wide screens; one column under 720px."
			>
				<div className="q-sb-description-list__wide">
					<DescriptionList items={ARTIFACT} columns={2} />
				</div>
			</Section>

			<Section id="stacked-columns" title="Stacked, three columns">
				<div className="q-sb-description-list__wide">
					<DescriptionList items={RUN.slice(0, 6)} layout="stacked" columns={3} />
				</div>
			</Section>

			<Section id="empty" title="Empty values" note="A muted dash, read as “Not set”.">
				<DescriptionList items={EMPTY} />
			</Section>

			<Section id="small" title="Small">
				<DescriptionList items={RUN} size="sm" />
			</Section>
		</div>
	),
};
