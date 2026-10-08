import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import { Button, SectionHeader, StatCard, Text, TextField } from "../../index";
import { type Density, DensitySwitch, Gap, GuidePage, Mono, Part, panel, useVar } from "./Guide";

// docs/guidelines/spacing.md as measured specimens: the scale, the job tokens per density, and
// redlines between real components.

const SCALE = [
	"0-5",
	"1",
	"1-5",
	"2",
	"2-5",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"10",
	"12",
	"16",
] as const;
const JOBS = [
	["--q-space-inline", "icon ↔ label, button ↔ button"],
	["--q-space-stack", "lines inside a panel"],
	["--q-space-field", "field ↔ field"],
	["--q-space-card-pad", "panel padding"],
	["--q-space-card-gap", "card ↔ card"],
	["--q-space-block", "block ↔ block, header ↔ content"],
	["--q-space-section", "page top/bottom, settings sections"],
	["--q-space-page-x", "page sides"],
	["--q-grid-gutter", "grid column gap"],
] as const;

function Bar({ token, label }: { token: string; label: string }) {
	const ref = useRef<HTMLSpanElement>(null);
	const px = Number.parseFloat(useVar(ref, token)) || 0;
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "minmax(0, 200px) 40px minmax(0, 1fr)",
				alignItems: "center",
				gap: "var(--q-space-2)",
			}}
		>
			<Mono style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{label}</Mono>
			<Text
				size="sm"
				color="heading"
				style={{ fontVariantNumeric: "tabular-nums", textAlign: "right" }}
			>
				{px}
			</Text>
			<span
				ref={ref}
				aria-hidden="true"
				style={{
					width: `var(${token})`,
					maxWidth: "100%",
					height: "var(--q-space-1)",
					background: "var(--q-fg)",
					borderRadius: "var(--q-radius-pill)",
				}}
			/>
		</div>
	);
}

function SpacingPage() {
	const [density, setDensity] = useState<Density>("app");
	return (
		<GuidePage
			title="Spacing"
			doc="spacing.md"
			intro="Every gap is a job token. Switch density: the jobs change, the raw scale doesn't. The numbers below are read live from the tokens."
		>
			<Part
				title="The scale"
				rule="--q-space-*. Steps under 8 and 20 are for inside components only, never between blocks."
			>
				<div style={{ display: "grid", gap: "var(--q-space-1)" }}>
					{SCALE.map((s) => (
						<Bar key={s} token={`--q-space-${s}`} label={`--q-space-${s}`} />
					))}
				</div>
			</Part>

			<div data-density={density} style={{ display: "contents" }}>
				<Part
					title="Job tokens"
					rule="Pick by what the gap separates. App is the product default."
					aside={<DensitySwitch value={density} onChange={setDensity} />}
				>
					<div style={{ display: "grid", gap: "var(--q-space-1)" }}>
						{JOBS.map(([t, job]) => (
							<Bar key={t} token={t} label={`${t.replace("--q-", "")} · ${job}`} />
						))}
					</div>
				</Part>

				<Part
					title="Redlines between real components"
					rule="Inside a component, its own spacing. Between components, the parent's gap, never a margin."
				>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
							gap: "var(--q-space-4)",
							alignItems: "start",
						}}
					>
						<div>
							<Mono>Section</Mono>
							<SectionHeader size="sm" as="h3" title="Signups" description="Last 30 days." />
							<Gap token="--q-space-block" note="header ↔ content" />
							<StatCard label="Verified" value="4,812" delta="+12%" trend="up" />
						</div>
						<div>
							<Mono>Panel</Mono>
							<div style={{ ...panel, gap: 0 }}>
								<Gap token="--q-space-card-pad" note="pad" />
								<Text as="h3" size="lg" weight="semibold" color="heading">
									Usage this month
								</Text>
								<Gap token="--q-space-stack" />
								<Text size="sm" color="muted">
									3 agents · $10.56 of $20.00
								</Text>
							</div>
						</div>
						<div>
							<Mono>Form</Mono>
							<TextField size="sm" label="Workspace name" defaultValue="Sjocamp" />
							<Gap token="--q-space-field" />
							<TextField size="sm" label="Billing email" defaultValue="ops@sjocamp.co" />
							<Gap token="--q-space-block" note="fields ↔ actions" />
							<div style={{ display: "flex", gap: "var(--q-space-inline)" }}>
								<Button size="sm" variant="secondary">
									Cancel
								</Button>
								<Button size="sm">Save</Button>
							</div>
						</div>
					</div>
				</Part>
			</div>
		</GuidePage>
	);
}

const meta: Meta = { title: "Guidelines/Spacing", parameters: { layout: "fullscreen" } };
export default meta;
export const Default: StoryObj = { render: () => <SpacingPage /> };
