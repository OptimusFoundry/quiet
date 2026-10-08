import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties, ReactNode } from "react";
import { Text } from "../../index";
import { GuidePage, Mono, Part } from "./Guide";

// docs/guidelines/layouts.md as miniatures: the ten page layouts drawn from the real width tokens at
// 1/5 scale, each with when to choose it and what collapses under 720.

const k = 0.2; // scale
const w = (token: string) => `calc(var(${token}) * ${k})`;

const box = (extra?: CSSProperties): CSSProperties => ({
	border: "var(--q-hairline) solid var(--q-border-strong)",
	borderRadius: "var(--q-radius-xs)",
	background: "var(--q-bg)",
	minWidth: 0,
	minHeight: "var(--q-space-1)",
	...extra,
});
const fill = (extra?: CSSProperties): CSSProperties => ({
	background: "var(--q-bg-subtle)",
	borderRadius: "var(--q-radius-2xs)",
	minWidth: 0,
	minHeight: "var(--q-space-1)",
	...extra,
});
const title: CSSProperties = {
	height: "var(--q-space-1)",
	width: "40%",
	background: "var(--q-fg)",
	borderRadius: 2,
};
const cols = (t: string, gap = "var(--q-space-0-5)"): CSSProperties => ({
	display: "grid",
	gridTemplateColumns: t,
	gap,
});
const rows = (gap = "var(--q-space-0-5)"): CSSProperties => ({
	display: "grid",
	gap,
	alignContent: "start",
});

/** App frame at 1/5: sidebar 240 + main (padding 48/32 scaled). */
function App({ children, rail }: { children: ReactNode; rail?: boolean }) {
	return (
		<div
			style={{
				...cols(rail === false ? "minmax(0,1fr)" : `${w("--q-w-sidebar")} minmax(0,1fr)`, "0"),
				...box(),
				height: 128,
				overflow: "hidden",
			}}
		>
			{rail !== false && <div style={fill({ borderRadius: 0 })} />}
			<div style={{ ...rows("0"), gridTemplateRows: `${w("--q-h-topbar")} 1fr`, minWidth: 0 }}>
				<div style={{ borderBottom: "var(--q-hairline) solid var(--q-border)" }} />
				<div
					style={{
						...rows("var(--q-space-0-75)"),
						padding: `${w("--q-space-6")} ${w("--q-space-4")}`,
					}}
				>
					{children}
				</div>
			</div>
		</div>
	);
}

type L = { name: string; when: string; dims: string; collapse: string; art: ReactNode };

