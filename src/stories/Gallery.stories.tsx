import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileText, Plus, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/Button/Button";
import { CommandBar } from "../components/CommandBar/CommandBar";
import { Input } from "../components/Input/Input";
import { Kbd } from "../components/Kbd/Kbd";
import { SegmentedControl } from "../components/SegmentedControl/SegmentedControl";
import { StatusDot } from "../components/StatusDot/StatusDot";
import { Switch } from "../components/Switch/Switch";
import styles from "./Primitives.module.scss";

// Liked posts each primitive draws from (see x-likes/design-dna.md).
const REFS: Record<string, [string, string][]> = {
	Button: [
		["Near-black pill CTA on white cards", "https://x.com/_heyrico/status/2070854186020040772"],
		["Pill squash on press", "https://x.com/ridd_design/status/2053497833551188034"],
	],
	Switch: [["Playful small micro-interactions", "https://x.com/yui540/status/2090674357286920688"]],
	StatusDot: [
		[
			"Agentic UI states as dots, not fills",
			"https://x.com/Jakubantalik/status/2092285372361519180",
		],
	],
	Input: [
		[
			"Prompt box with hairline + focus light",
			"https://x.com/markproduct/status/2017547665199010004",
		],
	],
	SegmentedControl: [
		["Sliding indicator nav pill", "https://x.com/LexnLin/status/2032212276447490106"],
	],
	CommandBar: [
		[
			"⌘K palette with sections, kbd chips, footer hints",
			"https://x.com/ozzyxs1a/status/2073449593681961261",
		],
		["Pill that morphs into a panel", "https://x.com/koppkev/status/2102013363484016814"],
	],
};

function Refs({ name }: { name: string }) {
	return (
		<ul className={styles.refs}>
			{(REFS[name] ?? []).map(([label, url]) => (
				<li key={url}>
					<a href={url} target="_blank" rel="noreferrer">
						{label} ↗
					</a>
				</li>
			))}
		</ul>
	);
}

function Gallery() {
	const [seg, setSeg] = useState("week");
	const [open, setOpen] = useState(true);
	return (
		<div className={styles.page}>
			<section className={styles.block}>
				<h2>Button</h2>
				<div className={styles.row}>
					<Button variant="primary" icon={<Plus />} kbd="N">
						New episode
					</Button>
					<Button variant="secondary">Cancel</Button>
					<Button variant="ghost">Skip</Button>
					<Button variant="primary" size="sm">
						Continue
					</Button>
				</div>
				<Refs name="Button" />
			</section>

			<section className={styles.block}>
				<h2>Switch</h2>
				<div className={styles.column}>
					<Switch label="Weekly digest" description="Email a summary every Monday" defaultChecked />
					<Switch label="Auto-publish" description="Post drafts when they pass review" />
				</div>
				<Refs name="Switch" />
			</section>

			<section className={styles.block}>
				<h2>StatusDot</h2>
				<div className={styles.row}>
					<StatusDot tone="success" pulse>
						Live
					</StatusDot>
					<StatusDot tone="warning">Scheduled</StatusDot>
					<StatusDot tone="danger">Failed</StatusDot>
					<StatusDot tone="neutral">Draft</StatusDot>
					<StatusDot tone="accent">Syncing</StatusDot>
				</div>
				<Refs name="StatusDot" />
			</section>

			<section className={styles.block}>
				<h2>Input · Kbd</h2>
				<div className={styles.row}>
					<Input icon={<Search />} placeholder="Search episodes" kbd="/" />
					<span className={styles.kbds}>
						<Kbd>⌘</Kbd>
						<Kbd>K</Kbd>
					</span>
				</div>
				<Refs name="Input" />
			</section>

			<section className={styles.block}>
				<h2>SegmentedControl</h2>
				<SegmentedControl
					label="Range"
					value={seg}
					onChange={setSeg}
					segments={[
						{ value: "day", label: "Day" },
						{ value: "week", label: "Week" },
						{ value: "month", label: "Month" },
						{ value: "year", label: "Year" },
					]}
				/>
				<Refs name="SegmentedControl" />
			</section>

			<section className={`${styles.block} ${styles.commandBlock}`}>
				<h2>CommandBar</h2>
				<Button variant="secondary" size="sm" onClick={() => setOpen((o) => !o)}>
					Toggle
				</Button>
				<Refs name="CommandBar" />
				<CommandBar
					open={open}
					onOpenChange={setOpen}
					activeId="b"
					query="new"
					sections={[
						{
							label: "Episodes",
							items: [
								{
									id: "a",
									icon: <FileText />,
									title: "The quiet launch",
									meta: "Live",
									kbd: "⌘1",
								},
							],
						},
						{
							label: "Quick actions",
							items: [
								{ id: "b", icon: <Plus />, title: "New episode", kbd: "N" },
								{
									id: "c",
									icon: <Sparkles />,
									title: "Draft show notes with AI",
									kbd: "⌘J",
								},
							],
						},
					]}
				/>
			</section>
		</div>
	);
}

const meta: Meta = {
	title: "Components/Gallery",
	parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

export const Gallery_: Story = { name: "Gallery", render: () => <Gallery /> };
