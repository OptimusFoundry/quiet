import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Text } from "../components/core/Text";
import { TabPanel, Tabs } from "../components/navigation/Tabs";

// quiet's own: wired tab panels are not in the Optimus Foundry reference.
const TABS = [
	{ value: "general", label: "General" },
	{ value: "team", label: "Team", count: 4 },
	{ value: "billing", label: "Billing" },
	{ value: "danger", label: "Danger zone", disabled: true },
];

function Panels() {
	return (
		<div style={{ padding: 24 }}>
			<Tabs
				label="Account settings"
				tabs={TABS}
				panels={{
					general: <Text>Name, email and avatar.</Text>,
					team: <Text>Four people have access to this workspace.</Text>,
					billing: <Text>You are on the Pro plan.</Text>,
				}}
			/>
		</div>
	);
}

function Render() {
	const [tab, setTab] = useState("Connected");
	return (
		<div style={{ padding: 24 }}>
			<Tabs
				label="Integrations"
				variant="enclosed"
				tabs={["Connected", "Available", "Requests"]}
				value={tab}
				onChange={setTab}
				panels={(value) => <Text>{value} integrations.</Text>}
			/>
		</div>
	);
}

function Standalone() {
	const [tab, setTab] = useState("logs");
	return (
		<div style={{ padding: 24, display: "grid", gap: 16 }}>
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
		</div>
	);
}

const meta: Meta = { title: "Navigation/Tab panels" };
export default meta;

export const PanelsRecord: StoryObj = { render: () => <Panels /> };
export const PanelsRenderFunction: StoryObj = { render: () => <Render /> };
export const StandaloneTabPanel: StoryObj = { render: () => <Standalone /> };
