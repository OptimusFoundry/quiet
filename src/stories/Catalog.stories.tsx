import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileText, Plus, Search, Settings } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Badge } from "../components/Badge/Badge";
import { Button } from "../components/Button/Button";
import { CommandBar } from "../components/CommandBar/CommandBar";
import { Eyebrow } from "../components/Eyebrow/Eyebrow";
import { Headline } from "../components/Headline/Headline";
import { Input } from "../components/Input/Input";
import { Kbd } from "../components/Kbd/Kbd";
import { SegmentedControl } from "../components/SegmentedControl/SegmentedControl";
import { Spinner } from "../components/Spinner/Spinner";
import { StatusDot } from "../components/StatusDot/StatusDot";
import { Switch } from "../components/Switch/Switch";
import { type Column, Table } from "../components/Table/Table";
import { Tag } from "../components/Tag/Tag";
import styles from "./Catalog.module.scss";

// Same groups and order as the Optimus Foundry catalogue; only ported components are listed.
const GROUPS: [string, string[]][] = [
	["Core", ["Button", "Eyebrow", "Headline", "Tag", "Badge", "StatusDot", "Spinner", "Kbd"]],
	["Forms", ["Input", "Switch"]],
	["Navigation", ["SegmentedControl", "CommandBar"]],
	["Data", ["Table"]],
];
const NUMBER = new Map(
	GROUPS.flatMap(([, items]) => items).map((n, i) => [n, String(i + 1).padStart(2, "0")]),
);

function Sidebar() {
	return (
		<nav className={styles.sidebar} aria-label="Components">
			<div className={styles.wordmark}>
				quiet
				<span className={styles.mono}>Components · v0.2</span>
			</div>
			{GROUPS.map(([group, items]) => (
				<div key={group}>
					<h2 className={styles.groupName}>{group}</h2>
					<ul className={styles.group}>
						{items.map((name) => (
							<li key={name}>
								<a className={styles.navLink} href={`#${name.toLowerCase()}`}>
									<span className={styles.navIndex}>{NUMBER.get(name)}</span>
									{name}
								</a>
							</li>
						))}
					</ul>
				</div>
			))}
		</nav>
	);
}

function Block({ name, file, children }: { name: string; file: string; children: ReactNode }) {
	return (
		<section id={name.toLowerCase()} className={styles.block} aria-labelledby={`h-${name}`}>
			<div className={styles.blockHead}>
				<div className={styles.blockTitle}>
					<span className={styles.mono}>{NUMBER.get(name)}</span>
					<h2 id={`h-${name}`}>
						{name}
						<span className={styles.period}>.</span>
					</h2>
				</div>
				<code className={styles.mono}>{file}</code>
			</div>
			{children}
		</section>
	);
}

function Spec({ label, col, children }: { label: string; col?: boolean; children: ReactNode }) {
	return (
		<div className={styles.spec} data-col={col || undefined}>
			<div className={styles.specLabel}>{label}</div>
			<div className={styles.specBody}>{children}</div>
		</div>
	);
}

const ROWS = [
	{ id: "1", name: "Anvil", client: "In-house", status: "live" as const, amount: 24000 },
	{ id: "2", name: "Bellows", client: "Northwind", status: "prototype" as const, amount: 18500 },
	{ id: "3", name: "Cinder", client: "Halcyon", status: "archived" as const, amount: 9200 },
];

const COLUMNS: Column<(typeof ROWS)[number]>[] = [
	{ key: "name", header: "Piece", render: (r) => r.name },
	{ key: "client", header: "Client", render: (r) => r.client },
	{ key: "status", header: "Status", render: (r) => <StatusDot status={r.status} /> },
	{
		key: "amount",
		header: "Amount",
		align: "end",
		numeric: true,
		render: (r) => `$${r.amount.toLocaleString("en-US")}`,
	},
];

