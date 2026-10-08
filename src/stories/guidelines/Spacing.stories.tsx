import type { Meta, StoryObj } from "@storybook/react-vite";
import { type CSSProperties, useRef, useState } from "react";
import { Button, SectionHeader, StatCard, Text, TextField } from "../../index";
import { cssVar, type TokenName } from "../../styles/tokens.generated";
import { type Density, DensitySwitch, Gap, GuidePage, Mono, Part, panel, useVar } from "./Guide";
import "./Spacing.scss";

// docs/guidelines/spacing.md as measured specimens: the scale, the job tokens per density, and
// redlines between real components.

const SCALE = [
	"--q-space-0-5",
	"--q-space-1",
	"--q-space-1-5",
	"--q-space-2",
	"--q-space-2-5",
	"--q-space-3",
	"--q-space-4",
	"--q-space-5",
	"--q-space-6",
	"--q-space-7",
	"--q-space-8",
	"--q-space-10",
	"--q-space-12",
	"--q-space-16",
] as const satisfies readonly TokenName[];
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
] as const satisfies ReadonlyArray<readonly [TokenName, string]>;

function Bar({ token, label }: { token: TokenName; label: string }) {
	const ref = useRef<HTMLSpanElement>(null);
	const px = Number.parseFloat(useVar(ref, token)) || 0;
	return (
		<div className="q-sb-spacing__bar">
			<Mono className="q-sb-spacing__bar-label">{label}</Mono>
			<Text size="sm" color="heading" className="q-sb-spacing__bar-value">
				{px}
			</Text>
			<span
				ref={ref}
				aria-hidden="true"
				className="q-sb-spacing__bar-fill"
				style={{ "--_w": cssVar(token) } as CSSProperties}
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
				<div className="q-sb-spacing__list">
					{SCALE.map((t) => (
						<Bar key={t} token={t} label={t} />
					))}
				</div>
			</Part>

			<div data-density={density} className="q-sb-spacing">
				<Part
					title="Job tokens"
					rule="Pick by what the gap separates. App is the product default."
					aside={<DensitySwitch value={density} onChange={setDensity} />}
				>
					<div className="q-sb-spacing__list">
						{JOBS.map(([t, job]) => (
							<Bar key={t} token={t} label={`${t.replace("--q-", "")} · ${job}`} />
						))}
					</div>
				</Part>

				<Part
					title="Redlines between real components"
					rule="Inside a component, its own spacing. Between components, the parent's gap, never a margin."
				>
					<div className="q-sb-spacing__redlines">
						<div>
							<Mono>Section</Mono>
							<SectionHeader size="sm" as="h3" title="Signups" description="Last 30 days." />
							<Gap token="--q-space-block" note="header ↔ content" />
							<StatCard label="Verified" value="4,812" delta="+12%" trend="up" />
						</div>
						<div>
							<Mono>Panel</Mono>
							<div className={`${panel} q-sb-spacing__panel`}>
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
							<div className="q-sb-spacing__actions">
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
