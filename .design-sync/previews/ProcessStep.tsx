import { ProcessStep } from "@optimusfoundry/quiet";

const STEPS = [
	["i", "Trigger", "A web-message arrives in #support."],
	["ii", "Run", "Orca reads the thread and drafts a reply."],
	["iii", "Approve", "Ada Park reviews the refund before it sends."],
	["iv", "Publish", "The reply and refund-draft.eml are saved."],
] as const;

const row = { display: "grid", gridTemplateColumns: "repeat(4, 180px)", gap: "var(--q-space-stack)" } as const;

export const Single = () => (
	<div style={{ width: 220 }}>
		<ProcessStep numeral="i" title="Trigger">
			A web-message arrives in #support.
		</ProcessStep>
	</div>
);

export const Hot = () => (
	<div style={{ width: 220 }}>
		<ProcessStep numeral="ii" title="Run" hot>
			Orca reads the thread and drafts a reply.
		</ProcessStep>
	</div>
);

export const Sequence = () => (
	<div style={row}>
		{STEPS.map(([n, t, b], i) => (
			<ProcessStep key={n} numeral={n} title={t} hot={i < 2}>
				{b}
			</ProcessStep>
		))}
	</div>
);
