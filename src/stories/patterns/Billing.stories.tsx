import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
	AppIcon,
	Avatar,
	Badge,
	BudgetLeash,
	Button,
	Col,
	CostMeter,
	DescriptionList,
	Grid,
	PageHeader,
	Panel,
	Table,
	Text,
	toast,
} from "../../index";
import { AppFrame } from "./AppFrame";
import "./Billing.scss";

// Billing — plan, what agents are spending today, the leash on each agent, and invoices. A
// PageHeader, then surface Panels: actions sit in each panel's header as quiet buttons, never as
// arrow links. Money reads in ink; molten appears only where a meter nears its cap.

const usd = (v: number) => `$${v.toFixed(2)}`;

const INVOICES = [
	{
		id: 1,
		no: "0033",
		date: "Oct 1",
		items: "Pro · agent usage $212.40",
		status: "Due",
		amount: "$261.40",
	},
	{
		id: 2,
		no: "0032",
		date: "Sep 1",
		items: "Pro · agent usage $188.10",
		status: "Paid",
		amount: "$237.10",
	},
	{
		id: 3,
		no: "0031",
		date: "Aug 1",
		items: "Pro · agent usage $96.75",
		status: "Paid",
		amount: "$145.75",
	},
	{ id: 4, no: "0030", date: "Jul 1", items: "Pro", status: "Paid", amount: "$49.00" },
];

function BillingPage() {
	const [cap, setCap] = useState(40);
	return (
		<>
			<PageHeader
				title="Billing"
				description="Pro plan, $49 a month. Agent usage is billed on top, capped per agent."
				actions={
					<Button size="sm" variant="secondary">
						Change plan
					</Button>
				}
			/>
			<Grid columns={12} gap="md">
				<Col span={5}>
					<div className="q-sb-app-frame__stack">
						<Panel
							title="Plan"
							actions={
								<Button size="sm" variant="ghost">
									Compare plans
								</Button>
							}
							footer={
								<div className="q-sb-billing__plan-footer">
									<span>Save two months on yearly billing.</span>
									<Button size="sm" variant="secondary">
										Switch to yearly
									</Button>
								</div>
							}
						>
							<div className="q-sb-billing__plan">
								<Text weight="semibold" color="heading">
									Pro
								</Text>
								<Text color="heading">$49 / month</Text>
							</div>
							<DescriptionList
								size="sm"
								items={[
									{ label: "Seats", value: "4 of 10 used" },
									{ label: "Renews", value: "Nov 1" },
									{ label: "Billed to", value: "ada@sjocamp.co" },
								]}
							/>
						</Panel>
						<Panel
							title="Payment method"
							actions={
								<Button size="sm" variant="ghost">
									Update
								</Button>
							}
						>
							<div className="q-sb-app-frame__row q-sb-app-frame__row--stack">
								<Badge size="sm" variant="outline">
									VISA
								</Badge>
								<div className="q-sb-billing__card-text">
									<Text color="heading">Ending 4242</Text>
									<Text size="sm" color="muted">
										Expires 11 / 27
									</Text>
								</div>
							</div>
						</Panel>
					</div>
				</Col>
				<Col span={7}>
					<Panel
						title="Agent usage"
						description="Today, by kind of work. Each line has its own cap."
					>
						<div className="q-sb-app-frame__stack">
							<CostMeter
								label="Agents · today"
								period="daily"
								budget={20}
								format={usd}
								items={[
									{ id: "reply", label: "Replying to signups", value: 2.46, cap: 4 },
									{ id: "draft", label: "Drafting posts", value: 1.12, cap: 3 },
									{ id: "render", label: "Rendering clips", value: 7.42, cap: 8 },
								]}
							/>
							<BudgetLeash
								label="Meerkat's daily cap"
								agent={<Avatar name="Meerkat" size="sm" shape="square" />}
								spent={31.6}
								cap={cap}
								onCapChange={(v) => {
									setCap(v);
									toast({ title: `Cap set to $${v}.`, meta: "Meerkat · daily" });
								}}
								presets={[20, 40, 80]}
								slack={10}
								format={(v) => `$${v.toFixed(2)}`}
							/>
						</div>
					</Panel>
				</Col>
			</Grid>
			<Panel
				title="Invoices"
				count={INVOICES.length}
				padding="none"
				actions={
					<Button
						size="sm"
						variant="ghost"
						leftIcon={<AppIcon name="download" />}
						onClick={() => toast({ title: "Preparing a zip of 4 invoices." })}
					>
						Download all
					</Button>
				}
			>
				<Table
					size="sm"
					label="Invoices"
					minWidth={520}
					columns={[
						{ key: "no", header: "Invoice" },
						{ key: "date", header: "Date" },
						{ key: "items", header: "Items" },
						{
							key: "status",
							header: "Status",
							render: (r) => (
								<Badge size="sm" variant={r.status === "Paid" ? "success" : "warning"}>
									{r.status}
								</Badge>
							),
						},
						{ key: "amount", header: "Amount", align: "right" },
						{
							key: "download",
							header: <span className="q-sr-only">Download</span>,
							align: "right",
							width: 48,
							render: (r) => (
								<Button
									size="sm"
									variant="ghost"
									icon={<AppIcon name="download" />}
									aria-label={`Download invoice ${r.no}`}
									onClick={() => toast({ title: `Downloading invoice ${r.no}.` })}
								/>
							),
						},
					]}
					data={INVOICES}
				/>
			</Panel>
		</>
	);
}

const meta: Meta = {
	title: "Patterns/Billing",
	parameters: { layout: "fullscreen", density: "app" },
};
export default meta;
export const Default: StoryObj = {
	render: () => (
		<AppFrame active="billing" crumbs={[{ label: "Account", href: "#" }, { label: "Billing" }]}>
			<BillingPage />
		</AppFrame>
	),
};
