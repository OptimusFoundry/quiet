import { ChatMessage, CodeBlock, ToolCall } from "@optimusfoundry/quiet";

const box = { display: "grid", gap: "var(--q-space-stack)", width: 560 } as const;

export const Conversation = () => (
	<div style={box}>
		<ChatMessage from="user" time={new Date(2026, 9, 8, 9, 41)} onEdit={() => {}}>
			Which runs on the Assistant project failed overnight?
		</ChatMessage>
		<ChatMessage time={new Date(2026, 9, 8, 9, 42)} onRetry={() => {}}>
			<p>Two did. Both were web-message triggers on the Headless runner, and both timed out after 120s.</p>
			<p>The Orca runs all finished — the most expensive was 233f76c2 at $0.902049.</p>
		</ChatMessage>
	</div>
);

export const UserWithAttachments = () => (
	<div style={box}>
		<ChatMessage
			from="user"
			name="Ada Park"
			attachments={[
				{ name: "release-notes.pdf", size: 1_240_000, type: "application/pdf" },
				{ name: "costs-october.csv", size: 82_000, type: "text/csv" },
			]}
			onEdit={() => {}}
		>
			Turn these notes into the approval summary for #launches. Keep the cost table.
		</ChatMessage>
	</div>
);

export const WithToolAndCode = () => (
	<div style={box}>
		<ChatMessage onRetry={() => {}}>
			<ToolCall
				name="query_runs"
				status="done"
				duration={640}
				summary="Assistant · last 24h"
				input={{ project: "assistant", range: "24h", status: "failed" }}
				output="2 rows"
			/>
			<p>Here’s the query I ran, if you want it as a daily check:</p>
			<CodeBlock
				language="sql"
				code={`select id, trigger, runner, cost_usd\nfrom runs\nwhere project = 'assistant'\n  and status = 'failed'\n  and started_at > now() - interval '24 hours';`}
			/>
		</ChatMessage>
	</div>
);

export const States = () => (
	<div style={box}>
		<ChatMessage status="streaming">
			<p>Reading the run transcript now. The first tool call was</p>
		</ChatMessage>
		<ChatMessage status="error" error="The connection dropped. Nothing was sent." onRetry={() => {}}>
			<p>Comparing the two runners, the biggest change is</p>
		</ChatMessage>
		<ChatMessage from="system">Claude can now read artifacts in this project</ChatMessage>
	</div>
);
