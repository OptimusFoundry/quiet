import { Badge, DescriptionList, EntityLink, Link, Panel } from "@optimusfoundry/quiet";

const RUN = [
	{ label: "Trigger", value: "web-message", mono: true },
	{ label: "Project", value: <EntityLink href="/projects/assistant">Assistant</EntityLink> },
	{ label: "Runner", value: "Orca" },
	{ label: "Status", value: <Badge variant="success">Succeeded</Badge> },
	{ label: "Cost", value: "$0.902049", mono: true },
	{ label: "Created", value: "11 Oct 2026, 14:02", hint: "6 hours ago" },
	{ label: "Run ID", value: "233f76c2", mono: true, copy: "233f76c2" },
];

const ARTIFACT = [
	{ label: "Project", value: <Link href="/projects/assistant">Assistant</Link> },
	{ label: "Kind", value: "Spreadsheet" },
	{ label: "Location", value: "Internal", hint: "Visible to members of this organisation" },
	{ label: "Current version", value: "v2" },
	{ label: "ID", value: "art_7f3c91d2e4a8", mono: true, copy: "art_7f3c91d2e4a8" },
	{ label: "Approved by", value: "Ada Park" },
];

export const RunDetails = () => (
	<div style={{ width: 520 }}>
		<DescriptionList items={RUN} />
	</div>
);

export const StackedInRail = () => (
	<div style={{ width: 300 }}>
		<Panel title="Details">
			<DescriptionList
				layout="stacked"
				size="sm"
				items={[
					{ label: "Trigger", value: "web-message", mono: true },
					{ label: "Project", value: <EntityLink href="/projects/assistant">Assistant</EntityLink> },
					{ label: "Runner", value: "Orca" },
					{ label: "Cost", value: "$0.902049", mono: true },
					{
						label: "Run ID",
						value: "233f76c2-f6f9-41b0-bc7a-310d203ad736",
						mono: true,
						copy: "233f76c2-f6f9-41b0-bc7a-310d203ad736",
					},
				]}
			/>
		</Panel>
	</div>
);

export const TwoColumns = () => (
	<div style={{ width: 860 }}>
		<DescriptionList items={ARTIFACT} columns={2} />
	</div>
);

export const StackedThreeColumns = () => (
	<div style={{ width: 860 }}>
		<DescriptionList items={RUN.slice(0, 6)} layout="stacked" columns={3} />
	</div>
);

export const EmptyValues = () => (
	<div style={{ width: 520 }}>
		<DescriptionList
			size="sm"
			items={[
				{ label: "Trigger", value: "schedule.daily", mono: true },
				{ label: "Runner", value: "Headless" },
				{ label: "Parent run" },
				{ label: "Approved by", value: "" },
				{ label: "Finished", value: null },
				{ label: "Cost", value: "$0.000000", mono: true },
			]}
		/>
	</div>
);
