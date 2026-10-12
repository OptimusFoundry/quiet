import { Avatar, Button, RunScrubber } from "@optimusfoundry/quiet";

const box = { width: 560 } as const;
const agent = <Avatar name="Meerkat" size="sm" shape="square" />;

const RUN = [
	{ label: "Read trigger", detail: "web-message from #support: \"refund order 5521, charged twice\"." },
	{ label: "Look up order", detail: "Order 5521 has two charges of $41.99, 3 seconds apart. Looks like a retry." },
	{ label: "Check policy", detail: "Duplicate charges refund without approval under $50. This one qualifies." },
	{ label: "Draft reply", detail: "Drafted refund-reply.eml. Tone: apologetic, short." },
	{ label: "Refund", detail: "Refunded $41.99. Run cost $0.902049 on Orca." },
];

export const Replay = () => (
	<div style={box}>
		<RunScrubber
			steps={RUN}
			defaultValue={2}
			label="Meerkat's run"
			agent={agent}
			caption={(i) => `Step ${i + 1} · what it was thinking`}
			actions={(i) => (
				<>
					<Button size="sm" variant="secondary">
						Branch from step {i + 1}
					</Button>
					<Button size="sm" variant="ghost">
						Correct this thought
					</Button>
				</>
			)}
		/>
	</div>
);

export const FirstStep = () => (
	<div style={box}>
		<RunScrubber steps={RUN} defaultValue={0} label="Meerkat's run" agent={agent} />
	</div>
);

export const Finished = () => (
	<div style={box}>
		<RunScrubber
			steps={[
				{ label: "Fetch pages", detail: "Opened 6 pages on Headless; 1 blocked by a login wall." },
				{ label: "Summarise", detail: "Wrote competitor-pricing.md, 840 words." },
				{ label: "Publish", detail: "Saved the artifact to Research · Q4 and pinged Ada Park." },
			]}
			defaultValue={2}
			label="Meerkat's research run"
			agent={agent}
			actions={<Button size="sm" variant="secondary">Open artifact</Button>}
		/>
	</div>
);
