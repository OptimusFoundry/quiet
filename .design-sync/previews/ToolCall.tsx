import { ToolCall } from "@optimusfoundry/quiet";

const box = { display: "grid", gap: "var(--q-space-stack)", width: 520 } as const;

export const States = () => (
	<div style={box}>
		<ToolCall name="web_search" status="running" summary="Orca runner timeout defaults" />
		<ToolCall name="query_runs" status="done" duration={840} summary="Assistant · last 24h" />
		<ToolCall name="send_approval" status="error" duration={2100} summary="to Ada Park" />
		<ToolCall kind="thinking" status="done" duration={3400} summary="Weighing the two runners" />
	</div>
);

export const Open = () => (
	<div style={box}>
		<ToolCall
			name="query_runs"
			status="done"
			duration={840}
			summary="Assistant · last 24h"
			input={{ project: "assistant", range: "24h", status: "failed" }}
			output="2 rows · 9a01be44, 4c7d21f0"
			defaultOpen
		/>
	</div>
);

export const ErrorOpen = () => (
	<div style={box}>
		<ToolCall
			name="send_approval"
			status="error"
			duration={2100}
			summary="to Ada Park"
			input={{ to: "ada.park", artifact: "release-notes.pdf" }}
			output="SMTP 421: try again later"
			defaultOpen
		/>
	</div>
);

export const Thinking = () => (
	<div style={box}>
		<ToolCall
			kind="thinking"
			status="done"
			duration={3400}
			summary="Weighing the two runners"
			output="Headless is cheaper per run, but the web-message trigger needs a session that survives the approval wait; Orca keeps it."
			defaultOpen
		/>
	</div>
);
