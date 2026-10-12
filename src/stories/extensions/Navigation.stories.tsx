import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useState } from "react";
import {
	Breadcrumb,
	Button,
	CommandPalette,
	type CommandPaletteItem,
	Icon,
	Pagination,
	StepIndicator,
	Tabs,
} from "../../index";
import "./Navigation.scss";

// The navigation group in the one look: segmented tabs by default, arabic step numbers, stroke
// icons for every arrow, sans sentence-case labels.
const meta: Meta = { title: "Extensions/Navigation", parameters: { layout: "fullscreen" } };
export default meta;

function Section({ title, children }: { title: string; children: ReactNode }) {
	return (
		<section className="q-sb-navigation__section">
			<h2 className="q-sb-navigation__title">{title}</h2>
			{children}
		</section>
	);
}

const TABS = [
	{ value: "runs", label: "Runs", count: 12 },
	{ value: "drafts", label: "Drafts" },
	{ value: "settings", label: "Settings" },
	{ value: "audit", label: "Audit log", disabled: true },
];

export const Overview: StoryObj = {
	render: () => (
		<div className="q-sb-navigation">
			<Section title="Tabs (default: segmented)">
				<Tabs label="Project" tabs={TABS} />
				<Tabs label="Project, small" size="sm" tabs={TABS} />
			</Section>
			<Section title="Tabs, line and pill">
				<div className="q-sb-navigation__full">
					<Tabs label="Project, line" variant="line" tabs={TABS} />
				</div>
				<Tabs label="Project, pill" variant="pill" tabs={TABS} />
			</Section>
			<Section title="Breadcrumb">
				<Breadcrumb
					items={[
						{ label: "Workspace", href: "#" },
						{ label: "Projects", href: "#" },
						{ label: "Meerkat", href: "#" },
						{ label: "Runners", href: "#" },
						{ label: "Nightly export" },
					]}
					maxItems={3}
				/>
			</Section>
			<Section title="Pagination">
				<Pagination total={24} defaultPage={7} />
				<Pagination total={8} defaultPage={2} variant="ghost" size="sm" showFirstLast={false} />
			</Section>
			<Section title="StepIndicator">
				<div className="q-sb-navigation__full">
					<StepIndicator
						label="Set up"
						current={2}
						steps={[
							{ label: "Connect", description: "GitHub" },
							{ label: "Configure" },
							{ label: "Review" },
							{ label: "Launch" },
						]}
					/>
				</div>
				<StepIndicator
					label="Import"
					orientation="vertical"
					size="sm"
					current={1}
					steps={[
						{ label: "Upload" },
						{ label: "Map columns", status: "error", description: "Two columns unmatched" },
						{ label: "Import" },
					]}
				/>
			</Section>
		</div>
	),
};

const COMMANDS: CommandPaletteItem[] = [
	{ label: "New run", group: "Actions", icon: <Icon name="plus" />, shortcut: "N" },
	{ label: "Invite people", group: "Actions", icon: <Icon name="users" /> },
	{ label: "Runs", group: "Go to", icon: <Icon name="runs" />, description: "All runs in Meerkat" },
	{ label: "Billing", group: "Go to", icon: <Icon name="billing" /> },
	{ label: "Settings", group: "Go to", icon: <Icon name="settings" />, shortcut: "G S" },
];

function PaletteDemo() {
	const [open, setOpen] = useState(true);
	return (
		<div className="q-sb-navigation">
			<Button variant="secondary" onClick={() => setOpen(true)}>
				Open palette
			</Button>
			<CommandPalette
				open={open}
				onOpen={() => setOpen(true)}
				onClose={() => setOpen(false)}
				items={COMMANDS}
			/>
		</div>
	);
}

export const Palette: StoryObj = { render: () => <PaletteDemo /> };