const LAYOUTS: L[] = [
	{
		name: "Dashboard",
		when: "scan state, then drill in",
		dims: "4 × span 3 · then 8 + 4 · max 2 rows below",
		collapse: "2 × 2 at 720–960 · stacks under 720",
		art: (
			<App>
				<div style={title} />
				<div style={cols("repeat(4, minmax(0,1fr))")}>
					{[0, 1, 2, 3].map((i) => (
						<div key={i} style={box({ height: 14 })} />
					))}
				</div>
				<div style={cols("2fr 1fr")}>
					<div style={box({ height: 34 })} />
					<div style={box({ height: 34 })} />
				</div>
			</App>
		),
	},
	{
		name: "List-detail",
		when: "work records one at a time",
		dims: "list 360 · detail fluid, content ≤ 1040",
		collapse: "two routes under 720",
		art: (
			<App>
				<div
					style={{
						...cols(`${w("--q-w-list-pane")} minmax(0,1fr)`, "var(--q-space-1)"),
						height: 80,
					}}
				>
					<div style={rows()}>
						{[0, 1, 2, 3, 4].map((i) => (
							<div key={i} style={fill({ height: 10 })} />
						))}
					</div>
					<div style={rows()}>
						<div style={title} />
						<div style={box({ height: 50 })} />
					</div>
				</div>
			</App>
		),
	},
	{
		name: "Detail + inspector",
		when: "stay on one object, tools at the side",
		dims: "content fluid · panel 400, hairline left",
		collapse: "panel → Drawer under 720",
		art: (
			<App>
				<div style={{ ...cols(`minmax(0,1fr) ${w("--q-w-detail-panel")}`, "0"), height: 80 }}>
					<div style={{ ...rows(), paddingRight: "var(--q-space-1)" }}>
						<div style={title} />
						<div style={box({ height: 50 })} />
					</div>
					<div
						style={{
							...rows(),
							borderLeft: "var(--q-hairline) solid var(--q-border)",
							paddingLeft: "var(--q-space-0-75)",
						}}
					>
						{[0, 1, 2].map((i) => (
							<div key={i} style={fill({ height: 12 })} />
						))}
					</div>
				</div>
			</App>
		),
	},
	{
		name: "Full-bleed table",
		when: "filter, sort and act on many rows",
		dims: "table span 12, ≤ 1280 (not capped at 1040)",
		collapse: "table scrolls inside itself",
		art: (
			<App>
				<div style={title} />
				<div style={cols("1fr auto")}>
					<div style={fill({ height: 8, width: "50%" })} />
					<div style={fill({ height: 8, width: 24 })} />
				</div>
				<div style={box({ height: 52 })} />
			</App>
		),
	},
	{
		name: "Form page",
		when: "create or edit one thing, ≤ 2 groups",
		dims: "640 column, left-aligned · fields 24 · groups 32",
		collapse: "column goes full width",
		art: (
			<App>
				<div style={title} />
				<div style={{ ...rows("var(--q-space-0-75)"), width: w("--q-w-form") }}>
					{[0, 1, 2].map((i) => (
						<div key={i} style={box({ height: 9 })} />
					))}
					<div
						style={{
							...fill({ height: 9, width: 30, background: "var(--q-fg)" }),
							justifySelf: "end",
						}}
					/>
				</div>
			</App>
		),
	},
	{
		name: "Wizard",
		when: "steps whose answers depend on earlier ones",
		dims: "StepIndicator · 640 step body · Back left, Next right",
		collapse: "vertical StepIndicator, full width",
		art: (
			<App>
				<div style={{ display: "flex", gap: 4, alignItems: "center" }}>
					{[0, 1, 2].map((i) => (
						<span
							key={i}
							style={{
								width: 8,
								height: 8,
								borderRadius: 8,
								background: i ? "var(--q-border)" : "var(--q-fg)",
							}}
						/>
					))}
				</div>
				<div style={{ ...rows("var(--q-space-0-75)"), width: w("--q-w-form") }}>
					{[0, 1].map((i) => (
						<div key={i} style={box({ height: 9 })} />
					))}
					<div style={cols("auto 1fr auto")}>
						<div style={fill({ height: 9, width: 24 })} />
						<span />
						<div style={fill({ height: 9, width: 24, background: "var(--q-fg)" })} />
					</div>
				</div>
			</App>
		),
	},
	{
		name: "Settings",
		when: "> 4 groups of preferences",
		dims: "nav 200 sticky · form 640 · sections 48 apart",
		collapse: "nav → Select above the form",
		art: (
			<App>
				<div
					style={{
						...cols(`${w("--q-w-settings-nav")} ${w("--q-w-form")}`, "var(--q-space-1)"),
						height: 80,
					}}
				>
					<div style={rows()}>
						{[0, 1, 2, 3].map((i) => (
							<div key={i} style={fill({ height: 7 })} />
						))}
					</div>
					<div style={rows("var(--q-space-1)")}>
						{[0, 1].map((i) => (
							<div key={i} style={rows()}>
								<div style={{ ...title, width: "30%", height: 5 }} />
								<div style={{ borderTop: "var(--q-hairline) solid var(--q-border)", height: 8 }} />
								<div style={{ borderTop: "var(--q-hairline) solid var(--q-border)", height: 8 }} />
							</div>
						))}
						<div style={box({ height: 10, borderColor: "var(--q-accent)" })} />
					</div>
				</div>
			</App>
		),
	},
	{
		name: "Chat",
		when: "a conversation is the task",
		dims: "640 column · optional 400 panel",
		collapse: "full width · panel → drawer",
		art: (
			<App>
				<div
					style={{
						...cols(`${w("--q-w-form")} ${w("--q-w-detail-panel")}`, "var(--q-space-1)"),
						height: 80,
					}}
				>
					<div style={{ ...rows("var(--q-space-0-75)"), gridTemplateRows: "1fr auto" }}>
						<div style={rows()}>
							<div style={{ ...fill({ height: 9, width: "50%" }), justifySelf: "end" }} />
							<div
								style={fill({
									height: 16,
									background: "transparent",
									borderLeft: "2px solid var(--q-border)",
								})}
							/>
						</div>
						<div style={box({ height: 14, borderRadius: 6 })} />
					</div>
					<div
						style={{
							...rows(),
							borderLeft: "var(--q-hairline) solid var(--q-border)",
							paddingLeft: 4,
						}}
					>
						{[0, 1].map((i) => (
							<div key={i} style={fill({ height: 12 })} />
						))}
					</div>
				</div>
			</App>
		),
	},
	{
		name: "App shell",
		when: "every signed-in screen",
		dims: "sidebar 240 · top bar 64 · main pad 48 / 32 · max 1280",
		collapse: "sidebar → drawer · page-x 16",
		art: (
			<App>
				<div style={fill({ height: 70 })} />
			</App>
		),
	},
	{
		name: "Marketing",
		when: "signed-out pages",
		dims: "NavBar · density marketing · sections 128 · gutter 32",
		collapse: "columns stack",
		art: (
			<div
				style={{
					...rows("var(--q-space-1)"),
					...box(),
					height: 128,
					padding: 8,
					boxSizing: "border-box",
					overflow: "hidden",
				}}
			>
				<div style={{ borderBottom: "var(--q-hairline) solid var(--q-border)", height: 10 }} />
				<div style={{ ...title, height: 18, width: "60%" }} />
				<div
					style={{
						borderTop: "var(--q-hairline) solid var(--q-fg)",
						...cols("5fr 1fr 6fr"),
						paddingTop: 6,
					}}
				>
					<div style={{ ...title, width: "70%", height: 8 }} />
					<span />
					<div style={fill({ height: 24 })} />
				</div>
			</div>
		),
	},
];

