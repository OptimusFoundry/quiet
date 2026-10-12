import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, useState } from "react";
import { Button } from "../../../components/core/Button";
import { Icon } from "../../../components/core/Icon";
import {
	CommandPalette,
	type CommandPaletteItem,
} from "../../../components/navigation/CommandPalette";
import { Column, Note } from "../Story";

const COMMANDS: CommandPaletteItem[] = [
	{ label: "New run", group: "Actions", icon: <Icon name="plus" />, shortcut: "N" },
	{ label: "Invite people", group: "Actions", icon: <Icon name="users" /> },
	{ label: "Approve pending runs", group: "Actions", icon: <Icon name="approvals" /> },
	{ label: "Runs", group: "Go to", icon: <Icon name="runs" />, description: "All runs in Meerkat" },
	{ label: "Runners", group: "Go to", icon: <Icon name="list" /> },
	{
		label: "Billing",
		group: "Go to",
		icon: <Icon name="billing" />,
		description: "Invoices and plan",
	},
	{ label: "Settings", group: "Go to", icon: <Icon name="settings" />, shortcut: "G S" },
];

const meta = {
	title: "Components/Navigation/CommandPalette",
	component: CommandPalette,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { open: false, items: COMMANDS, placeholder: "Type a command or search", hotkey: true },
	argTypes: {
		open: { control: false },
		items: { control: false },
		emptyText: { control: false },
		onClose: { control: false },
		onOpen: { control: false },
	},
} satisfies Meta<typeof CommandPalette>;
export default meta;
type Story = StoryObj<typeof meta>;

type DemoProps = Omit<ComponentProps<typeof CommandPalette>, "open"> & {
	defaultOpen?: boolean;
	/** Listen for ⌘K / Ctrl+K. Only one story on a page does, or they would all open. */
	listen?: boolean;
	trigger?: string;
	note?: string;
};

function PaletteDemo({
	defaultOpen = false,
	listen,
	trigger = "Open palette",
	note,
	...props
}: DemoProps) {
	const [open, setOpen] = useState(defaultOpen);
	const [last, setLast] = useState<string | null>(null);
	const items = props.items.map((it) => ({ ...it, onSelect: () => setLast(it.label) }));
	return (
		<Column>
			<div>
				<Button variant="secondary" leftIcon={<Icon name="search" />} onClick={() => setOpen(true)}>
					{trigger}
				</Button>
			</div>
			<Note>
				{last ? `Ran: ${last}` : (note ?? "Pick a command with the arrow keys and Enter.")}
			</Note>
			<CommandPalette
				{...props}
				items={items}
				open={open}
				onOpen={listen ? () => setOpen(true) : undefined}
				onClose={() => setOpen(false)}
			/>
		</Column>
	);
}

export const Playground: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Opens with the button, or with ⌘K / Ctrl+K (`hotkey` + `onOpen`) on the story's own canvas, where it starts open. Type to filter by label, description or group; Escape closes and focus returns to the opener.",
			},
		},
	},
	render: (args, { viewMode }) => (
		<PaletteDemo
			{...args}
			listen={args.hotkey && viewMode === "story"}
			defaultOpen={viewMode === "story"}
			note={
				viewMode === "story"
					? "Press ⌘K or Ctrl+K anywhere on the page."
					: "Open this story on its own canvas to try ⌘K / Ctrl+K."
			}
		/>
	),
};

export const Ungrouped: Story = {
	parameters: {
		docs: { description: { story: "Items without a `group` list flat, in the order given." } },
	},
	render: () => (
		<PaletteDemo
			trigger="Jump to a runner"
			placeholder="Search runners"
			label="Jump to a runner"
			items={[
				{ label: "Nightly export", description: "Runs at 02:00 UTC" },
				{ label: "Invoice reconciler", description: "On every new invoice" },
				{ label: "Approval digest", description: "Weekdays at 09:00" },
			]}
		/>
	),
};

export const Empty: Story = {
	parameters: {
		docs: {
			description: {
				story: "`emptyText` shows when nothing matches; screen readers hear the result count.",
			},
		},
	},
	render: () => (
		<PaletteDemo
			trigger="Search artifacts"
			placeholder="Search artifacts"
			label="Search artifacts"
			items={[]}
			emptyText="No artifacts yet. Runs save their outputs here."
			note="Type anything: there are no artifacts yet."
		/>
	),
};

interface RouteItem extends CommandPaletteItem {
	path: string;
}

const ROUTES: RouteItem[] = [
	{ label: "Runs", path: "/runs", group: "Go to", icon: <Icon name="runs" /> },
	{ label: "Approvals", path: "/approvals", group: "Go to", icon: <Icon name="approvals" /> },
	{ label: "Invoices", path: "/billing/invoices", group: "Go to", icon: <Icon name="billing" /> },
];

function TypedDemo() {
	const [open, setOpen] = useState(false);
	const [path, setPath] = useState("/");
	return (
		<Column>
			<div>
				<Button variant="secondary" onClick={() => setOpen(true)}>
					Go to page
				</Button>
			</div>
			<Note>Current path: {path}</Note>
			<CommandPalette<RouteItem>
				open={open}
				onClose={() => setOpen(false)}
				label="Go to page"
				items={ROUTES.map((r) => ({ ...r, onSelect: (item) => setPath(item.path) }))}
			/>
		</Column>
	);
}

export const TypedItems: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Items can carry your own fields: `onSelect` receives the item typed as your item type (here a route with a `path`).",
			},
		},
	},
	render: () => <TypedDemo />,
};
