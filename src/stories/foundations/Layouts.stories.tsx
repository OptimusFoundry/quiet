import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Text } from "../../index";
import { GuidePage, Part } from "./Guide";
import "./Layouts.scss";

// docs/guidelines/layouts.md as miniatures: the app shell and the page layouts drawn from the real
// width tokens at 1/5 scale, each with when to choose it and what collapses under 720.

/** The frame at 1/5: the canvas, the sidebar on it, the inset white panel and an optional third pane. */
function App({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
	return (
		<div className={aside ? "q-sb-layouts__app q-sb-layouts__app--aside" : "q-sb-layouts__app"}>
			<div className="q-sb-layouts__rows q-sb-layouts__sidebar">
				<div className="q-sb-layouts__fill q-sb-layouts__switcher" />
				{[0, 1, 2, 3].map((i) => (
					<div
						key={i}
						className={
							i
								? "q-sb-layouts__nav-item"
								: "q-sb-layouts__nav-item q-sb-layouts__nav-item--current"
						}
					/>
				))}
			</div>
			<div className="q-sb-layouts__panel">
				<div className="q-sb-layouts__topbar" />
				<div className="q-sb-layouts__body">{children}</div>
			</div>
			{aside && <div className="q-sb-layouts__panel q-sb-layouts__aside">{aside}</div>}
		</div>
	);
}

/** Rows of a pane or a list. */
function Rows({ n, className }: { n: number; className: string }) {
	return (
		<>
			{Array.from({ length: n }, (_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static miniature
				<div key={i} className={`q-sb-layouts__fill ${className}`} />
			))}
		</>
	);
}

type L = { name: string; when: string; dims: string; collapse: string; art: ReactNode };

const LAYOUTS: L[] = [
	{
		name: "App shell",
		when: "Every signed-in screen sits in it.",
		dims: "sidebar 240 on the canvas · inset panel · top bar 44 · third pane 360 pushes · max 1280",
		collapse:
			"sidebar becomes a drawer · panel flush · page sides 16 · pane is a full-screen sheet",
		art: (
			<App aside={<Rows n={3} className="q-sb-layouts__pane-row" />}>
				<div className="q-sb-layouts__title" />
				<div className="q-sb-layouts__fill q-sb-layouts__shell-main" />
			</App>
		),
	},
	{
		name: "Dashboard",
		when: "The user scans the state of something, then drills in.",
		dims: "4 × span 3 · then 8 + 4 · at most 2 rows below",
		collapse: "2 × 2 at 720–960 · stacks under 720",
		art: (
			<App>
				<div className="q-sb-layouts__title" />
				<div className="q-sb-layouts__kpis">
					<Rows n={4} className="q-sb-layouts__kpi" />
				</div>
				<div className="q-sb-layouts__dash-split">
					<Rows n={2} className="q-sb-layouts__chart" />
				</div>
			</App>
		),
	},
	{
		name: "List page",
		when: "The user finds one record among many.",
		dims: "toolbar of small controls · table ≤ 1280 · pagination",
		collapse: "filters fold into one button · table scrolls inside itself",
		art: (
			<App>
				<div className="q-sb-layouts__title" />
				<div className="q-sb-layouts__toolbar">
					<div className="q-sb-layouts__fill q-sb-layouts__search" />
					<div className="q-sb-layouts__fill q-sb-layouts__filter" />
				</div>
				<div className="q-sb-layouts__table">
					<Rows n={4} className="q-sb-layouts__table-row" />
				</div>
			</App>
		),
	},
	{
		name: "Detail page",
		when: "The user reads one record: properties, files, history.",
		dims: "main span 8 · rail span 4 · panels 32 apart",
		collapse: "rail drops below under 960 · one column under 720",
		art: (
			<App>
				<div className="q-sb-layouts__title" />
				<div className="q-sb-layouts__dash-split">
					<div className="q-sb-layouts__rows">
						<div className="q-sb-layouts__box q-sb-layouts__lead" />
						<div className="q-sb-layouts__fill q-sb-layouts__pane-row" />
					</div>
					<div className="q-sb-layouts__rows">
						<Rows n={2} className="q-sb-layouts__rail-panel" />
					</div>
				</div>
			</App>
		),
	},
	{
		name: "List-detail",
		when: "The user works through many records one at a time.",
		dims: "list 360 · detail fluid, content ≤ 1040 · edge to edge",
		collapse: "two routes under 720",
		art: (
			<App>
				<div className="q-sb-layouts__list-detail">
					<div className="q-sb-layouts__rows q-sb-layouts__list-pane">
						<Rows n={5} className="q-sb-layouts__list-row" />
					</div>
					<div className="q-sb-layouts__rows">
						<div className="q-sb-layouts__title" />
						<div className="q-sb-layouts__fill q-sb-layouts__detail" />
					</div>
				</div>
			</App>
		),
	},
	{
		name: "Detail + inspector",
		when: "The user edits one object while watching its properties or an agent.",
		dims: "content fluid · the third pane, 360, pushes the screen",
		collapse: "pane becomes a full-screen sheet under 720",
		art: (
			<App aside={<Rows n={3} className="q-sb-layouts__pane-row" />}>
				<div className="q-sb-layouts__title" />
				<div className="q-sb-layouts__fill q-sb-layouts__detail" />
			</App>
		),
	},
	{
		name: "Full-bleed table",
		when: "The user filters, sorts and acts on many rows.",
		dims: "table span 12, ≤ 1280 (not capped at 1040)",
		collapse: "table scrolls inside itself",
		art: (
			<App>
				<div className="q-sb-layouts__title" />
				<div className="q-sb-layouts__toolbar">
					<div className="q-sb-layouts__fill q-sb-layouts__search" />
					<div className="q-sb-layouts__fill q-sb-layouts__filter" />
				</div>
				<div className="q-sb-layouts__table q-sb-layouts__table--full">
					<Rows n={5} className="q-sb-layouts__table-row" />
				</div>
			</App>
		),
	},
	{
		name: "Form page",
		when: "The user creates or edits one thing, in at most 2 groups.",
		dims: "640 column, left-aligned · fields 24 · groups 32",
		collapse: "column goes full width",
		art: (
			<App>
				<div className="q-sb-layouts__title" />
				<div className="q-sb-layouts__form">
					<Rows n={3} className="q-sb-layouts__field" />
					<div className="q-sb-layouts__submit" />
				</div>
			</App>
		),
	},
	{
		name: "Wizard",
		when: "Later steps depend on earlier answers.",
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
					<Rows n={2} className="q-sb-layouts__field" />
					<div className="q-sb-layouts__wizard-actions">
						<div className="q-sb-layouts__fill q-sb-layouts__wizard-button" />
						<span />
						<div className="q-sb-layouts__wizard-button q-sb-layouts__wizard-button--primary" />
					</div>
				</div>
			</App>
		),
	},
	{
		name: "Settings",
		when: "There are more than 4 groups of preferences.",
		dims: "nav 200 sticky · form 640 · surface panels 48 apart",
		collapse: "nav becomes a Select above the form",
		art: (
			<App>
				<div className="q-sb-layouts__settings-split">
					<div className="q-sb-layouts__rows">
						<Rows n={4} className="q-sb-layouts__settings-nav" />
					</div>
					<div className="q-sb-layouts__rows q-sb-layouts__groups">
						<Rows n={2} className="q-sb-layouts__group" />
						<div className="q-sb-layouts__box q-sb-layouts__danger" />
					</div>
				</div>
			</App>
		),
	},
	{
		name: "Chat",
		when: "A conversation with an agent is the task.",
		dims: "640 column, edge to edge · optional third pane 360",
		collapse: "full width · pane becomes a full-screen sheet",
		art: (
			<App aside={<Rows n={2} className="q-sb-layouts__pane-row" />}>
				<div className="q-sb-layouts__rows q-sb-layouts__chat">
					<div className="q-sb-layouts__rows">
						<div className="q-sb-layouts__fill q-sb-layouts__bubble" />
						<div className="q-sb-layouts__reply" />
					</div>
					<div className="q-sb-layouts__box q-sb-layouts__composer" />
				</div>
			</App>
		),
	},
	{
		name: "Sign-in",
		when: "The user signs in, signs up or resets a password.",
		dims: "no app shell · canvas half with the product · inset panel, form ≤ 400",
		collapse: "the left shrinks to the lockup row · panel flush",
		art: (
			<div className="q-sb-layouts__signin">
				<div className="q-sb-layouts__rows q-sb-layouts__pitch">
					<div className="q-sb-layouts__lockup" />
					<div className="q-sb-layouts__box q-sb-layouts__glimpse" />
					<div className="q-sb-layouts__title" />
				</div>
				<div className="q-sb-layouts__panel q-sb-layouts__signin-panel">
					<div className="q-sb-layouts__form q-sb-layouts__signin-form">
						<div className="q-sb-layouts__title" />
						<div className="q-sb-layouts__box q-sb-layouts__field" />
						<div className="q-sb-layouts__box q-sb-layouts__field" />
						<div className="q-sb-layouts__submit q-sb-layouts__submit--wide" />
					</div>
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
			intro="Eleven page layouts in one app shell, drawn at 1/5 scale from the width tokens in comfortable density. Pick by what the user does there; never compose a new one."
		>
			<Part
				title="The shapes"
				rule="Each: when to choose it, its dimensions, and what collapses under 720."
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
								<Text size="sm">{l.when}</Text>
								<Text size="sm" color="muted">
									{l.dims}
								</Text>
								<Text size="sm" color="muted">
									Under 720: {l.collapse}
								</Text>
							</figcaption>
						</figure>
					))}
				</div>
			</Part>
		</GuidePage>
	);
}

const meta: Meta = { title: "Foundations/Layouts", parameters: { layout: "fullscreen" } };
export default meta;
export const Default: StoryObj = { render: () => <LayoutsPage /> };
