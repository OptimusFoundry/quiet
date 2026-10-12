import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import {
	AgentRun,
	Alert,
	ArrowLink,
	Avatar,
	BarChart,
	Button,
	Col,
	Grid,
	LineChart,
	List,
	PageHeader,
	Panel,
	Sparkline,
	StatCard,
	toast,
} from "../../index";
import { AppFrame } from "./AppFrame";
import "./Dashboard.scss";

// Dashboard — the reference kit's dashboard.html order in the app look: PageHeader → one slim Alert
// → 4 StatCards (span 3, each with its trend inside the tile) → main column (span 8) + agent and
// activity (span 4), every section a surface Panel. Molten marks the primary action, the attention
// and the lead series only: one sparkline and one chart series; the rest are ink and greys.

const DAYS = Array.from({ length: 30 }, (_, i) => `Sep ${i + 1}`);
const THIS_MONTH = [
	42, 48, 39, 61, 66, 58, 74, 81, 77, 96, 92, 104, 88, 118, 124, 116, 131, 138, 129, 142, 151, 147,
	158, 163, 155, 171, 176, 168, 189, 204,
];
const LAST_MONTH = [
	38, 41, 36, 44, 47, 45, 51, 53, 50, 57, 55, 60, 58, 62, 66, 64, 67, 70, 68, 71, 74, 72, 76, 78,
	77, 80, 83, 81, 85, 88,
];
const usd = (v: number) => `$${v.toLocaleString("en-US")}`;

const STEPS = [
	{ label: "Read 14 campaigns", tool: "signups.db", duration: "0.4s" },
	{ label: "Compute 7-day bounce rate", tool: "analytics", duration: "1.1s" },
	{ label: "Match 3 above 5%", tool: "filter" },
	{ label: "Draft pause notices", tool: "meerkat" },
	{ label: "Waiting for your approval", tool: "you" },
];

