import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import {
	Alert,
	Button,
	Col,
	DescriptionList,
	Grid,
	List,
	PageHeader,
	Panel,
	StatCard,
	Table,
	Text,
} from "../../index";
import { Gap, GuidePage, Part, stage } from "./Guide";
import "./Sections.scss";

// docs/guidelines/sections.md as specimens: the four containers, a page's section anatomy with its
// gaps measured, and the three-level nesting limit. Each specimen sits on the panel's white, as a
// screen would.

function Container({ name, rule, children }: { name: string; rule: string; children: ReactNode }) {
	return (
		<figure className="q-sb-sections__container">
			<div className="q-sb-sections__container-body">{children}</div>
			<figcaption className="q-sb-sections__caption">
				<Text size="md" weight="semibold" color="heading">
					{name}
				</Text>
				<Text size="sm" color="muted">
					{rule}
				</Text>
			</figcaption>
		</figure>
	);
}

function SectionsPage() {
	return (
		<GuidePage
			title="Sections"
			doc="sections.md"
			intro="A page is a stack of sections; a section is a heading plus content in one container. Grounds and spacing group; lines don't. Gaps are measured live."
		>
			<Part
				title="Four containers"
				rule="A titled section is a surface Panel. Plain for the one block that leads the page, outlined only for a module in a grid, rows only inside a container."
			>
				<div className={`${stage} q-sb-sections__containers`}>
					<Container name="Plain" rule="Title and content, no ground: the page's lead block.">
						<Panel variant="plain" as="h3" title="Signups" description="Last 30 days.">
							<Text size="lg" color="heading">
								4,812 verified
							</Text>
						</Panel>
					</Container>
					<Container
						name="Surface (default)"
						rule="The warm ground, no edge: any titled section of a page."
					>
						<Panel as="h3" title="Usage">
							<Text size="sm" color="muted">
								$10.56 of $20.00 today
							</Text>
						</Panel>
					</Container>
					<Container
						name="Outlined"
						rule="White with a faint edge: a module beside peers in a grid."
					>
						<Panel variant="outlined" as="h3" title="Plan">
							<Text size="sm" color="muted">
								Team · 5 seats
							</Text>
						</Panel>
					</Container>
					<Container
						name="Rows"
						rule="Table rows on faint dividers; list rows apart by space, no lines."
					>
						<Table
							size="sm"
							rowKey="id"
							columns={[
								{ key: "name", header: "Report" },
								{ key: "when", header: "Sent", align: "right" },
							]}
							data={[
								{ id: "brief", name: "Weekly brief", when: "Mondays" },
								{ id: "posts", name: "Meerkat's posts", when: "When drafted" },
							]}
						/>
					</Container>
				</div>
			</Part>

			<Part
				title="Anatomy of a page"
				rule="Header, then the lead block (widest, with its own status), supporting blocks, destructive last. Gaps are the job tokens."
			>
				<div className={`${stage} q-sb-sections__anatomy`}>
					<PageHeader
						as="h2"
						eyebrow="Workspace"
						title="Campaigns"
						description="Everything sending this week."
						actions={<Button size="sm">New campaign</Button>}
					/>
					<Gap token="--q-space-block" note="header ↔ content" />
					<Grid columns={12} gap="md" rowGap="md">
						<Col span={8}>
							<Panel
								variant="plain"
								as="h3"
								title="This week"
								description="Lead block, span 8."
								actions={
									<Button size="sm" variant="ghost">
										Export
									</Button>
								}
							>
								<Alert variant="warning" title="3 campaigns are over 5% bounce." />
								<StatCard
									label="Signups"
									value="1,204"
									delta="+8%"
									trend="up"
									period="vs last week"
								/>
							</Panel>
						</Col>
						<Col span={4}>
							<Panel as="h3" title="Details" description="Supporting, span 4.">
								<DescriptionList
									layout="stacked"
									items={[
										{ label: "Owner", value: "Ada Park" },
										{ label: "Bounce", value: "3.1%" },
									]}
								/>
							</Panel>
						</Col>
					</Grid>
					<Gap token="--q-space-block" note="block ↔ block" />
					<Panel variant="outlined" as="h3" title="Danger zone" className="q-sb-sections__danger">
						<div className="q-sb-sections__danger-row">
							<Text size="sm">Delete the workspace. It can't be undone.</Text>
							<Button size="sm" variant="destructive">
								Delete
							</Button>
						</div>
					</Panel>
				</div>
			</Part>

			<Part
				title="Three levels, no more"
				rule="Page, section, container. Inside a container, divide with gap (or a table's faint rows), never another box."
			>
				<div className={`${stage} q-sb-sections__levels`}>
					<Panel as="h3" title="Agents" description="Level 2: a section, on the warm ground.">
						<div className="q-sb-sections__stack">
							<Text as="h4" size="md" weight="semibold" color="heading">
								Meerkat · level 3: rows inside it
							</Text>
							<List
								size="sm"
								items={[
									{ id: "posts", primary: "Posts drafted", secondary: "12 this week" },
									{ id: "spend", primary: "Spend", secondary: "$6.98 of $8.00" },
								]}
							/>
						</div>
					</Panel>
				</div>
			</Part>
		</GuidePage>
	);
}

const meta: Meta = { title: "Foundations/Sections", parameters: { layout: "fullscreen" } };
export default meta;
export const Default: StoryObj = { render: () => <SectionsPage /> };
