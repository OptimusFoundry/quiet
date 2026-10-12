import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../../components/core/Button";
import { Icon } from "../../../components/core/Icon";
import { Accordion, type AccordionProps } from "../../../components/display/Accordion";
import { Column, Note, Row } from "../Story";

const BILLING: AccordionProps["items"] = [
	{
		id: "billing",
		title: "When am I billed?",
		description: "Monthly, on the day you subscribed",
		content:
			"Invoices go out on the same day each month. Seats added mid-cycle are prorated to the day.",
	},
	{
		id: "seats",
		title: "Can I change seats later?",
		content: "Yes. Add or remove seats from Settings; the next invoice reflects the change.",
	},
	{
		id: "runners",
		title: "Do idle runners cost anything?",
		content: "No. Runners bill by the minute while a run is active, and nothing while they wait.",
	},
];

const meta = {
	title: "Components/Display/Accordion",
	component: Accordion,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { items: BILLING, defaultExpanded: ["billing"], multiple: false, headingLevel: 3 },
	argTypes: {
		items: { control: false },
		onChange: { control: false },
		expanded: { control: false },
		defaultExpanded: { control: false },
	},
	decorators: [
		(Story) => (
			<Column>
				<Story />
			</Column>
		),
	],
} satisfies Meta<typeof Accordion>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Multiple: Story = {
	parameters: {
		docs: {
			description: {
				story: "`multiple` lets several rows stay open; otherwise one closes the other.",
			},
		},
	},
	args: { multiple: true, defaultExpanded: ["billing", "seats"] },
};

export const IconsAndDescriptions: Story = {
	args: {
		defaultExpanded: [],
		items: [
			{
				id: "export",
				icon: <Icon name="download" />,
				title: "Exporting artifacts",
				description: "CSV or a zip of every file",
				content: "Export every artifact a run produced from the run's menu, at any time.",
			},
			{
				id: "keys",
				icon: <Icon name="key" />,
				title: "API keys",
				description: "Scoped per workspace",
				content:
					"Keys read or write one workspace. Revoke one and runs using it stop at the next call.",
			},
			{
				id: "approvals",
				icon: <Icon name="approvals" />,
				title: "Approvals",
				description: "Who signs off before a run ships",
				content:
					"Pick reviewers per workspace. A run waits at its approval step until one signs off.",
			},
		],
	},
};

export const Disabled: Story = {
	parameters: { docs: { description: { story: "A disabled row is skipped by the arrow keys." } } },
	args: {
		defaultExpanded: [],
		items: [
			...BILLING.slice(0, 2),
			{
				id: "sso",
				title: "Single sign-on",
				description: "Business plan",
				content: "",
				disabled: true,
			},
		],
	},
};

function ControlledDemo(args: AccordionProps) {
	const [expanded, setExpanded] = useState<Array<string | number>>(["billing"]);
	return (
		<Column>
			<Row>
				<Button
					size="sm"
					variant="secondary"
					onClick={() => setExpanded(["billing", "seats", "runners"])}
				>
					Expand all
				</Button>
				<Button size="sm" variant="secondary" onClick={() => setExpanded([])}>
					Collapse all
				</Button>
			</Row>
			<Accordion {...args} multiple expanded={expanded} onChange={setExpanded} />
			<Note>Open: {expanded.join(", ") || "none"}. Up and down arrows move between headers.</Note>
		</Column>
	);
}

export const Controlled: Story = {
	parameters: {
		docs: { description: { story: "`expanded` + `onChange`: the app owns which rows are open." } },
	},
	render: (args) => <ControlledDemo {...args} />,
};
