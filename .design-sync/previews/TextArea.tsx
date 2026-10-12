import { TextArea } from "@optimusfoundry/quiet";

const col = { display: "grid", gap: "var(--q-space-stack)", maxWidth: 420 } as const;

export const Default = () => (
	<div style={col}>
		<TextArea
			label="Run instructions"
			rows={4}
			placeholder="What should the agent do when a web-message arrives?"
			helperText="Sent as the system prompt for every run."
		/>
	</div>
);

export const WithCounter = () => (
	<div style={col}>
		<TextArea
			label="Project description"
			maxLength={280}
			rows={3}
			defaultValue="Answers inbound web-messages for the support team, drafts replies and files artifacts for review."
		/>
	</div>
);

export const Error = () => (
	<div style={col}>
		<TextArea label="Approval note" rows={3} required error="Add a note before rejecting this approval." />
	</div>
);

export const Disabled = () => (
	<div style={col}>
		<TextArea
			label="System prompt"
			rows={3}
			disabled
			defaultValue="You are the Assistant agent for Sjocamp. Reply in the customer's language."
			helperText="Locked while run 233f76c2 is in progress."
		/>
	</div>
);
