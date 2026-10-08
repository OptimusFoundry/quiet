import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Text } from "../../index";
import { GuidePage, Mono, Part } from "./Guide";
import "./Layouts.scss";

// docs/guidelines/layouts.md as miniatures: the ten page layouts drawn from the real width tokens at
// 1/5 scale, each with when to choose it and what collapses under 720.

/** App frame at 1/5: sidebar 240 + main (padding 48/32 scaled). */
function App({ children, rail }: { children: ReactNode; rail?: boolean }) {
	return (
		<div
			className={
				rail === false ? "q-sb-layouts__app q-sb-layouts__app--no-rail" : "q-sb-layouts__app"
			}
		>
			{rail !== false && <div className="q-sb-layouts__fill q-sb-layouts__rail" />}
			<div className="q-sb-layouts__main">
				<div className="q-sb-layouts__topbar" />
				<div className="q-sb-layouts__body">{children}</div>
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
				<div className="q-sb-layouts__title" />
				<div className="q-sb-layouts__kpis">
					{[0, 1, 2, 3].map((i) => (
						<div key={i} className="q-sb-layouts__box q-sb-layouts__kpi" />
					))}
				</div>
				<div className="q-sb-layouts__dash-split">
					<div className="q-sb-layouts__box q-sb-layouts__chart" />
					<div className="q-sb-layouts__box q-sb-layouts__chart" />
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
				<div className="q-sb-layouts__list-detail">
					<div className="q-sb-layouts__rows">
						{[0, 1, 2, 3, 4].map((i) => (
							<div key={i} className="q-sb-layouts__fill q-sb-layouts__list-row" />
						))}
					</div>
					<div className="q-sb-layouts__rows">
						<div className="q-sb-layouts__title" />
						<div className="q-sb-layouts__box q-sb-layouts__detail" />
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
				<div className="q-sb-layouts__inspector-split">
					<div className="q-sb-layouts__rows q-sb-layouts__detail-col">
						<div className="q-sb-layouts__title" />
						<div className="q-sb-layouts__box q-sb-layouts__detail" />
					</div>
					<div className="q-sb-layouts__rows q-sb-layouts__pane q-sb-layouts__inspector">
						{[0, 1, 2].map((i) => (
							<div key={i} className="q-sb-layouts__fill q-sb-layouts__pane-row" />
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
				<div className="q-sb-layouts__title" />
				<div className="q-sb-layouts__toolbar">
					<div className="q-sb-layouts__fill q-sb-layouts__search" />
					<div className="q-sb-layouts__fill q-sb-layouts__filter" />
				</div>
				<div className="q-sb-layouts__box q-sb-layouts__table" />
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
				<div className="q-sb-layouts__title" />
				<div className="q-sb-layouts__form">
					{[0, 1, 2].map((i) => (
						<div key={i} className="q-sb-layouts__box q-sb-layouts__field" />
					))}
					<div className="q-sb-layouts__fill q-sb-layouts__submit" />
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
				<div className="q-sb-layouts__steps">
					{[0, 1, 2].map((i) => (
						<span
							key={i}
							className={
								i ? "q-sb-layouts__step" : "q-sb-layouts__step q-sb-layouts__step--current"
							}
						/>
					))}
				</div>
				<div className="q-sb-layouts__form">
					{[0, 1].map((i) => (
						<div key={i} className="q-sb-layouts__box q-sb-layouts__field" />
					))}
					<div className="q-sb-layouts__wizard-actions">
						<div className="q-sb-layouts__fill q-sb-layouts__wizard-button" />
						<span />
						<div
							className={
								"q-sb-layouts__fill q-sb-layouts__wizard-button q-sb-layouts__wizard-button--primary"
							}
						/>
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
				<div className="q-sb-layouts__settings-split">
					<div className="q-sb-layouts__rows">
						{[0, 1, 2, 3].map((i) => (
							<div key={i} className="q-sb-layouts__fill q-sb-layouts__nav-item" />
						))}
					</div>
					<div className="q-sb-layouts__rows q-sb-layouts__groups">
						{[0, 1].map((i) => (
							<div key={i} className="q-sb-layouts__rows">
								<div className="q-sb-layouts__title q-sb-layouts__group-title" />
								<div className="q-sb-layouts__rule q-sb-layouts__setting" />
								<div className="q-sb-layouts__rule q-sb-layouts__setting" />
							</div>
						))}
						<div className="q-sb-layouts__box q-sb-layouts__danger" />
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
				<div className="q-sb-layouts__chat-split">
					<div className="q-sb-layouts__rows q-sb-layouts__chat">
						<div className="q-sb-layouts__rows">
							<div className="q-sb-layouts__fill q-sb-layouts__bubble" />
							<div className="q-sb-layouts__fill q-sb-layouts__reply" />
						</div>
						<div className="q-sb-layouts__box q-sb-layouts__composer" />
					</div>
					<div className="q-sb-layouts__rows q-sb-layouts__pane q-sb-layouts__chat-pane">
						{[0, 1].map((i) => (
							<div key={i} className="q-sb-layouts__fill q-sb-layouts__pane-row" />
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
				<div className="q-sb-layouts__fill q-sb-layouts__shell-main" />
			</App>
		),
	},
	{
		name: "Marketing",
		when: "signed-out pages",
		dims: "NavBar · density marketing · sections 128 · gutter 32",
		collapse: "columns stack",
		art: (
			<div className="q-sb-layouts__site">
				<div className="q-sb-layouts__site-nav" />
				<div className="q-sb-layouts__title q-sb-layouts__site-hero" />
				<div className="q-sb-layouts__site-section">
					<div className="q-sb-layouts__title q-sb-layouts__site-heading" />
					<span />
					<div className="q-sb-layouts__fill q-sb-layouts__site-art" />
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
				<div className="q-sb-layouts__list">
					{LAYOUTS.map((l) => (
						<figure key={l.name} className="q-sb-layouts__figure">
							<div aria-hidden="true" className="q-sb-layouts__art">
								{l.art}
							</div>
							<figcaption className="q-sb-layouts__caption">
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
