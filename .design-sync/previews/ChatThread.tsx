import { ChatDivider, ChatMessage, ChatThread, PromptSuggestions, ToolCall } from "@optimusfoundry/quiet";

const frame = { width: 600, height: 520 } as const;

export const Thread = () => (
	<div style={frame}>
		<ChatThread label="Conversation with Claude">
			<ChatDivider>Yesterday</ChatDivider>
			<ChatMessage from="user">Set up a web-message trigger for the Assistant project.</ChatMessage>
			<ChatMessage>
				<p>Done. Messages to the project’s webhook now start a run on the Orca runner.</p>
			</ChatMessage>
			<ChatDivider>Today</ChatDivider>
			<ChatMessage from="user">Which of those runs failed overnight?</ChatMessage>
			<ChatMessage onRetry={() => {}}>
				<ToolCall name="query_runs" status="done" duration={640} summary="Assistant · last 24h" output="2 rows" />
				<p>Two did — 9a01be44 and 4c7d21f0. Both timed out after 120s waiting on an approval from Ada Park.</p>
			</ChatMessage>
		</ChatThread>
	</div>
);

export const Empty = () => (
	<div style={{ width: 600, height: 360 }}>
		<ChatThread
			empty={
				<div style={{ display: "grid", gap: "var(--q-space-stack)", justifyItems: "center", textAlign: "center", width: "100%" }}>
					<div style={{ fontSize: "var(--q-text-xl)", fontWeight: 600 }}>What are we working on?</div>
					<PromptSuggestions
						layout="grid"
						suggestions={[
							{ label: "Why did a run fail?", description: "Paste a run id", prompt: "Why did run 9a01be44 fail?" },
							{ label: "Summarise this week’s costs", description: "Across Orca and Headless", prompt: "Summarise this week’s costs." },
							{ label: "Draft an approval note", description: "For the release artifact", prompt: "Draft an approval note." },
							{ label: "Add a trigger", description: "web-message, schedule or webhook", prompt: "Add a web-message trigger." },
						]}
					/>
				</div>
			}
		/>
	</div>
);

export const Streaming = () => (
	<div style={{ width: 600, height: 360 }}>
		<ChatThread>
			<ChatDivider>Today</ChatDivider>
			<ChatMessage from="user">Re-run 9a01be44 on Headless and tell me what changed.</ChatMessage>
			<ChatMessage status="streaming">
				<ToolCall name="start_run" status="running" summary="9a01be44 · Headless" />
				<p>Starting the run now. The last attempt stalled at</p>
			</ChatMessage>
		</ChatThread>
	</div>
);