function Overview() {
	const [step, setStep] = useState(2);
	const [status, setStatus] = useState<"running" | "paused" | "stopped" | "done">("running");
	useEffect(() => {
		if (status !== "running" || step >= STEPS.length - 1) return;
		const t = setTimeout(() => setStep((s) => s + 1), 2400);
		return () => clearTimeout(t);
	}, [status, step]);
	return (
		<>
			<PageHeader
				title="Good morning, Ada"
				description="Signups doubled after the Product Hunt post. One campaign is bouncing, and Meerkat has a fix waiting for you."
				actions={
					<>
						<Button
							size="sm"
							variant="secondary"
							onClick={() =>
								toast({ status: "success", title: "Invite sent.", meta: "leo@sjocamp.co" })
							}
						>
							Invite
						</Button>
						<Button size="sm" variant="primary">
							New campaign
						</Button>
					</>
				}
			/>
			<Alert
				variant="warning"
				title="Beta · EU has bounced above 5% for three days."
				action={
					<ArrowLink href="?path=/story/patterns-records--default">Review the pause</ArrowLink>
				}
			/>
			<Grid columns={12} gap="md" rowGap="md">
				{[
					{
						label: "Verified signups",
						value: 4812,
						delta: 12.4,
						period: "vs Aug",
						data: THIS_MONTH,
						fmt: undefined,
					},
					{
						label: "MRR",
						value: 13200,
						delta: 6.1,
						period: "vs Aug",
						data: [9.8, 10.1, 10.4, 10.9, 11.2, 11.8, 12.4, 13.2],
						fmt: usd,
						tone: "ink" as const,
					},
					{
						label: "Bounce rate",
						value: "3.1%",
						delta: "-0.8 pts",
						trend: "down" as const,
						period: "7 days",
						data: [4.2, 4.0, 3.9, 3.6, 3.4, 3.3, 3.1],
						tone: "ink" as const,
					},
					{
						label: "Posts · 7d",
						value: 23,
						delta: 4,
						period: "vs prior week",
						data: [2, 4, 3, 5, 3, 2, 4],
						tone: "ink" as const,
					},
				].map((s) => (
					<Col key={s.label} span={3} className="q-sb-dashboard__kpi-col">
						<div className="q-sb-dashboard__kpi">
							<StatCard
								variant="filled"
								label={s.label}
								value={s.value}
								format={s.fmt ? (v) => s.fmt(Number(v)) : undefined}
								delta={s.delta}
								trend={s.trend}
								period={s.period}
							/>
							<Sparkline
								data={s.data}
								width={160}
								height={28}
								tone={s.tone}
								className="q-sb-dashboard__spark"
								aria-label={`${s.label}, last ${s.data.length} points`}
							/>
						</div>
					</Col>
				))}
			</Grid>
			<Grid columns={12} gap="md" rowGap="md">
				<Col span={8}>
					<div className="q-sb-app-frame__stack">
						<Panel
							title="Verified signups"
							description="Per day, September against August. The dashed line is the 150-a-day target."
						>
							<LineChart
								aria-label="Verified signups per day"
								series={[
									{ name: "September", data: THIS_MONTH },
									{ name: "August", data: LAST_MONTH },
								]}
								labels={DAYS}
								zero
								xTicks={5}
								reference={{ value: 150, label: "Target 150/day" }}
							/>
						</Panel>
						<Panel title="By channel" description="Signups per quarter.">
							<BarChart
								aria-label="Signups by channel, per quarter"
								categories={["Q1", "Q2", "Q3", "Q4"]}
								series={[
									{ name: "Organic", data: [420, 510, 640, 720], color: "var(--q-chart-series-2)" },
									{
										name: "Referral",
										data: [180, 240, 260, 310],
										color: "var(--q-chart-series-3)",
									},
									{ name: "Paid", data: [90, 120, 80, 140], color: "var(--q-chart-series-4)" },
								]}
							/>
						</Panel>
					</div>
				</Col>
				<Col span={4}>
					<div className="q-sb-app-frame__stack">
						<Panel title="Meerkat is working">
							<AgentRun
								title="Pausing bouncing campaigns"
								meta="Meerkat · started 4 min ago"
								steps={STEPS}
								current={step}
								status={status}
								onPause={() => setStatus("paused")}
								onResume={() => setStatus("running")}
								onStop={() => setStatus("stopped")}
								actions={
									<>
										<Button size="sm" variant="ghost" onClick={() => setStatus("stopped")}>
											Discard
										</Button>
										<Button
											size="sm"
											variant="secondary"
											href="?path=/story/patterns-records--default"
										>
											Review
										</Button>
									</>
								}
							/>
						</Panel>
						<Panel title="Activity">
							<List
								size="sm"
								items={[
									{
										primary: "Meerkat posted the release notes",
										secondary: "Bluesky, X",
										leading: <Avatar name="Meerkat" size="sm" shape="square" />,
										trailing: "09:12",
									},
									{
										primary: "Product Hunt launch",
										secondary: "412 signups in 6 hours",
										leading: <Avatar name="Ada Park" size="sm" />,
										trailing: "Sep 10",
									},
									{
										primary: "Leo verified join.sjocamp.co",
										secondary: "DNS and DKIM",
										leading: <Avatar name="Leo Brandt" size="sm" />,
										trailing: "Sep 8",
									},
									{
										primary: "Invoice 0032 paid",
										secondary: "$49 · Pro",
										leading: <Avatar name="$" size="sm" shape="square" />,
										trailing: "Sep 1",
									},
								]}
							/>
						</Panel>
					</div>
				</Col>
			</Grid>
		</>
	);
}

const meta: Meta = {
	title: "Patterns/Dashboard",
	parameters: { layout: "fullscreen", density: "app" },
};
export default meta;
export const Default: StoryObj = {
	render: () => (
		<AppFrame
			active="dashboard"
			crumbs={[{ label: "Workspace", href: "#" }, { label: "Overview" }]}
		>
			<Overview />
		</AppFrame>
	),
};
