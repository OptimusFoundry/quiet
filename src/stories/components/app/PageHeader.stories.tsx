import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { PageHeader } from "../../../components/app/PageHeader";
import { Badge } from "../../../components/core/Badge";
import { Button } from "../../../components/core/Button";
import { Link } from "../../../components/core/Link";
import { Tabs } from "../../../components/navigation/Tabs";
import "./PageHeader.scss";

function Page({ children, narrow }: { children: ReactNode; narrow?: boolean }) {
	return (
		<div className={narrow ? "q-sb-page-header q-sb-page-header--narrow" : "q-sb-page-header"}>
			{children}
			<div className="q-sb-page-header__content">Page content starts here.</div>
		</div>
	);
}

const RUN_META = [
	"Created 6 hours ago",
	"Cost $0.902049",
	<>
		Project <Link href="/projects/assistant">Assistant</Link>
	</>,
	"Trigger web-message",
	"Runner Orca",
];

const RUN_ACTIONS = (
	<>
		<Button variant="secondary">Close run</Button>
		<Button variant="primary">Restart run</Button>
	</>
);

const meta = {
	title: "Components/App/PageHeader",
	component: PageHeader,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	// On the page ground, above where the content starts; `parameters.narrow` sets it at 390px.
	decorators: [
		(Story, { parameters }) => (
			<Page narrow={parameters.narrow === true}>
				<Story />
			</Page>
		),
	],
	args: {
		title: "Projects",
		description:
			"A project groups the runs, artifacts and triggers one assistant works on. Everyone in the organisation can see its runs.",
		actions: <Button variant="primary">Create project</Button>,
	},
	argTypes: {
		title: { control: "text" },
		description: { control: "text" },
		eyebrow: { control: "text" },
		status: { control: false },
		meta: { control: false },
		actions: { control: false },
		tabs: { control: false },
	},
} satisfies Meta<typeof PageHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	parameters: {
		docs: { description: { story: "A list page: title, description, the primary action." } },
	},
};

export const DetailPage: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Back link and eyebrow above, status inline after the title, key facts below, actions on the right with the primary last.",
			},
		},
	},
	args: {
		back: { label: "Runs", href: "/runs" },
		eyebrow: "Run · Headless",
		title: "Run 233f76c2",
		description: undefined,
		status: <Badge dot>Idle</Badge>,
		meta: RUN_META,
		actions: RUN_ACTIONS,
	},
};

export const WithTabs: Story = {
	args: {
		back: { label: "Artifacts", href: "/artifacts" },
		eyebrow: "Artifact · spreadsheet",
		title: "Q3 vendor costs.xlsx",
		description: undefined,
		status: <Badge variant="success">Ready</Badge>,
		meta: [
			"42 KB",
			<>
				From <Link href="/runs/233f76c2">Run 233f76c2</Link>
			</>,
			"Updated 2 hours ago",
		],
		actions: <Button variant="secondary">Download</Button>,
		tabs: (
			<Tabs
				label="Artifact sections"
				defaultValue="preview"
				tabs={[
					{ value: "preview", label: "Preview" },
					{ value: "versions", label: "Versions", count: 3 },
					{ value: "activity", label: "Activity" },
				]}
			/>
		),
	},
};

export const LongTitle: Story = {
	parameters: {
		docs: {
			description: {
				story: "Title only, as an `h2` (a header inside a screen); the status badges wrap with it.",
			},
		},
	},
	args: {
		as: "h2",
		title: "Summarise the weekly approvals backlog for the Assistant project and draft replies",
		description: undefined,
		actions: undefined,
		status: (
			<>
				<Badge variant="warning">Needs approval</Badge>
				<Badge variant="outline">Orca</Badge>
			</>
		),
	},
};

export const Narrow: Story = {
	parameters: {
		narrow: true,
		docs: { description: { story: "At 390px the actions wrap below the title." } },
	},
	args: DetailPage.args,
};
