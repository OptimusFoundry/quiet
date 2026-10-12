import { Card, Icon } from "@optimusfoundry/quiet";

const box = { width: 300 } as const;

export const Linked = () => (
	<div style={box}>
		<Card eyebrow="Project" title="Support triage" meta="Headless · 34 runs" footer={<Icon name="arrow-right" />} href="#project">
			Reads new Jira issues, drafts a reply and asks you before refunding.
		</Card>
	</div>
);

export const Static = () => (
	<div style={box}>
		<Card eyebrow="Runner" title="Orca" meta="Hosted sandbox">
			Scales to zero between runs. Default for web-message triggers.
		</Card>
	</div>
);

export const WithAccent = () => (
	<div style={box}>
		<Card title="Weekly" accent="digest" meta="schedule.daily · $0.010002" footer={<Icon name="arrow-right" />} onClick={() => {}}>
			Summarises the week’s runs into summary.md every Monday.
		</Card>
	</div>
);

export const Grid = () => (
	<div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--q-space-stack)", width: 560 }}>
		<Card eyebrow="Project" title="Assistant" meta="Orca · 128 runs" footer={<Icon name="arrow-right" />} href="#a">
			Answers web-message and Slack mentions.
		</Card>
		<Card eyebrow="Project" title="Code review" meta="Orca · 41 runs" footer={<Icon name="arrow-right" />} href="#b">
			Reviews pull requests when they open.
		</Card>
	</div>
);
