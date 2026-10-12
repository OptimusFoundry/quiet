import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	Accordion,
	AspectRatio,
	Button,
	Card,
	DataGrid,
	EmptyState,
	Icon,
	List,
	StatCard,
} from "../../index";
import "./Display.scss";

// The display, data and layout parts in the one look: grounds instead of rules, stroke icons,
// sentence-case labels.
const meta: Meta = { title: "Extensions/Display", parameters: { layout: "padded" } };
export default meta;

export const AccordionRows: StoryObj = {
	name: "Accordion",
	render: () => (
		<div className="q-sb-display q-sb-display--narrow">
			<Accordion
				defaultExpanded={["billing"]}
				items={[
					{
						id: "billing",
						title: "When am I billed?",
						description: "Monthly, on the day you subscribed",
						content:
							"Invoices go out on the same day each month. Seats added mid-cycle are prorated to the day.",
					},
					{
						id: "seats",
						title: "Can I change seats later?",
						content:
							"Yes. Add or remove seats from Settings; the next invoice reflects the change.",
					},
					{
						id: "export",
						icon: <Icon name="download" />,
						title: "Exporting your data",
						content: "Export every record as CSV from the workspace menu, at any time.",
					},
					{ id: "sso", title: "Single sign-on", content: "Available on Business.", disabled: true },
				]}
			/>
		</div>
	),
};

export const Cards: StoryObj = {
	render: () => (
		<div className="q-sb-display q-sb-display--grid">
			<Card eyebrow="Project" title="Anvil iOS" meta="Updated 2h ago">
				The native client for field teams, offline first.
			</Card>
			<Card
				href="#cards"
				eyebrow="Project"
				title="Forge web"
				meta="12 open issues"
				footer={<Icon name="arrow-right" />}
			>
				A link card: its ground deepens on hover and keyboard focus.
			</Card>
			<Card onClick={() => {}} title="Billing export" meta="Button card">
				Acts as a button with Enter and Space.
			</Card>
		</div>
	),
};

export const StatCards: StoryObj = {
	render: () => (
		<div className="q-sb-display q-sb-display--grid">
			<StatCard label="Monthly revenue" value="$13.2k" delta={8.4} period="vs last month" />
			<StatCard label="Churn" value="2.1%" delta={-0.6} period="vs last month" icon="analytics" />
			<StatCard label="Active seats" value={418} delta={0} previousValue={418} />
			<StatCard
				variant="outlined"
				label="Open tickets"
				value={37}
				delta="-4"
				period="this week"
				href="#stat-cards"
			/>
			<StatCard variant="plain" label="Runs today" value={1204} delta={12} />
		</div>
	),
};

export const EmptyStates: StoryObj = {
	render: () => (
		<div className="q-sb-display q-sb-display--grid">
			<EmptyState
				icon="search"
				title="Nothing matches"
				description="No ticket contains “refund”. Try a shorter search."
				size="sm"
			/>
			<EmptyState
				icon="file"
				eyebrow="Artifacts"
				title="No artifacts yet"
				description="Runs that produce files list them here."
				actions={
					<Button size="sm" variant="secondary">
						Start a run
					</Button>
				}
			/>
			<EmptyState
				bordered
				align="start"
				icon="upload"
				title="Drop a CSV to import"
				description="Up to 10 MB. Columns are matched by header."
				size="sm"
			/>
		</div>
	),
};

const people = [
	{ id: 1, primary: "Ada Lovelace", secondary: "ada@example.com", trailing: "Owner" },
	{ id: 2, primary: "Grace Hopper", secondary: "grace@example.com", trailing: "Admin" },
	{ id: 3, primary: "Alan Turing", secondary: "alan@example.com", trailing: "2h ago" },
];

export const Lists: StoryObj = {
	render: () => (
		<div className="q-sb-display q-sb-display--grid">
			<List items={people} />
			<List
				bordered
				items={[
					{ id: "a", primary: "Billing", secondary: "Plan, invoices, seats", href: "#lists" },
					{ id: "b", primary: "Members", secondary: "Invite and manage", onClick: () => {} },
					{
						id: "c",
						primary: "Audit log",
						secondary: "Business plan",
						disabled: true,
						onClick: () => {},
					},
				]}
			/>
			<List
				size="sm"
				groups={[
					{ label: "Today", items: people.slice(0, 2) },
					{ label: "Earlier", items: people.slice(2) },
				]}
			/>
		</div>
	),
};

export const AspectRatios: StoryObj = {
	render: () => (
		<div className="q-sb-display q-sb-display--grid">
			<AspectRatio ratio="video" />
			<AspectRatio ratio="square" label="Product shot" />
			<AspectRatio ratio={1.5} />
		</div>
	),
};

type Key = { id: string; name: string; owner: string; created: string; uses: number };
const NAMES = ["Deploy bot", "CI runner", "Data export", "Billing sync", "Staging"];
const OWNERS = ["Ada", "Grace", "Alan"];
const KEYS: Key[] = Array.from({ length: 14 }, (_, i) => ({
	id: `key-${i + 1}`,
	name: NAMES[i % NAMES.length] ?? "",
	owner: OWNERS[i % OWNERS.length] ?? "",
	created: `2026-0${(i % 9) + 1}-1${i % 9}`,
	uses: (i * 37) % 400,
}));

export const DataGridToolbar: StoryObj = {
	name: "DataGrid",
	render: () => (
		<div className="q-sb-display">
			<DataGrid<Key, string>
				title="API keys"
				searchable
				selectable
				bordered
				pageSize={5}
				columns={[
					{ key: "name", header: "Name", sortable: true },
					{ key: "owner", header: "Owner", sortable: true },
					{ key: "created", header: "Created", nowrap: true },
					{ key: "uses", header: "Uses", align: "right", sortable: true },
				]}
				data={KEYS}
				actions={
					<Button size="sm" variant="secondary">
						New key
					</Button>
				}
			/>
		</div>
	),
};
