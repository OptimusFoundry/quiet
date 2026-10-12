import { Breadcrumb } from "@optimusfoundry/quiet";

export const RunPath = () => (
	<Breadcrumb
		items={[
			{ label: "Projects", href: "#projects" },
			{ label: "Assistant", href: "#assistant" },
			{ label: "Runs", href: "#runs" },
			{ label: "Run 233f76c2" },
		]}
	/>
);

export const Sizes = () => (
	<div style={{ display: "grid", gap: "var(--q-space-stack)" }}>
		<Breadcrumb size="sm" items={[{ label: "Artifacts", href: "#a" }, { label: "weekly-digest.md" }]} />
		<Breadcrumb size="md" items={[{ label: "Artifacts", href: "#a" }, { label: "weekly-digest.md" }]} />
		<Breadcrumb size="lg" items={[{ label: "Artifacts", href: "#a" }, { label: "weekly-digest.md" }]} />
	</div>
);

export const Collapsed = () => (
	<Breadcrumb
		maxItems={3}
		items={[
			{ label: "Workspace", href: "#w" },
			{ label: "Projects", href: "#p" },
			{ label: "Support triage", href: "#s" },
			{ label: "Triggers", href: "#t" },
			{ label: "jira.issue_created" },
		]}
	/>
);

export const CustomSeparator = () => (
	<Breadcrumb
		separator="›"
		items={[
			{ label: "Settings", href: "#settings" },
			{ label: "Runners", href: "#runners" },
			{ label: "Headless" },
		]}
	/>
);
