import { Accordion } from "@optimusfoundry/quiet";

const box = { width: 380 } as const;

export const Single = () => (
	<div style={box}>
		<Accordion
			defaultExpanded={["runner"]}
			items={[
				{ id: "runner", title: "Which runner does a run use?", content: "Orca by default. Triggers that open a browser, like web-message with a link, run on Headless." },
				{ id: "cost", title: "How is cost counted?", description: "Per run", content: "Tokens and runner minutes, billed to the project. A typical run costs $0.064512." },
				{ id: "approvals", title: "Who approves actions?", content: "Project owners. Ada Park gets every refund over $50." },
				{ id: "sso", title: "Can I use SSO?", description: "Enterprise plan", disabled: true, content: "" },
			]}
		/>
	</div>
);

export const Multiple = () => (
	<div style={box}>
		<Accordion
			multiple
			defaultExpanded={["trigger", "tools"]}
			items={[
				{ id: "trigger", title: "Trigger", content: "web-message from #support, 14:02." },
				{ id: "tools", title: "Tool calls", content: "search_tickets, draft_reply, request_approval." },
				{ id: "artifacts", title: "Artifacts", content: "refund-draft.eml (1.1 KB)." },
			]}
		/>
	</div>
);

export const Collapsed = () => (
	<div style={box}>
		<Accordion
			items={[
				{ id: "general", title: "General", content: "Project name, description and default runner." },
				{ id: "triggers", title: "Triggers", description: "3 active", content: "web-message, slack.mention, schedule.daily." },
				{ id: "danger", title: "Danger zone", content: "Archive or delete the project." },
			]}
		/>
	</div>
);
