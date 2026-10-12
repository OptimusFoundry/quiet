import { Button } from "../../../components/core/Button";
import { Icon } from "../../../components/core/Icon";
import { Text } from "../../../components/core/Text";
import { List } from "../../../components/data/List";
import { DropdownMenu } from "../../../components/overlays/DropdownMenu";
import { Popover } from "../../../components/overlays/Popover";
import type { Tile } from "./types";

// Overlays render open with a fixed `open` (no onOpenChange), so they stay open and still. The
// trigger sits on top of a little page content, so the open panel has room below it.
const PAGE = (
	<List
		size="sm"
		items={[
			{ id: 1, primary: "Reconcile invoices" },
			{ id: 2, primary: "Draft vendor replies" },
			{ id: 3, primary: "Classify clauses" },
		]}
	/>
);
export const tiles: Tile[] = [
	{
		name: "DropdownMenu",
		blurb: "Action menus with icons, shortcuts, checkbox and single-choice items.",
		render: () => (
			<div className="q-sb-tile-stack">
				<DropdownMenu
					open
					size="sm"
					width={180}
					label="Run actions"
					trigger={
						<Button size="sm" variant="secondary" rightIcon={<Icon name="chevron-down" />}>
							Run actions
						</Button>
					}
					items={[
						{ label: "Rerun", shortcut: "R" },
						{ label: "Duplicate", shortcut: "D" },
						{ label: "Cancel run", danger: true },
					]}
				/>
				{PAGE}
			</div>
		),
	},
	{
		name: "Popover",
		blurb: "A click-triggered floating panel for rich content: a share box, a quick edit.",
		render: () => (
			<div className="q-sb-tile-stack">
				<Popover
					open
					trapFocus={false}
					align="start"
					width={180}
					trigger={
						<Button size="sm" variant="secondary">
							Share
						</Button>
					}
					title="Share run"
				>
					<Text size="sm">Anyone in the workspace can open it for 7 days.</Text>
				</Popover>
				{PAGE}
			</div>
		),
	},
	{
		name: "Drawer",
		blurb: "A modal side sheet for details and reviews; prefer a pane when the screen has room.",
		render: () => (
			<Button size="sm" variant="secondary" leftIcon={<Icon name="sidebar" />}>
				Open run details
			</Button>
		),
	},
];
