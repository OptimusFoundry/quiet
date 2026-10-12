import type React from "react";
import { useEffect } from "react";
import { CommandPalette } from "@optimusfoundry/quiet";

const COMMANDS = [
	{ label: "Runs", group: "Go to" },
	{ label: "Artifacts", group: "Go to" },
	{ label: "Settings", group: "Go to" },
	{ label: "New run", group: "Actions", shortcut: "⌘N" },
	{ label: "Invite teammate", group: "Actions" },
	{ label: "Approve pending", group: "Actions", shortcut: "⌘⏎" },
	{ label: "Assistant", description: "14 runs · web-message", group: "Projects" },
	{ label: "Support triage", description: "Headless · jira.issue_created", group: "Projects" },
	{ label: "Weekly digest", description: "Orca · schedule.daily", group: "Projects" },
];

// An open CommandPalette is position: fixed; give the card a screen-height box (the full palette is ~560 tall) to centre it in.
const Screen = ({ children }: { children: React.ReactNode }) => <div style={{ minHeight: 640 }}>{children}</div>;

// The palette has no query prop: type into its input the way a person would.
function useQuery(query: string) {
	useEffect(() => {
		const t = setTimeout(() => {
			const input = document.querySelector<HTMLInputElement>(".q-command-palette__input");
			if (!input) return;
			const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
			set?.call(input, query);
			input.dispatchEvent(new Event("input", { bubbles: true }));
		}, 50);
		return () => clearTimeout(t);
	}, [query]);
}

export const Open = () => (
	<Screen>
		<CommandPalette open onClose={() => {}} items={COMMANDS} label="Command palette" />
	</Screen>
);

export const Filtered = () => {
	useQuery("run");
	return (
		<Screen>
			<CommandPalette open onClose={() => {}} items={COMMANDS} label="Command palette" />
		</Screen>
	);
};

export const NoResults = () => {
	useQuery("orca billing export");
	return (
		<Screen>
			<CommandPalette
				open
				onClose={() => {}}
				items={COMMANDS}
				label="Command palette"
				emptyText="No commands or projects match. Try a run id like 233f76c2."
			/>
		</Screen>
	);
};
