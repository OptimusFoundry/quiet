import { ChatDivider, ChatMessage, ChatThread } from "@optimusfoundry/quiet";

export const InThread = () => (
	<div style={{ width: 560, height: 520 }}>
		<ChatThread>
			<ChatDivider>Yesterday</ChatDivider>
			<ChatMessage from="user">Pause the Headless runner for the night.</ChatMessage>
			<ChatMessage>
				<p>Paused. Queued runs will start on Orca instead.</p>
			</ChatMessage>
			<ChatDivider>Today</ChatDivider>
			<ChatMessage from="user">Turn it back on.</ChatMessage>
			<ChatMessage>
				<p>Headless is running again — 3 queued runs moved back.</p>
			</ChatMessage>
		</ChatThread>
	</div>
);

export const Standalone = () => (
	<div style={{ display: "grid", gap: "var(--q-space-stack)", width: 320 }}>
		<ChatDivider>Today</ChatDivider>
		<ChatDivider>Ada Park joined</ChatDivider>
	</div>
);
