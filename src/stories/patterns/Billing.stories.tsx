import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
	ArrowLink,
	Avatar,
	Badge,
	BudgetLeash,
	Button,
	Card,
	Col,
	CostMeter,
	Grid,
	PageHero,
	SectionHeader,
	Table,
	Text,
	toast,
} from "../../index";
import { AppFrame, row, stack } from "./AppFrame";

// Billing — plan, what agents are spending today, the leash on each agent, and invoices.
// Money reads in ink; molten appears only where a meter nears its cap.

const usd = (v: number) => `$${v.toFixed(2)}`;

function BillingPage() {
	const [cap, setCap] = useState(40);
	return (
		<>
			<PageHero
				size="md"
				ruled={false}
				style={{ padding: 0 }}
				title="Billing"
				description="Pro plan, $49 a month, renews November 1. Agent usage is billed on top, capped per agent."
				actions={
					<Button size="sm" variant="secondary">
						Change plan
					</Button>
				}
			/>
			<Grid columns={12} gap="md">
				<Col span={5}>
					<div style={stack()}>
						<SectionHeader size="sm" as="h2" title="Plan" />
						<Card
							eyebrow="Current plan"
							title="Pro"
							accent="$49 / month"
							meta="Renews Nov 1 · billed to ada@sjocamp.co"
							footer={
								<div style={row("var(--q-space-stack)")}>
									<Button size="sm" variant="secondary">
										Switch to yearly
									</Button>
									<ArrowLink href="#">Compare plans</ArrowLink>
								</div>
							}
						>
							Unlimited campaigns, 10 seats, Meerkat with a $40 daily cap. Four of ten seats used.
						</Card>
						<div
							style={{
								...row("var(--q-space-stack)"),
								padding: "var(--q-space-card-pad)",
								border: "var(--q-hairline) solid var(--q-border)",
								borderRadius: "var(--q-radius-lg)",
							}}
						>
							<Badge size="sm" variant="outline">
								VISA
							</Badge>
							<div style={{ ...stack("0"), flex: 1 }}>
								<Text color="heading">Ending 4242</Text>
								<Text size="sm" color="muted">
									Expires 11 / 27
								</Text>
							</div>
							<Button size="sm" variant="ghost" arrow>
								Update
							</Button>
						</div>
					</div>
				</Col>
				<Col span={7}>
					<div style={stack()}>
						<SectionHeader
							size="sm"
							as="h2"
							title="Agent"
							accent="usage"
							description="Today, by kind of work. Each line has its own cap."
						/>
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
				</Col>
			</Grid>
			<div style={stack("var(--q-space-stack)")}>
				<SectionHeader
					size="sm"
					as="h2"
					title="Invoices"
					actions={<ArrowLink href="#">Download all</ArrowLink>}
				/>
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
					]}
					data={[
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
					]}
				/>
			</div>
		</>
	);
}

const meta: Meta = { title: "Patterns/Billing", parameters: { layout: "fullscreen" } };
export default meta;
export const Default: StoryObj = {
	render: () => (
		<AppFrame active="billing" crumbs={[{ label: "Account", href: "#" }, { label: "Billing" }]}>
			<BillingPage />
		</AppFrame>
	),
};
