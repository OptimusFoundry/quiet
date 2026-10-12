import type React from "react";
import { useEffect, useRef } from "react";
import { Avatar, Button, DropdownMenu, Icon, Text } from "@optimusfoundry/quiet";

// Menus open by click and are absolutely positioned; click the trigger on mount and give the menu room.
// A pointer-style click (detail 1) opens it without keyboard focus on the first item.
function Opened({ children }: { children: React.ReactNode }) {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		ref.current
			?.querySelector(".q-dropdown-menu__trigger")
			?.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
	}, []);
	return (
		<div ref={ref} style={{ display: "grid", alignContent: "start", justifyItems: "start", width: 300, minHeight: 360 }}>
			{children}
		</div>
	);
}

export const Actions = () => (
	<Opened>
		<DropdownMenu
			trigger={
				<Button size="sm" variant="secondary" rightIcon={<Icon name="arrow-down" />}>
					Run actions
				</Button>
			}
			items={[
				{ label: "Restart run", shortcut: "⌘R" },
				{ label: "Duplicate", shortcut: "⌘D" },
				{ divider: true },
				{ group: "Export" },
				{ label: "Transcript", sublabel: "JSON, with tool calls" },
				{ label: "Artifacts", sublabel: "Zip of 3 files" },
				{ divider: true },
				{ label: "Delete run", danger: true, shortcut: "⌫" },
			]}
		/>
	</Opened>
);

export const Checkable = () => (
	<Opened>
		<DropdownMenu
			trigger={
				<Button size="sm" variant="secondary" rightIcon={<Icon name="arrow-down" />}>
					Columns
				</Button>
			}
			items={[
				{ label: "Trigger", checked: true },
				{ label: "Runner", checked: true },
				{ label: "Cost", checked: true },
				{ label: "Approver", checked: false },
			]}
			caption="Saved per project"
		/>
	</Opened>
);

export const Account = () => (
	<Opened>
		<DropdownMenu
			width={240}
			trigger={<Avatar name="Ada Park" size="sm" />}
			label="Account"
			header={
				<div style={{ display: "grid", gap: 2 }}>
					<Text size="sm" weight="semibold" color="heading">
						Ada Park
					</Text>
					<Text mono>ada@agentworks.dev</Text>
				</div>
			}
			items={[{ label: "Profile", active: true }, { label: "Billing" }, { label: "API keys" }, { divider: true }, { label: "Sign out" }]}
		/>
	</Opened>
);

export const Small = () => (
	<Opened>
		<DropdownMenu
			size="sm"
			trigger={<Button size="sm" variant="secondary" icon={<Icon name="more" />} aria-label="Artifact actions" />}
			items={[{ label: "Open" }, { label: "Copy link" }, { label: "Rename" }, { divider: true }, { label: "Archive", danger: true }]}
		/>
	</Opened>
);
