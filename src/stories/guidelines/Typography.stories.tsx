import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { Eyebrow, PageHero, SectionHeader, StatCard, Text } from "../../index";
import { GuidePage, Mono, Part } from "./Guide";

// docs/guidelines/typography.md as measured specimens: each app role rendered by the component
// that owns it, with its computed size / line height / weight read from the rendered text.

type Role = { role: string; how: string; target: string; node: ReactNode };

const ROLES: Role[] = [
	{
		role: "page-title",
		how: 'PageHero size="md" · h1 (h3 here)',
		target: ".q-page-hero__title",
		node: <PageHero size="md" as="h3" ruled={false} title="Campaigns" style={{ padding: 0 }} />,
	},
	{
		role: "section-title",
		how: 'SectionHeader size="sm" as="h2"',
		target: ".q-section-header__title",
		node: <SectionHeader size="sm" as="h4" title="Recent signups" />,
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
		how: 'PageHero description · Text size="lg"',
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
		how: "Eyebrow · Text mono · table headers",
		target: ".q-eyebrow",
		node: <Eyebrow>Last deploy</Eyebrow>,
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
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
				gap: "var(--q-space-3)",
				alignItems: "center",
				padding: "var(--q-space-2) 0",
				borderTop: "var(--q-hairline) solid var(--q-border)",
			}}
		>
			<div style={{ display: "grid", gap: "var(--q-space-0-5)" }}>
				<Text size="sm" color="heading" weight="semibold">
					{r.role}
				</Text>
				<Mono>{m}</Mono>
				<Text size="sm" color="muted">
					<code>{r.how}</code>
				</Text>
			</div>
			<div ref={box} style={{ minWidth: 0, gridColumn: "span 2" }}>
				{r.node}
			</div>
		</div>
	);
}

const SCALE = ["2xs", "sm", "md", "lg", "2xl", "4xl"] as const;

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
				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						alignItems: "baseline",
						gap: "var(--q-space-4)",
					}}
				>
					{SCALE.map((s) => (
						<div key={s} style={{ display: "grid", gap: "var(--q-space-0-5)" }}>
							<span style={{ fontSize: `var(--q-text-${s})`, lineHeight: 1, color: "var(--q-fg)" }}>
								Ag
							</span>
							<Mono>--q-text-{s}</Mono>
						</div>
					))}
				</div>
			</Part>
			<Part
				title="Hierarchy on one screen"
				rule="One 40, then 24 per section, 17 per panel. Never two equal headings stacked."
			>
				<div
					data-density="app"
					style={{ display: "grid", gap: "var(--q-space-block)", maxWidth: "var(--q-w-form)" }}
				>
					<PageHero
						size="md"
						as="h3"
						eyebrow="Workspace"
						title="Billing"
						description="Plan, usage and invoices."
						ruled={false}
						style={{ padding: 0 }}
					/>
					<div style={{ display: "grid", gap: "var(--q-space-block)" }}>
						<SectionHeader size="sm" as="h4" title="Usage" />
						<div style={{ display: "grid", gap: "var(--q-space-stack)" }}>
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
