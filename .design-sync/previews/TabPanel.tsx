import { useState } from "react";
import { TabPanel, Tabs, Text } from "@optimusfoundry/quiet";

// TabPanel is the standalone panel for Tabs without `panels`: wire tab `id`/`panelId` to it yourself.
export const WebhookDelivery = () => {
	const [tab, setTab] = useState("logs");
	return (
		<div style={{ display: "grid", gap: "var(--q-space-stack)", width: 340 }}>
			<Tabs
				label="Delivery"
				tabs={[
					{ value: "logs", label: "Logs", id: "delivery-tab-logs", panelId: "delivery-panel-logs" },
					{ value: "payload", label: "Payload", id: "delivery-tab-payload", panelId: "delivery-panel-payload" },
				]}
				value={tab}
				onChange={setTab}
			/>
			<TabPanel id="delivery-panel-logs" tabId="delivery-tab-logs" hidden={tab !== "logs"}>
				<Text size="sm">Twelve web-message deliveries in the last hour, all 200 OK.</Text>
			</TabPanel>
			<TabPanel id="delivery-panel-payload" tabId="delivery-tab-payload" hidden={tab !== "payload"}>
				<Text size="sm">The last payload was 2 KB.</Text>
			</TabPanel>
		</div>
	);
};

export const SecondTabSelected = () => {
	const [tab, setTab] = useState("payload");
	return (
		<div style={{ display: "grid", gap: "var(--q-space-stack)", width: 340 }}>
			<Tabs
				label="Delivery"
				variant="enclosed"
				size="sm"
				tabs={[
					{ value: "logs", label: "Logs", id: "d2-tab-logs", panelId: "d2-panel-logs" },
					{ value: "payload", label: "Payload", id: "d2-tab-payload", panelId: "d2-panel-payload" },
				]}
				value={tab}
				onChange={setTab}
			/>
			<TabPanel id="d2-panel-logs" tabId="d2-tab-logs" hidden={tab !== "logs"}>
				<Text size="sm">Twelve deliveries in the last hour.</Text>
			</TabPanel>
			<TabPanel id="d2-panel-payload" tabId="d2-tab-payload" hidden={tab !== "payload"}>
				<Text size="sm">Last payload: 2 KB from web-message, project Assistant, 200 OK in 412 ms.</Text>
			</TabPanel>
		</div>
	);
};