function LayoutsPage() {
	return (
		<GuidePage
			title="Layouts"
			doc="layouts.md"
			intro="Ten layouts, drawn at 1/5 scale from the width tokens. Pick by what the user does. Never compose a new one."
		>
			<Part
				title="The ten"
				rule="Each: when to choose it, its dimensions, what collapses under 720."
			>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))",
						gap: "var(--q-space-4) var(--q-space-3)",
					}}
				>
					{LAYOUTS.map((l) => (
						<figure
							key={l.name}
							style={{ margin: 0, display: "grid", gap: "var(--q-space-1)", minWidth: 0 }}
						>
							<div aria-hidden="true" style={{ overflow: "hidden" }}>
								{l.art}
							</div>
							<figcaption style={{ display: "grid", gap: "var(--q-space-0-5)" }}>
								<Text as="h3" size="md" weight="semibold" color="heading">
									{l.name}
								</Text>
								<Text size="sm">Choose to {l.when}.</Text>
								<Mono>{l.dims}</Mono>
								<Mono>&lt; 720: {l.collapse}</Mono>
							</figcaption>
						</figure>
					))}
				</div>
			</Part>
		</GuidePage>
	);
}

const meta: Meta = { title: "Guidelines/Layouts", parameters: { layout: "fullscreen" } };
export default meta;
export const Default: StoryObj = { render: () => <LayoutsPage /> };
