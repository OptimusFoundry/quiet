import { PageTransition, Tabs, Text } from "@optimusfoundry/quiet";
import { useState } from "react";

const copy: Record<string, string> = {
	Overview: "Run #4182 finished in 6.2s on the Orca runner. Cost $0.902049.",
	Artifacts: "reply-draft.md, summary.json — both waiting on Ada Park’s approval.",
	Logs: "112 lines · last: “sent reply via web-message”.",
};

export const Tabbed = () => {
	const [t, setT] = useState("Overview");
	return (
		<div style={{ display: "grid", gap: "var(--q-space-4)", width: 420 }}>
			<Tabs tabs={Object.keys(copy)} value={t} onChange={setT} />
			<PageTransition transitionKey={t} variant="slideUp">
				<Text>{copy[t]}</Text>
			</PageTransition>
		</div>
	);
};

export const Variants = () => (
	<div style={{ display: "grid", gap: "var(--q-space-3)", width: 320 }}>
		{(["fade", "slide", "slideUp", "scale"] as const).map((v) => (
			<PageTransition key={v} transitionKey={v} variant={v}>
				<div
					style={{
						padding: "var(--q-space-3)",
						background: "var(--q-bg-subtle)",
						border: "1px solid var(--q-border)",
						borderRadius: "var(--q-radius-sm)",
					}}
				>
					<Text mono size="sm">variant="{v}"</Text>
				</div>
			</PageTransition>
		))}
	</div>
);
