import type { Meta, StoryObj } from "@storybook/react-vite";
import { type CSSProperties, type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { PageHeader, Panel, StatCard, Text } from "../../index";
import { cssVar, type TokenName } from "../../styles/tokens.generated";
import { GuidePage, Mono, Num, Part, stage, useVar } from "./Guide";
import "./Typography.scss";

// docs/guidelines/typography.md as measured specimens: each screen role rendered by the component
// that owns it, with its computed size / line height / weight read from the rendered text.

type Role = { role: string; how: string; target: string; node: ReactNode };

const ROLES: Role[] = [
	{
		role: "Page title",
		how: "PageHeader · h1 (h2 here)",
		target: ".q-page-header__title",
		node: <PageHeader as="h2" title="Campaigns" />,
	},
	{
		role: "Section title",
		how: "Panel title · h2 (h3 here)",
		target: ".q-panel__title",
		node: <Panel variant="plain" as="h3" title="Recent signups" />,
	},
	{
		role: "Card title",
		how: 'Text as="h3" size="md" weight="semibold" color="heading"',
		target: "[data-t]",
		node: (
			<Text as="h4" size="md" weight="semibold" color="heading">
				<span data-t>Usage this month</span>
			</Text>
		),
	},
	{
		role: "Metric",
		how: "StatCard value",
		target: ".q-stat-card__value",
		node: <StatCard label="MRR" value="$13.2k" variant="plain" />,
	},
	{
		role: "Intro",
		how: "PageHeader description",
		target: ".q-page-header__description",
		node: (
			<PageHeader as="h2" title="Meerkat" description="Meerkat drafts posts from your commits." />
		),
	},
	{
		role: "Body",
		how: "Text (default) · inputs, lists, menus",
		target: "[data-t]",
		node: (
			<Text size="md">
				<span data-t>Signups stay saved and keep their place.</span>
			</Text>
		),
	},
	{
		role: "Small",
		how: 'Text size="sm" · table cells, help',
		target: "[data-t]",
		node: (
			<Text size="sm" color="muted">
				<span data-t>Verified 2 hours ago by Ada Park</span>
			</Text>
		),
	},
	{
		role: "Label",
		how: "Label · table headers, tabs, StatCard label",
		target: ".q-stat-card__label",
		node: <StatCard label="Verified signups" value="4,812" variant="plain" />,
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
				<Text size="md" color="heading" weight="semibold">
					{r.role}
				</Text>
				<Text size="sm" color="muted">
					<Num>{m}</Num>
				</Text>
				<Mono className="q-sb-typography__how">{r.how}</Mono>
			</div>
			<div ref={box} className="q-sb-typography__specimen">
				{r.node}
			</div>
		</div>
	);
}

/** The six sizes a screen uses: 11 · 12 · 14 · 17 · 20 · 24. */
const SCALE = [
	"--q-text-xs",
	"--q-text-sm",
	"--q-text-md",
	"--q-text-xl",
	"--q-text-2xl",
	"--q-text-3xl",
] as const satisfies readonly TokenName[];

function Size({ token }: { token: TokenName }) {
	const ref = useRef<HTMLSpanElement>(null);
	const px = Number.parseFloat(useVar(ref, token)) || 0;
	return (
		<div className="q-sb-typography__size">
			<span
				ref={ref}
				className="q-sb-typography__sample"
				style={{ "--_size": cssVar(token) } as CSSProperties}
			>
				Ag
			</span>
			<Mono>{token}</Mono>
			<Text size="sm" color="muted">
				<Num>{Math.round(px * 10) / 10}</Num>
			</Text>
		</div>
	);
}

function TypographyPage() {
	return (
		<GuidePage
			title="Typography"
			doc="typography.md"
			intro="Eight roles, six sizes, in Geist and sentence case on soft ink. Each role comes from a component prop. The numbers are read from the rendered text."
		>
			<Part
				title="Roles"
				rule="Size / line height · weight, measured. Level follows the outline; size follows the role."
			>
				<div className="q-sb-typography__rows">
					{ROLES.map((r) => (
						<RoleRow key={r.role} r={r} />
					))}
				</div>
			</Part>
			<Part
				title="The six screen sizes"
				rule="11 · 12 · 14 · 17 · 20 · 24, each only through a role. Nothing above 24 on a product screen."
			>
				<div className="q-sb-typography__sizes">
					{SCALE.map((t) => (
						<Size key={t} token={t} />
					))}
				</div>
			</Part>
			<Part
				title="Hierarchy on one screen"
				rule="One page title at 24, then a 14 semibold title per section and per module, one level down each. Never two equal headings stacked."
			>
				<div className={`${stage} q-sb-typography__hierarchy`}>
					<PageHeader
						as="h2"
						eyebrow="Workspace"
						title="Billing"
						description="Plan, usage and invoices."
					/>
					<Panel as="h3" title="Usage" description="Resets on the first of the month.">
						<div className="q-sb-typography__stack">
							<Text as="h4" size="md" weight="semibold" color="heading">
								Meerkat
							</Text>
							<Text size="sm" color="muted">
								$6.98 of $8.00 cap · resets Oct 31
							</Text>
						</div>
					</Panel>
				</div>
			</Part>
		</GuidePage>
	);
}

const meta: Meta = { title: "Foundations/Typography", parameters: { layout: "fullscreen" } };
export default meta;
export const Default: StoryObj = { render: () => <TypographyPage /> };