function Catalog() {
	const [range, setRange] = useState("week");
	const [view, setView] = useState("list");
	const [paletteOpen, setPaletteOpen] = useState(true);
	return (
		<div className={styles.page}>
			<Sidebar />
			<main className={styles.main}>
				<div className={styles.intro}>
					<Eyebrow index="00">Design system</Eyebrow>
					<Headline size="display" lead="Thirteen" accent="parts" />
					<p className={styles.lede}>
						Every ported primitive, in every state. Soft rounded containers, full pills, 1px
						hairlines, one accent per surface.
					</p>
				</div>

				<Block name="Button" file="core/Button.tsx">
					<Spec label="Variants">
						<Button arrow>Start a project</Button>
						<Button variant="secondary">Commission a piece</Button>
						<Button variant="ghost" arrow>
							See the work
						</Button>
					</Spec>
					<Spec label="Sizes">
						<Button size="sm">Small</Button>
						<Button size="md">Medium</Button>
						<Button size="lg" arrow>
							Large
						</Button>
					</Spec>
					<Spec label="Disabled">
						<Button disabled>Primary</Button>
						<Button variant="secondary" disabled>
							Secondary
						</Button>
					</Spec>
					<Spec label="More">
						<Button variant="outline">Outline</Button>
						<Button variant="destructive">Delete project</Button>
						<Button loading>Saving</Button>
						<Button variant="outline" icon={<Plus />} aria-label="Add" />
						<Button variant="secondary" leftIcon={<Plus />} kbd="N">
							New piece
						</Button>
					</Spec>
					<Spec label="Full width" col>
						<Button fullWidth arrow>
							Start a project
						</Button>
					</Spec>
				</Block>

				<Block name="Eyebrow" file="core/Eyebrow.tsx">
					<Spec label="Indexed">
						<Eyebrow index="01">The studio</Eyebrow>
						<Eyebrow index="04">How we work</Eyebrow>
					</Spec>
					<Spec label="Plain · ink">
						<Eyebrow>Studio archive · 2024–2026</Eyebrow>
						<Eyebrow tone="ink">Identity v1.0 · MMXXVI</Eyebrow>
					</Spec>
				</Block>

				<Block name="Headline" file="core/Headline.tsx">
					<Spec label="Display" col>
						<Headline
							size="display"
							as="h3"
							className={styles.display72}
							lead="Software,"
							accent="crafted in"
							after="precision"
						/>
					</Spec>
					<Spec label="H2" col>
						<Headline size="h2" as="h3" lead="Heavy software," accent="quietly made" />
					</Spec>
					<Spec label="H3" col>
						<Headline size="h3" lead="Products people" accent="pay for" />
					</Spec>
					<Spec label="H4" col>
						<Headline size="h4" lead="Temper" />
					</Spec>
					<Spec label="Tinted accent" col>
						<Headline
							size="h3"
							lead="One mark, one sans,"
							accent="one accent"
							tintAccent
							period={false}
						/>
					</Spec>
				</Block>

				<Block name="Tag" file="core/Tag.tsx">
					<Spec label="Default">
						{["TypeScript", "React", "Postgres", "Edge"].map((t) => (
							<Tag key={t}>{t}</Tag>
						))}
					</Spec>
					<Spec label="Ink · small">
						<Tag tone="ink">Swift</Tag>
						<Tag tone="ink">SwiftUI</Tag>
						<Tag size="sm">Small</Tag>
					</Spec>
					<Spec label="Selectable">
						<Tag selectable defaultSelected>
							iOS
						</Tag>
						<Tag selectable>Web</Tag>
						<Tag selectable disabled>
							Watch
						</Tag>
					</Spec>
					<Spec label="Removable">
						<Tag onRemove={() => {}}>Go</Tag>
						<Tag tone="ink" onRemove={() => {}}>
							Kafka
						</Tag>
					</Spec>
				</Block>

				<Block name="Badge" file="core/Badge.tsx">
					<Spec label="Variants">
						<Badge>Default</Badge>
						<Badge variant="primary">Primary</Badge>
						<Badge variant="secondary">Secondary</Badge>
						<Badge variant="outline">Outline</Badge>
					</Spec>
					<Spec label="Status">
						<Badge variant="success">Shipped</Badge>
						<Badge variant="warning">Due soon</Badge>
						<Badge variant="error">Failed</Badge>
					</Spec>
					<Spec label="Counts · sizes">
						<Badge count={3} />
						<Badge variant="primary" count={128} />
						<Badge size="sm">Small</Badge>
						<Badge size="lg">Large</Badge>
					</Spec>
				</Block>

				<Block name="StatusDot" file="core/StatusDot.tsx">
					<Spec label="Status">
						<StatusDot status="live" />
						<StatusDot status="prototype" />
						<StatusDot status="archived" />
					</Spec>
					<Spec label="Custom label">
						<StatusDot status="live" label="Sjocamp · Live" />
						<StatusDot status="prototype" label="Meerkat · Prototype" />
					</Spec>
				</Block>

				<Block name="Spinner" file="core/Spinner.tsx">
					<Spec label="Sizes">
						<Spinner size="xs" />
						<Spinner size="sm" />
						<Spinner size="md" />
						<Spinner size="lg" />
					</Spec>
					<Spec label="Labelled">
						<Spinner size="sm" label="Casting" />
						<Spinner size="sm" tone="accent" label="Heating" />
					</Spec>
				</Block>

				<Block name="Kbd" file="core/Kbd.tsx">
					<Spec label="Keys">
						<Kbd>⌘</Kbd>
						<Kbd>K</Kbd>
						<Kbd>esc</Kbd>
						<Button kbd="⌘↵">Send</Button>
					</Spec>
				</Block>

				<Block name="Input" file="forms/Input.tsx">
					<Spec label="States" col>
						<div className={styles.fields}>
							<Input label="Email" placeholder="you@studio.com" />
							<Input
								label="With hint"
								placeholder="Acme Inc."
								hint="As it appears on the invoice"
							/>
							<Input label="Error" defaultValue="Under 10k" error="We start at 25k." />
						</div>
					</Spec>
					<Spec label="Sizes" col>
						<div className={styles.fields}>
							<Input size="sm" aria-label="Small field" placeholder="Small · 36" />
							<Input size="md" aria-label="Medium field" placeholder="Medium · 48" />
							<Input size="lg" aria-label="Large field" placeholder="Large · 56" />
						</div>
					</Spec>
					<Spec label="Search" col>
						<div className={styles.narrow}>
							<Input
								aria-label="Search pieces"
								icon={<Search />}
								placeholder="Search pieces"
								kbd="/"
							/>
						</div>
					</Spec>
				</Block>

				<Block name="Switch" file="forms/Switch.tsx">
					<Spec label="States">
						<Switch label="Off" />
						<Switch label="On" defaultChecked />
						<Switch label="Disabled" disabled />
						<Switch size="sm" label="Small" />
						<Switch size="lg" label="Large" />
					</Spec>
					<Spec label="Settings row" col>
						<div className={styles.narrow}>
							<Switch
								label="Weekly digest"
								description="One email, Fridays."
								labelPosition="left"
							/>
						</div>
					</Spec>
				</Block>

				<Block name="SegmentedControl" file="navigation/SegmentedControl.tsx">
					<Spec label="Small">
						<SegmentedControl
							size="sm"
							label="View"
							value={view}
							onChange={setView}
							segments={[
								{ value: "list", label: "List" },
								{ value: "board", label: "Board" },
								{ value: "table", label: "Table" },
							]}
						/>
					</Spec>
					<Spec label="Medium">
						<SegmentedControl
							label="Range"
							value={range}
							onChange={setRange}
							segments={[
								{ value: "day", label: "Day" },
								{ value: "week", label: "Week" },
								{ value: "month", label: "Month" },
								{ value: "year", label: "Year", count: 12 },
							]}
						/>
					</Spec>
				</Block>

				<Block name="CommandBar" file="navigation/CommandBar.tsx">
					<Spec label="Pill → palette" col>
						<div>
							<Button variant="outline" size="sm" onClick={() => setPaletteOpen((o) => !o)}>
								Toggle
							</Button>
						</div>
						<div className={styles.commandStage}>
							<CommandBar
								open={paletteOpen}
								onOpenChange={setPaletteOpen}
								activeId="new"
								query="new"
								sections={[
									{
										label: "Pieces",
										items: [
											{ id: "anvil", icon: <FileText />, title: "Anvil", meta: "Live", kbd: "⌘1" },
										],
									},
									{
										label: "Actions",
										items: [
											{ id: "new", icon: <Plus />, title: "New piece", kbd: "N" },
											{ id: "settings", icon: <Settings />, title: "Studio settings", kbd: "⌘," },
										],
									},
								]}
							/>
						</div>
					</Spec>
				</Block>

				<Block name="Table" file="data/Table.tsx">
					<Spec label="Small · compact" col>
						<Table size="sm" rows={ROWS} rowKey={(r) => r.id} columns={COLUMNS} />
					</Spec>
					<Spec label="Medium" col>
						<Table
							rows={ROWS}
							rowKey={(r) => r.id}
							columns={COLUMNS}
							actions={(r) => (
								<Button variant="ghost" size="sm" arrow aria-label={`Open ${r.name}`}>
									Open
								</Button>
							)}
						/>
					</Spec>
				</Block>
			</main>
		</div>
	);
}

const meta: Meta = { title: "Catalog", component: Catalog };
export default meta;
export const Components: StoryObj = {};
