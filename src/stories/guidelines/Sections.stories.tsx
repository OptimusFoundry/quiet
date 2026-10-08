import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import {
	Alert,
	Button,
	Col,
	Grid,
	List,
	PageHero,
	SectionHeader,
	StatCard,
	Switch,
	Text,
} from "../../index";
import { Gap, GuidePage, Mono, Part, panel, well } from "./Guide";

// docs/guidelines/sections.md as specimens: the four containers, a page's section anatomy with its
// gaps measured, and the three-level nesting limit.

function Container({ name, rule, children }: { name: string; rule: string; children: ReactNode }) {
	return (
		<div style={{ display: "grid", gap: "var(--q-space-1)", alignContent: "start", minWidth: 0 }}>
			<Text as="h3" size="md" weight="semibold" color="heading">
				{name}
			</Text>
			<Text size="sm" color="muted">
				{rule}
			</Text>
			<div style={{ paddingTop: "var(--q-space-1)" }}>{children}</div>
		</div>
	);
}

const row = {
	padding: "var(--q-space-stack) 0",
	borderTop: "var(--q-hairline) solid var(--q-border)",
};

function SectionsPage() {
	return (
		<GuidePage
			title="Sections"
			doc="sections.md"
			intro="A page is a stack of sections; a section is a heading plus content in the lightest container that works. App density, gaps measured."
		>
			<div data-density="app" style={{ display: "contents" }}>
				<Part title="Four containers" rule="Lightest first. Each step up adds an edge.">
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
							gap: "var(--q-grid-gutter)",
						}}
					>
						<Container name="Bare" rule="Default. Part of the page's flow.">
							<div style={{ display: "grid", gap: "var(--q-space-stack)" }}>
								<Text size="sm" color="muted">
									Verified
								</Text>
								<Text size="lg" color="heading">
									4,812 signups
								</Text>
							</div>
						</Container>
						<Container name="Divided" rule="Repeated rows of one kind.">
							<div>
								{["Weekly brief", "Meerkat's posts"].map((l, i) => (
									<div key={l} style={row}>
										<Switch size="sm" label={l} defaultChecked={i === 0} />
									</div>
								))}
							</div>
						</Container>
						<Container name="Panel" rule="A self-contained module beside others.">
							<div style={panel}>
								<Text as="h4" size="lg" weight="semibold" color="heading">
									Usage
								</Text>
								<Text size="sm" color="muted">
									$10.56 of $20.00 today
								</Text>
							</div>
						</Container>
						<Container name="Well" rule="Secondary, read-only, inside a section.">
							<div style={well}>
								<Mono>Example</Mono>
								<Text size="sm">Paused Founding members · by Meerkat</Text>
							</div>
						</Container>
					</div>
				</Part>

				<Part
					title="Anatomy of a page"
					rule="Header → status → lead block (widest) → supporting → destructive last. Gaps are the job tokens."
				>
					<div style={{ maxWidth: "var(--q-w-content)", minWidth: 0 }}>
						<PageHero
							size="md"
							as="h3"
							eyebrow="Workspace"
							title="Campaigns"
							ruled={false}
							style={{ padding: 0 }}
							actions={<Button size="sm">New campaign</Button>}
						/>
						<Gap token="--q-space-block" note="header ↔ status" />
						<Alert variant="warning" title="3 campaigns are over 5% bounce." />
						<Gap token="--q-space-block" note="block ↔ block" />
						<SectionHeader
							size="sm"
							as="h4"
							title="This week"
							actions={
								<Button size="sm" variant="ghost">
									Export
								</Button>
							}
						/>
						<Gap token="--q-space-block" note="header ↔ content" />
						<Grid columns={12} gap="md" rowGap="md">
							<Col span={8}>
								<div style={{ ...panel, minHeight: 120 }}>
									<Text as="h5" size="lg" weight="semibold" color="heading">
										Signups · lead block, span 8
									</Text>
								</div>
							</Col>
							<Col span={4}>
								<StatCard label="Bounce" value="3.1%" />
							</Col>
						</Grid>
						<Gap token="--q-space-block" note="block ↔ block" />
						<SectionHeader size="sm" as="h4" title="Danger zone" />
						<Gap token="--q-space-block" />
						<div
							style={{
								...panel,
								borderColor: "var(--q-accent)",
								display: "flex",
								flexWrap: "wrap",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<Text size="sm">Delete workspace. It can't be undone.</Text>
							<Button size="sm" variant="destructive">
								Delete
							</Button>
						</div>
					</div>
				</Part>

				<Part
					title="Three levels, no more"
					rule="page → section → container. Inside a container, divide with gap or hairline rows, never another box."
				>
					<div
						style={{ display: "grid", gap: "var(--q-space-block)", maxWidth: "var(--q-w-form)" }}
					>
						<SectionHeader size="sm" as="h3" title="Agents" description="Level 2: a section." />
						<div style={panel}>
							<Text as="h4" size="lg" weight="semibold" color="heading">
								Meerkat · level 3: a panel
							</Text>
							<List
								divided
								size="sm"
								items={[
									{ id: "posts", primary: "Posts drafted", secondary: "12 this week" },
									{ id: "spend", primary: "Spend", secondary: "$6.98 of $8.00" },
								]}
							/>
						</div>
					</div>
				</Part>
			</div>
		</GuidePage>
	);
}

const meta: Meta = { title: "Guidelines/Sections", parameters: { layout: "fullscreen" } };
export default meta;
export const Default: StoryObj = { render: () => <SectionsPage /> };
