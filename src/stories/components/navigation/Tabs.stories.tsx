import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Icon } from "../../../components/core/Icon";
import { Text } from "../../../components/core/Text";
import { TabPanel, Tabs } from "../../../components/navigation/Tabs";
import { Column, Note } from "../Story";

const TABS = [
	{ value: "runs", label: "Runs", count: 12 },
	{ value: "runners", label: "Runners" },
	{ value: "artifacts", label: "Artifacts" },
	{ value: "audit", label: "Audit log", disabled: true },
];

const meta = {
	title: "Components/Navigation/Tabs",
	component: Tabs,
	subcomponents: { TabPanel },
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { tabs: TABS, label: "Workspace views", variant: "enclosed", size: "md" },
	argTypes: {
		panels: { control: false },
		onChange: { control: false },
	},
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Enclosed (the default) is a segmented control. Line underlines the selected tab; pill fills it with the accent.",
			},
		},
	},
	render: (args) => (
		<Column wide>
			<Tabs {...args} label="Workspace views, enclosed" variant="enclosed" />
			<Tabs {...args} label="Workspace views, line" variant="line" />
			<Tabs {...args} label="Workspace views, pill" variant="pill" />
		</Column>
	),
};

export const Sizes: Story = {
	render: (args) => (
		<Column wide>
			<Tabs {...args} label="Workspace views, small" size="sm" />
			<Tabs {...args} label="Workspace views, medium" size="md" />
			<Tabs {...args} label="Workspace views, large" size="lg" />
		</Column>
	),
};

export const IconsAndFullWidth: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Icons lead the label; `fullWidth` stretches the track across its container, for a pane header.",
			},
		},
	},
	render: () => (
		<Column wide>
			<Tabs
				label="Run detail"
				fullWidth
				tabs={[
					{ value: "log", label: "Log", icon: <Icon name="list" /> },
					{ value: "artifacts", label: "Artifacts", icon: <Icon name="file" />, count: 3 },
					{ value: "approvals", label: "Approvals", icon: <Icon name="approvals" /> },
				]}
			/>
		</Column>
	),
};

export const PanelsRecord: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`panels` renders a wired tabpanel per tab (role, ids, `aria-controls`, `hidden`). Arrow keys move between tabs and select them.",
			},
		},
	},
	render: () => (
		<Column wide>
			<Tabs
				label="Workspace settings"
				tabs={[
					{ value: "general", label: "General" },
					{ value: "members", label: "Members", count: 4 },
					{ value: "billing", label: "Billing" },
					{ value: "danger", label: "Danger zone", disabled: true },
				]}
				panels={{
					general: <Text>Workspace name, region and default runner.</Text>,
					members: <Text>Four people can start runs in this workspace.</Text>,
					billing: <Text>You are on the Team plan. The next invoice is due on 1 November.</Text>,
				}}
			/>
		</Column>
	),
};

function ControlledPanels() {
	const [tab, setTab] = useState("Connected");
	return (
		<Column wide>
			<Tabs
				label="Integrations"
				tabs={["Connected", "Available", "Requests"]}
				value={tab}
				onChange={setTab}
				panels={(value) => <Text>{value} integrations.</Text>}
			/>
			<Note>Controlled: `value` + `onChange`. The selected tab is {tab}.</Note>
		</Column>
	);
}

export const ControlledWithRenderFunction: Story = {
	parameters: {
		docs: {
			description: {
				story: "`panels` as a function renders the panel for the selected value.",
			},
		},
	},
	render: () => <ControlledPanels />,
};

function Standalone() {
	const [tab, setTab] = useState("logs");
	return (
		<Column wide>
			<Tabs
				label="Delivery"
				tabs={[
					{ value: "logs", label: "Logs", id: "delivery-tab-logs", panelId: "delivery-panel-logs" },
					{
						value: "payload",
						label: "Payload",
						id: "delivery-tab-payload",
						panelId: "delivery-panel-payload",
					},
				]}
				value={tab}
				onChange={setTab}
			/>
			<TabPanel id="delivery-panel-logs" tabId="delivery-tab-logs" hidden={tab !== "logs"}>
				<Text>Twelve deliveries in the last hour.</Text>
			</TabPanel>
			<TabPanel id="delivery-panel-payload" tabId="delivery-tab-payload" hidden={tab !== "payload"}>
				<Text>The last payload was 2 KB.</Text>
			</TabPanel>
		</Column>
	);
}

export const StandaloneTabPanel: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"When the panel sits away from the tabs, give each tab an `id` and `panelId` and render `TabPanel` yourself.",
			},
		},
	},
	render: () => <Standalone />,
};
