import { StepIndicator } from "@optimusfoundry/quiet";

const SETUP = [
	{ label: "Connect", description: "Slack workspace linked" },
	{ label: "Choose a trigger", description: "web-message or slack.mention" },
	{ label: "Pick a runner", description: "Orca or Headless" },
	{ label: "Review", description: "Approve scopes and launch" },
];

export const ProjectSetup = () => (
	<div style={{ width: 280 }}>
		<StepIndicator label="Project setup" orientation="vertical" steps={SETUP} current={2} />
	</div>
);

export const Horizontal = () => (
	<div style={{ width: 560 }}>
	<StepIndicator
		label="Project setup"
		orientation="horizontal"
		size="sm"
		steps={[{ label: "Connect" }, { label: "Trigger" }, { label: "Runner" }, { label: "Review" }]}
		current={1}
	/>
	</div>
);

export const ErrorStep = () => (
	<div style={{ width: 280 }}>
		<StepIndicator
			label="Deploy run 9b1e04aa"
			orientation="vertical"
			size="sm"
			steps={[
				{ label: "Build", description: "42s", status: "complete" },
				{ label: "Tests", description: "3 failed in Headless", status: "error" },
				{ label: "Publish", status: "upcoming" },
			]}
			current={1}
		/>
	</div>
);

export const Arabic = () => (
	<div style={{ width: 280 }}>
		<StepIndicator label="Approval" orientation="vertical" numerals="arabic" size="sm" steps={SETUP.slice(0, 3)} current={1} />
	</div>
);
