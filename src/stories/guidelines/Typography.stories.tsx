import type { Meta, StoryObj } from "@storybook/react-vite";
import { type CSSProperties, type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { PageHeader, Panel, StatCard, Text } from "../../index";
import { cssVar, type TokenName } from "../../styles/tokens.generated";
import { GuidePage, Mono, Part } from "./Guide";
import "./Typography.scss";

// docs/guidelines/typography.md as measured specimens: each app role rendered by the component
// that owns it, with its computed size / line height / weight read from the rendered text.

type Role = { role: string; how: string; target: string; node: ReactNode };

const ROLES: Role[] = [
	{
		role: "page-title",
		how: "PageHeader · h1 (h2 here)",
		target: ".q-page-header__title",
		node: <PageHeader as="h2" title="Campaigns" className="q-sb-typography__hero" />,
	},
	{
		role: "section-title",
		how: "Panel title · h2 (h3 here)",
		target: ".q-panel__title",
		node: <Panel variant="plain" as="h3" title="Recent signups" />,
	},
	{
		role: "card-title",
		how: 'Text size="lg" weight="semibold"',
		target: "[data-t]",
		node: (
			<Text as="h5" size="lg" weight="semibold" color="heading">
				<span data-t>Usage this month</span>
			</Text>
		),
	},
	{
		role: "metric",
		how: "StatCard value",
		target: ".q-stat-card__value",
		node: <StatCard label="MRR" value="$13.2k" variant="plain" />,
	},
	{
		role: "body-lg",
		how: 'PageHeader description · Text size="lg"',
		target: "[data-t]",
		node: (
			<Text size="lg">
				<span data-t>Meerkat drafts posts from your commits.</span>
			</Text>
		),
	},
	{
		role: "body",
		how: "Text (default)",
		target: "[data-t]",
		node: (
			<Text size="md">
				<span data-t>Signups stay saved and keep their place.</span>
			</Text>
		),
	},
	{
		role: "small",
		how: 'Text size="sm" · table cells',
		target: "[data-t]",
		node: (
			<Text size="sm" color="muted">
				<span data-t>Verified 2 hours ago by Ada Park</span>
			</Text>
		),
	},
	{
		role: "label",
		how: "PageHeader eyebrow · table headers",
		target: ".q-page-header__eyebrow",
		node: <PageHeader as="h2" eyebrow="Last deploy" title="Spring waitlist" />,
	},
];

function RoleRow({ r }: { r: Role }) {
	const box = useRef<HTMLDivElement>(null);
	const [m, setM] = useState("");
	useLayoutEffect(() => {
		const el = box.current?.querySelector<HTMLElement>(r.target);
		if (!el) return;
		const cs = getComputedStyle(el);
		const lh = cs.lineHeight === "normal" ? "normal" : Math.round(Number.parseFloat(cs.lineHeight));
		setM(`${Math.round(Number.parseFloat(cs.fontSize))} / ${lh} · ${cs.fontWeight}`);
	}, [r.target]);
	return (
		<div className="q-sb-typography__row">
			<div className="q-sb-typography__meta">
				<Text size="sm" color="heading" weight="semibold">
					{r.role}
				</Text>
				<Mono>{m}</Mono>
				<Text size="sm" color="muted">
					<code>{r.how}</code>
				</Text>
			</div>
			<div ref={box} className="q-sb-typography__specimen">
				{r.node}
			</div>
		</div>
	);
}

const SCALE = [
	"--q-text-2xs",
	"--q-text-sm",
	"--q-text-md",
	"--q-text-lg",
	"--q-text-2xl",
	"--q-text-4xl",
] as const satisfies readonly TokenName[];

function TypographyPage() {
	return (
		<GuidePage
			title="Typography"
			doc="typography.md"
			intro="Eight roles, six sizes. Each role comes from a component prop. The numbers are read from the rendered text."
		>
			<Part
				title="Roles"
				rule="Size / line height · weight, measured. Level follows the outline; size follows the role."
			>
				<div data-density="app">
					{ROLES.map((r) => (
						<RoleRow key={r.role} r={r} />
					))}
				</div>
			</Part>
			<Part
				title="The six app sizes"
				rule="11 · 13 · 15 · 17 · 24 · 40. 12 is in-component chrome; 19, 30, 52, 68 and display are marketing."
			>
				<div className="q-sb-typography__sizes">
					{SCALE.map((t) => (
						<div key={t} className="q-sb-typography__size">
							<span
								className="q-sb-typography__sample"
								style={{ "--_size": cssVar(t) } as CSSProperties}
							>
								Ag
							</span>
							<Mono>{t}</Mono>
						</div>
					))}
				</div>
			</Part>
			<Part
				title="Hierarchy on one screen"
				rule="One 40, then 24 per section, 17 per panel. Never two equal headings stacked."
			>
				<div data-density="app" className="q-sb-typography__hierarchy">
					<PageHeader
						as="h2"
						eyebrow="Workspace"
						title="Billing"
						description="Plan, usage and invoices."
						className="q-sb-typography__hero"
					/>
					<div className="q-sb-typography__section">
						<Panel variant="plain" as="h3" title="Usage" />
						<div className="q-sb-typography__stack">
							<Text as="h5" size="lg" weight="semibold" color="heading">
								Meerkat
							</Text>
							<Text size="sm" color="muted">
								$6.98 of $8.00 cap · resets Oct 31
							</Text>
						</div>
					</div>
				</div>
			</Part>
		</GuidePage>
	);
}

const meta: Meta = { title: "Guidelines/Typography", parameters: { layout: "fullscreen" } };
export default meta;
export const Default: StoryObj = { render: () => <TypographyPage /> };
