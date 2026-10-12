import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "../../../components/core/Avatar";
import { Button } from "../../../components/core/Button";
import { Icon } from "../../../components/core/Icon";
import { DropdownMenu } from "../../../components/overlays/DropdownMenu";
import { Column, Note, Row } from "../Story";
import "./DropdownMenu.scss";

const meta = {
	title: "Components/Overlays/DropdownMenu",
	component: DropdownMenu,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		trigger: <Button variant="secondary">Run actions</Button>,
		items: [
			{ label: "Rerun", icon: <Icon name="undo" />, shortcut: "R" },
			{ label: "Duplicate", icon: <Icon name="copy" />, shortcut: "D" },
			{ label: "Download artifacts", icon: <Icon name="download" /> },
			{ divider: true },
			{ label: "Cancel run", danger: true },
		],
		size: "md",
		align: "start",
		width: 240,
		contextMenu: false,
	},
	argTypes: {
		trigger: { control: false },
		items: { control: false },
		header: { control: "text" },
		caption: { control: "text" },
		children: { control: false },
		onSelect: { control: false },
		onOpenChange: { control: false },
		open: { control: false },
	},
	decorators: [
		(Story) => (
			<div className="q-sb-dropdown-menu">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof DropdownMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AccountMenu: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`header` names who is signed in, group labels sort the actions, `caption` closes it.",
			},
		},
	},
	args: {
		trigger: (
			<Button variant="ghost" leftIcon={<Avatar size="xs" name="Ada Lovelace" />}>
				Ada Lovelace
			</Button>
		),
		header: "ada@agentworks.dev",
		caption: "agentworks, Business plan",
		items: [
			{ group: "Workspace" },
			{ label: "Settings", icon: <Icon name="settings" />, shortcut: "⌘," },
			{ label: "Billing", icon: <Icon name="billing" /> },
			{ label: "API keys", icon: <Icon name="key" /> },
			{ divider: true },
			{ label: "Sign out", icon: <Icon name="sign-out" /> },
		],
	},
};

export const Small: Story = {
	parameters: {
		docs: { description: { story: '`size="sm"` for dense toolbars and table rows.' } },
	},
	args: {
		size: "sm",
		width: 200,
		trigger: <Button size="sm" variant="ghost" icon={<Icon name="more" />} aria-label="More" />,
		items: [
			{ label: "Open", sublabel: "In the side pane" },
			{ label: "Copy link", shortcut: "⌘L" },
			{ label: "Archive", disabled: true },
		],
	},
};

// Single choice (menuitemradio): a `{ group, radio: true }` label makes the items under it one set;
// the checked one gets a trailing check. A plain `checked` item is a checkbox and keeps the menu open.
function ChoicesDemo() {
	const [sort, setSort] = useState("Updated");
	const [archived, setArchived] = useState(false);
	return (
		<Column>
			<Row>
				<DropdownMenu
					trigger={
						<Button variant="secondary" rightIcon={<Icon name="chevron-down" />}>
							Sort: {sort}
						</Button>
					}
					header="Runs view"
					items={[
						{ group: "Sort by", radio: true },
						...["Updated", "Created", "Name", "Cost"].map((label) => ({
							label,
							checked: sort === label,
							onSelect: () => setSort(label),
						})),
						{ divider: true },
						{
							label: "Show archived",
							checked: archived,
							onSelect: () => setArchived((a) => !a),
						},
					]}
				/>
			</Row>
			<Note>
				{`Sorted by ${sort.toLowerCase()}${archived ? ", archived shown" : ""}.`} Enter or a click
				picks and closes; Space picks and keeps it open.
			</Note>
		</Column>
	);
}

export const CheckboxAndRadioItems: Story = { render: () => <ChoicesDemo /> };

function ControlledDemo() {
	const [open, setOpen] = useState(false);
	const [log, setLog] = useState<string[]>([]);
	const note = (s: string) => setLog((l) => [s, ...l].slice(0, 4));
	// ⌘K / Ctrl+K opens the menu from anywhere; focus moves to its first item as on a normal open.
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen(true);
			}
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, []);
	return (
		<Column>
			<Row>
				<DropdownMenu
					trigger={<Button variant="secondary">Actions</Button>}
					open={open}
					onOpenChange={(v) => {
						note(`onOpenChange(${v})`);
						setOpen(v);
					}}
					items={[
						{ label: "Rename", shortcut: "R" },
						{ label: "Duplicate", shortcut: "D" },
						{ divider: true },
						{ label: "Archive", danger: true },
					]}
				/>
				<Button variant="ghost" onClick={() => setOpen(true)}>
					Open from outside
				</Button>
			</Row>
			<Note>Or press ⌘K / Ctrl+K. Closing returns focus to where it was.</Note>
			<output className="q-sb-dropdown-menu__log" aria-label="Events">
				{log.join("\n") || "No events yet."}
			</output>
		</Column>
	);
}

export const Controlled: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`open` + `onOpenChange`: the app opens it from a shortcut or another button, and hears every close.",
			},
		},
	},
	render: () => <ControlledDemo />,
};

function AsyncDemo() {
	const [open, setOpen] = useState(false);
	const [busy, setBusy] = useState(false);
	const [done, setDone] = useState<string | null>(null);
	// A ref, so the close that follows the item's onSelect in the same event already sees it.
	const pending = useRef(false);
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
	useEffect(() => () => clearTimeout(timer.current), []);
	const run = (what: string) => {
		pending.current = true;
		setBusy(true);
		timer.current = setTimeout(() => {
			pending.current = false;
			setBusy(false);
			setDone(what);
			setOpen(false);
		}, 1500);
	};
	return (
		<Column>
			<Row>
				<DropdownMenu
					trigger={<Button variant="secondary">Export</Button>}
					open={open}
					onOpenChange={(v) => !pending.current && setOpen(v)}
					caption={busy ? "Exporting…" : "Stays open until the export finishes"}
					items={[
						{ label: "Export as CSV", onSelect: () => run("CSV") },
						{ label: "Export as PDF", onSelect: () => run("PDF") },
					]}
				/>
			</Row>
			<output aria-live="polite">{done ? `Exported ${done}.` : ""}</output>
		</Column>
	);
}

export const KeepOpenDuringAction: Story = {
	parameters: {
		docs: {
			description: {
				story: "Controlled `open` that ignores the close request while an export runs.",
			},
		},
	},
	render: () => <AsyncDemo />,
};

export const ContextMenu: Story = {
	parameters: {
		docs: { description: { story: "`contextMenu` opens at the pointer on a right-click." } },
	},
	args: {
		contextMenu: true,
		trigger: undefined,
		children: <div className="q-sb-dropdown-menu__area">Right-click this artifact</div>,
		items: [
			{ label: "Open", icon: <Icon name="external" /> },
			{ label: "Download", icon: <Icon name="download" /> },
			{ label: "Copy link", icon: <Icon name="link" /> },
			{ divider: true },
			{ label: "Delete", danger: true },
		],
	},
};
