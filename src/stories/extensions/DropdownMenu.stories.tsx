import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState } from "react";
import { Button, DropdownMenu, Icon } from "../../index";
import "./DropdownMenu.scss";

// Additions on top of the Claude Design catalog: controlled open state (open, defaultOpen, onOpenChange).
const meta: Meta = { title: "Extensions/DropdownMenu", parameters: { layout: "padded" } };
export default meta;

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
		<div id="controlled" className="q-sb-dropdown-menu">
			<div className="q-sb-dropdown-menu__row">
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
				<span className="q-sb-dropdown-menu__hint">or press ⌘K / Ctrl+K</span>
			</div>
			<output aria-label="Events">{log.join("\n") || "No events yet."}</output>
		</div>
	);
}

export const Controlled: StoryObj = { render: () => <ControlledDemo /> };

function AsyncDemo() {
	const [open, setOpen] = useState(false);
	const [busy, setBusy] = useState(false);
	const [done, setDone] = useState<string | null>(null);
	// A ref, so the close that follows the item's onSelect in the same event already sees it.
	const pending = useRef(false);
	const run = (what: string) => {
		pending.current = true;
		setBusy(true);
		setTimeout(() => {
			pending.current = false;
			setBusy(false);
			setDone(what);
			setOpen(false);
		}, 1500);
	};
	return (
		<div id="async" className="q-sb-dropdown-menu">
			<div className="q-sb-dropdown-menu__row">
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
			</div>
			<output aria-live="polite">{done ? `Exported ${done}.` : ""}</output>
		</div>
	);
}

export const KeepOpenDuringAction: StoryObj = { render: () => <AsyncDemo /> };

export const DefaultOpen: StoryObj = {
	render: () => (
		<div id="default-open" className="q-sb-dropdown-menu">
			<DropdownMenu
				trigger={<Button variant="secondary">Menu</Button>}
				defaultOpen
				items={[{ label: "First" }, { label: "Second" }]}
			/>
		</div>
	),
};

// Single choice (menuitemradio): a `{ group, radio: true }` label makes the items under it one set;
// the checked one gets a trailing check. Enter or a click picks and closes, Space picks and stays.
function SingleChoiceDemo({ startOpen = false }: { startOpen?: boolean }) {
	const [sort, setSort] = useState("Updated");
	const [archived, setArchived] = useState(false);
	return (
		<div id="single-choice" className="q-sb-dropdown-menu">
			<div className="q-sb-dropdown-menu__row">
				<DropdownMenu
					trigger={
						<Button variant="secondary" rightIcon={<Icon name="chevron-down" />}>
							Sort: {sort}
						</Button>
					}
					defaultOpen={startOpen}
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
			</div>
			<output aria-live="polite">{`Sorted by ${sort.toLowerCase()}${archived ? ", archived shown" : ""}.`}</output>
		</div>
	);
}

export const SingleChoice: StoryObj = { render: () => <SingleChoiceDemo /> };
export const SingleChoiceOpen: StoryObj = { render: () => <SingleChoiceDemo startOpen /> };
