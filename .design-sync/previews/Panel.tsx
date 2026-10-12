import { Badge, Button, DescriptionList, EntityLink, Link, Panel, Table, Text } from "@optimusfoundry/quiet";

const RUNS = [
	{ id: "233f76c2", trigger: "web-message", runner: "Orca", status: "success", label: "Succeeded", cost: "$0.902049" },
	{ id: "9b1e04aa", trigger: "schedule.daily", runner: "Headless", status: "success", label: "Succeeded", cost: "$0.118320" },
	{ id: "51c0d7f3", trigger: "web-message", runner: "Orca", status: "warning", label: "Awaiting approval", cost: "$0.064511" },
	{ id: "e7a2c915", trigger: "webhook", runner: "Headless", status: "error", label: "Failed", cost: "$0.010204" },
] as const;
type Run = (typeof RUNS)[number];

export const WithActionsAndFooter = () => (
	<div style={{ width: 420 }}>
		<Panel
			title="Approvals"
			count={2}
			description="Runs waiting on a person before they continue."
			actions={<Button variant="ghost" size="sm">Approve all</Button>}
			footer={<Link href="#approvals" size="sm">Show resolved approvals</Link>}
		>
			<ul style={{ margin: 0, paddingLeft: "var(--q-space-2)", display: "grid", gap: "var(--q-space-1)" }}>
				<li>
					<EntityLink href="#run-51c0d7f3" kind="Run" id="51c0d7f3" mono /> wants to send 14 emails
				</li>
				<li>
					<EntityLink href="#run-0c4f19be" kind="Run" id="0c4f19be" mono /> wants to merge a pull request
				</li>
			</ul>
		</Panel>
	</div>
);

export const TablePlain = () => (
	<div style={{ width: 720 }}>
		<Panel title="Recent runs" count={RUNS.length} variant="plain" padding="none" actions={<Link href="#runs" size="sm">View all</Link>}>
			<Table
				label="Recent runs"
				size="sm"
				rowKey="id"
				data={RUNS as unknown as Run[]}
				columns={[
					{ key: "id", header: "Run", render: (r: Run) => <EntityLink href={`#run-${r.id}`} id={r.id} mono /> },
					{ key: "trigger", header: "Trigger" },
					{ key: "runner", header: "Runner" },
					{ key: "status", header: "Status", render: (r: Run) => <Badge variant={r.status}>{r.label}</Badge> },
					{ key: "cost", header: "Cost", align: "right" },
				]}
			/>
		</Panel>
	</div>
);

export const RightRail = () => (
	<div style={{ width: 300, display: "grid", gap: "var(--q-space-stack)" }}>
		<Panel title="Details">
			<DescriptionList
				layout="stacked"
				size="sm"
				items={[
					{ label: "Project", value: <EntityLink href="/projects/assistant">Assistant</EntityLink> },
					{ label: "Runner", value: "Orca" },
					{ label: "Cost", value: "$0.902049", mono: true },
				]}
			/>
		</Panel>
		<Panel title="Inputs" empty="No inputs" />
		<Panel title="Approvals" empty="Nothing waiting for a decision." />
	</div>
);

export const Variants = () => (
	<div style={{ width: 720, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--q-space-stack)", alignItems: "start" }}>
		<Panel title="Surface" as="h3">
			<Text size="sm">web-message · Orca</Text>
		</Panel>
		<Panel variant="outlined" title="Outlined" as="h3">
			<Text size="sm">Headless · 2 vCPU · us-east-1</Text>
		</Panel>
		<Panel variant="plain" title="Plain" as="h3" description="Project · 12 runs · $4.21">
			<Text size="sm">Reads the support inbox every Monday.</Text>
		</Panel>
	</div>
);
