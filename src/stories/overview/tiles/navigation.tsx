import { Button } from "../../../components/core/Button";
import { Icon } from "../../../components/core/Icon";
import { Breadcrumb } from "../../../components/navigation/Breadcrumb";
import { Pagination } from "../../../components/navigation/Pagination";
import { Sidebar } from "../../../components/navigation/Sidebar";
import { StepIndicator } from "../../../components/navigation/StepIndicator";
import { Tabs } from "../../../components/navigation/Tabs";
import type { Tile } from "./types";

const ITEMS = [
	{ label: "Runs", icon: <Icon name="runs" />, badge: 12 },
	{ label: "Approvals", icon: <Icon name="approvals" /> },
];

export const tiles: Tile[] = [
	{
		name: "Sidebar",
		blurb: "App navigation in groups; folds to a 64px rail, or a drawer on a phone.",
		wide: true,
		render: () => (
			<div className="q-sb-tile-row">
				<Sidebar aria-label="Sidebar preview" items={ITEMS} defaultValue="Runs" width={200} />
				<Sidebar
					aria-label="Sidebar preview, rail"
					items={ITEMS}
					defaultValue="Runs"
					defaultCollapsed
				/>
			</div>
		),
	},
	{
		name: "Tabs",
		blurb: "Switch views in place: segmented by default, or line and pill.",
		render: () => (
			<div className="q-sb-tile-stack">
				<Tabs label="Tabs preview" size="sm" tabs={["Runs", "Runners", "Artifacts"]} />
				<Tabs
					label="Tabs preview, line"
					size="sm"
					variant="line"
					tabs={["Runs", "Runners", "Artifacts"]}
				/>
			</div>
		),
	},
	{
		name: "Breadcrumb",
		blurb: "Where this page sits; long trails fold in the middle.",
		render: () => (
			<Breadcrumb
				size="sm"
				label="Breadcrumb preview"
				items={[
					{ label: "Workspace", href: "#workspace" },
					{ label: "Runners", href: "#runners" },
					{ label: "Nightly export" },
				]}
			/>
		),
	},
	{
		name: "Pagination",
		blurb: "Page through long lists with round page pills.",
		render: () => (
			<Pagination
				label="Pagination preview"
				size="sm"
				variant="ghost"
				total={8}
				defaultPage={2}
				showFirstLast={false}
			/>
		),
	},
	{
		name: "StepIndicator",
		blurb: "Progress through a multi-step flow, with errors marked.",
		render: () => (
			<StepIndicator
				label="Steps preview"
				size="sm"
				current={1}
				steps={[{ label: "Connect" }, { label: "Review" }, { label: "Launch" }]}
			/>
		),
	},
	{
		name: "CommandPalette",
		blurb: "⌘K: search and run any command from the keyboard.",
		render: () => (
			<Button size="sm" variant="secondary" leftIcon={<Icon name="search" />}>
				Search or run a command
			</Button>
		),
	},
];
