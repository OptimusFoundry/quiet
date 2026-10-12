import { CodeBlock } from "@optimusfoundry/quiet";

const box = { width: 560 } as const;

export const Sql = () => (
	<div style={box}>
		<CodeBlock
			language="sql"
			code={`select runner, count(*) as runs, sum(cost_usd) as cost\nfrom runs\nwhere started_at > now() - interval '7 days'\ngroup by 1\norder by cost desc;`}
		/>
	</div>
);

export const WithFilename = () => (
	<div style={box}>
		<CodeBlock
			filename="triggers.ts"
			language="ts"
			maxHeight={180}
			code={`export const trigger = defineTrigger({\n  kind: "web-message",\n  project: "assistant",\n  runner: "orca",\n  approval: { required: true, from: ["ada.park"] },\n  budget: { maxUsd: 2.5 },\n});\n\nexport const nightly = defineTrigger({\n  kind: "schedule",\n  cron: "0 3 * * *",\n  runner: "headless",\n});`}
		/>
	</div>
);

export const Wrapped = () => (
	<div style={box}>
		<CodeBlock
			language="bash"
			wrap
			code={`quiet runs list --project assistant --status failed --since 24h --runner headless --format table --columns id,trigger,cost_usd,started_at`}
		/>
	</div>
);
