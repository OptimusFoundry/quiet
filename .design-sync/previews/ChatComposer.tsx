import { ChatComposer } from "@optimusfoundry/quiet";

const box = { width: 560 } as const;
const mono = {
	fontFamily: "var(--q-font-mono)",
	fontSize: "var(--q-text-2xs)",
	letterSpacing: "var(--q-tracking-mono)",
	textTransform: "uppercase",
	color: "var(--q-fg-muted)",
} as const;

export const Ready = () => (
	<div style={box}>
		<ChatComposer
			placeholder="Ask about a run, or drop files here"
			accept="image/*,.pdf,.csv,.txt,.md"
			maxFiles={4}
			maxSize={5 * 1024 * 1024}
			toolbar={<span style={mono}>Claude Opus 5.5</span>}
			hint="⏎ send · ⇧⏎ line"
		/>
	</div>
);

export const WithAttachments = () => (
	<div style={box}>
		<ChatComposer
			defaultValue="Why did run 9a01be44 cost $0.902049? Compare it with yesterday’s web-message runs."
			defaultAttachments={[
				{ id: "u1", name: "run-9a01be44.json", size: 48_000, type: "application/json" },
				{ id: "u2", name: "costs-october.csv", size: 82_000, type: "text/csv" },
				{ id: "u3", name: "orca-session.txt", size: 4_200_000, type: "text/plain" },
			]}
			progress={{ u3: 0.6 }}
			toolbar={<span style={mono}>Claude Opus 5.5</span>}
			hint="Uploading…"
		/>
	</div>
);

export const Responding = () => (
	<div style={box}>
		<ChatComposer busy placeholder="Claude is responding…" onStop={() => {}} toolbar={<span style={mono}>Claude Opus 5.5</span>} />
	</div>
);

export const Disabled = () => (
	<div style={box}>
		<ChatComposer disabled placeholder="This project is archived — chat is read-only" />
	</div>
);
