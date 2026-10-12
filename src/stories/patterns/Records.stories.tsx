import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";
import {
	Alert,
	Approval,
	Badge,
	Button,
	DecayingBadge,
	DropdownMenu,
	EmptyState,
	LineageChip,
	List,
	PageHeader,
	Pagination,
	Panel,
	StatCard,
	StatusDot,
	Table,
	type TableProps,
	Tabs,
	TextField,
	toast,
} from "../../index";
import { AppFrame, useNarrow } from "./AppFrame";
import "./Records.scss";

// Records — the reference kit's list-detail.html: a 360 list pane (search, status Tabs, selectable
// List) beside the detail. The detail shows where its numbers come from (LineageChip), how old its
// facts are (DecayingBadge), and gates a destructive bulk action behind an Approval.

type Status = "live" | "paused" | "draft";
const NOW = Date.UTC(2026, 9, 8, 12);
const HOUR = 3_600_000;
const CAMPAIGNS: {
	id: string;
	name: string;
	kind: string;
	status: Status;
	signups: number;
	bounce: number;
	checked: number;
}[] = [
	{
		id: "spring",
		name: "Spring waitlist",
		kind: "join.sjocamp.co",
		status: "live",
		signups: 1240,
		bounce: 2.1,
		checked: NOW - 2 * HOUR,
	},
	{
		id: "beta-eu",
		name: "Beta · EU",
		kind: "eu.sjocamp.co",
		status: "live",
		signups: 379,
		bounce: 6.4,
		checked: NOW - 30 * HOUR,
	},
	{
		id: "partners",
		name: "Partners",
		kind: "Invite only",
		status: "live",
		signups: 214,
		bounce: 1.2,
		checked: NOW - 50 * HOUR,
	},
	{
		id: "founding",
		name: "Founding members",
		kind: "join.sjocamp.co/founding",
		status: "paused",
		signups: 862,
		bounce: 3.4,
		checked: NOW - 90 * HOUR,
	},
	{
		id: "launch",
		name: "Launch day",
		kind: "Draft · not sent",
		status: "draft",
		signups: 0,
		bounce: 0,
		checked: NOW - 4 * HOUR,
	},
	{
		id: "press",
		name: "Press list",
		kind: "Invite only",
		status: "live",
		signups: 58,
		bounce: 0.0,
		checked: NOW - 6 * HOUR,
	},
];
const NAMES = [
	"Mira Osei",
	"Jon Takeda",
	"Sam Lee",
	"Kai Ito",
	"Noor Haddad",
	"Tomas Ruiz",
	"Ines Vidal",
	"Yuki Mori",
	"Ola Berg",
	"Ravi Shah",
	"Lena Vogt",
	"Ezra Cole",
];
const signupsFor = (c: (typeof CAMPAIGNS)[number]) =>
	Array.from({ length: Math.min(36, Math.max(0, Math.round(c.signups / 30))) }, (_, i) => {
		const n = NAMES[i % NAMES.length] ?? "Mira Osei";
		const state = i % 9 === 4 ? "Bounced" : i % 5 === 2 ? "Pending" : "Verified";
		return {
			id: `${c.id}-${i}`,
			name: i < NAMES.length ? n : `${n} ${Math.floor(i / NAMES.length) + 1}`,
			email: `${(n.split(" ")[0] ?? n).toLowerCase()}${i}@hey.com`,
			state,
			refs: (i * 7) % 11,
			when: `${(i % 9) + 1}d ago`,
		};
	});
const PAGE = 8;

type Signup = ReturnType<typeof signupsFor>[number];

function Detail({ campaign }: { campaign: (typeof CAMPAIGNS)[number] }) {
	const narrow = useNarrow();
	const rows = useMemo(() => signupsFor(campaign), [campaign]);
	const [page, setPage] = useState(1);
	const [selected, setSelected] = useState<string[]>([]);
	const [removed, setRemoved] = useState<string[]>([]);
	const [confirmed, setConfirmed] = useState(false);
	const live = rows.filter((r) => !removed.includes(r.id));
	const pages = Math.max(1, Math.ceil(live.length / PAGE));
	const shown = live.slice((page - 1) * PAGE, page * PAGE);
	const picked = live.filter((r) => selected.includes(r.id));
	const stale = campaign.id === "beta-eu";
	const lineage = (
		<LineageChip
			label={`Signups for ${campaign.name}`}
			freshness="4 min"
			steps={[
				{ id: "form", label: "Signup form", detail: "join.sjocamp.co · POST /signups" },
				{ id: "verify", label: "Email verification", detail: "Resend webhook", stale },
				{ id: "dedupe", label: "De-duplicate", detail: "by email, lowercase" },
				{
					id: "count",
					label: "Verified signups",
					detail: `${campaign.signups.toLocaleString("en-US")}`,
				},
			]}
		/>
	);
	const columns: TableProps<Signup>["columns"] = [
		{ key: "name", header: "Name", sortable: true },
		...(narrow ? [] : [{ key: "email", header: "Email" }]),
		{
			key: "state",
			header: "Status",
			render: (r) => (
				<Badge
					size="sm"
					variant={r.state === "Verified" ? "success" : r.state === "Pending" ? "warning" : "error"}
				>
					{r.state}
				</Badge>
			),
		},
		...(narrow ? [] : [{ key: "refs", header: "Referrals", align: "right" as const }]),
		{ key: "when", header: "Joined", align: "right", nowrap: true },
	];
	return (
		<div className="q-sb-app-frame__stack">
			<PageHeader
				eyebrow={campaign.kind}
				title={campaign.name}
				status={
					<>
						<Badge
							size="sm"
							variant={
								campaign.status === "live"
									? "success"
									: campaign.status === "paused"
										? "warning"
										: "secondary"
							}
						>
							{campaign.status}
						</Badge>
						<DecayingBadge
							size="sm"
							checkedAt={campaign.checked}
							now={NOW}
							onRecheck={() => toast({ title: "Domain re-checked.", meta: campaign.kind })}
						>
							Domain verified
						</DecayingBadge>
					</>
				}
				meta={[`${campaign.signups.toLocaleString("en-US")} signups`, stale ? null : lineage]}
				actions={
					<>
						<DropdownMenu
							size="sm"
							align="end"
							label="Campaign actions"
							trigger={
								<Button size="sm" variant="ghost" icon="…" aria-label="More campaign actions" />
							}
							items={[
								{ label: "Duplicate" },
								{ label: "Export CSV" },
								{ divider: true },
								{ label: "Archive", danger: true },
							]}
						/>
						<Button size="sm" variant="primary">
							Edit campaign
						</Button>
					</>
				}
			/>
			{stale && (
				<Alert variant="warning" title="Verified counts may be behind." action={lineage}>
					The Resend webhook hasn't reported for 30 hours, so new verifications aren't counted yet.
				</Alert>
			)}
			<div className="q-sb-records__stats">
				<StatCard variant="filled" label="Signups" value={campaign.signups} />
				<StatCard
					variant="filled"
					label="Bounce · 7d"
					value={`${campaign.bounce.toFixed(1)}%`}
					trend={campaign.bounce > 5 ? "down" : "neutral"}
					delta={campaign.bounce > 5 ? "above 5%" : "under 5%"}
				/>
				<StatCard variant="filled" label="Referrals" value={Math.round(campaign.signups * 0.18)} />
			</div>
			<Panel
				variant="plain"
				padding="none"
				title="Signups"
				count={live.length || undefined}
				description={
					live.length === 0
						? undefined
						: picked.length
							? `${picked.length} selected`
							: "Select rows to act on several at once."
				}
				empty="No signups yet. This campaign hasn't been sent; signups land here as they verify."
				footer={
					pages > 1 ? (
						<div className="q-sb-records__pager">
							<Pagination
								size="sm"
								page={page}
								total={pages}
								onChange={setPage}
								label="Signups pages"
							/>
						</div>
					) : undefined
				}
			>
				{live.length > 0 && (
					<Table<Signup>
						size="sm"
						label={`Signups for ${campaign.name}`}
						selectable
						selected={selected}
						onSelectionChange={(keys) => {
							setSelected(keys as string[]);
							setConfirmed(false);
						}}
						rowLabel={(r) => r.name}
						minWidth={narrow ? undefined : 560}
						columns={columns}
						data={shown}
					/>
				)}
			</Panel>
			{picked.length > 0 && (
				<Approval
					title={`Remove ${picked.length} signup${picked.length > 1 ? "s" : ""} from ${campaign.name}`}
					description="They stop getting campaign mail. Their verification history stays, so a re-signup is recognised."
					changes={picked
						.slice(0, 4)
						.map((r) => ({ label: r.name, before: r.state, after: "Removed", meta: r.email }))}
					consequences={[
						"Undo for 24 hours",
						`${picked.length} notice${picked.length > 1 ? "s" : ""} sent`,
					]}
					confirmLabel={`Remove ${picked.length}`}
					confirmedLabel="Removed · undo for 24h"
					confirmed={confirmed}
					onConfirm={() => {
						setConfirmed(true);
						setRemoved((r) => [...r, ...picked.map((p) => p.id)]);
						setSelected([]);
						toast({
							title: `${picked.length} removed.`,
							description: "Undo from the activity list for 24 hours.",
						});
					}}
					secondaryAction={
						<Button size="sm" variant="ghost" onClick={() => setSelected([])}>
							Clear selection
						</Button>
					}
				/>
			)}
		</div>
	);
}

function Records() {
	const narrow = useNarrow();
	const [selected, setSelected] = useState("beta-eu");
	const [filter, setFilter] = useState("all");
	const [q, setQ] = useState("");
	const count = (s: string) => CAMPAIGNS.filter((c) => s === "all" || c.status === s).length;
	const shown = CAMPAIGNS.filter(
		(c) =>
			(filter === "all" || c.status === filter) && c.name.toLowerCase().includes(q.toLowerCase()),
	);
	const campaign = (CAMPAIGNS.find((c) => c.id === selected) ??
		CAMPAIGNS[0]) as (typeof CAMPAIGNS)[number];
	return (
		<div className={narrow ? "q-sb-records q-sb-records--narrow" : "q-sb-records"}>
			<section
				aria-label="Campaigns"
				className="q-sb-app-frame__stack q-sb-app-frame__stack--stack q-sb-records__list"
			>
				<TextField
					label="Search campaigns"
					hideLabel
					size="sm"
					leftIcon="/"
					placeholder="Search campaigns"
					value={q}
					onChange={(e) => setQ(e.target.value)}
				/>
				<Tabs
					variant="enclosed"
					size="sm"
					label="Campaign status"
					value={filter}
					onChange={setFilter}
					tabs={[
						{ value: "all", label: "All", count: count("all") },
						{ value: "live", label: "Live", count: count("live") },
						{ value: "paused", label: "Paused", count: count("paused") },
						{ value: "draft", label: "Drafts", count: count("draft") },
					]}
				/>
				{shown.length ? (
					<List
						size="sm"
						items={shown.map((c) => ({
							id: c.id,
							primary: c.name,
							secondary: `${c.signups.toLocaleString("en-US")} signups · ${c.kind}`,
							selected: c.id === selected,
							onClick: () => setSelected(c.id),
							trailing: (
								<StatusDot
									status={
										c.status === "live" ? "live" : c.status === "paused" ? "archived" : "prototype"
									}
									label={c.status.charAt(0).toUpperCase() + c.status.slice(1)}
								/>
							),
						}))}
					/>
				) : (
					<EmptyState
						size="sm"
						icon="search"
						title="Nothing matches"
						description="Try another name, or clear the filter."
					/>
				)}
			</section>
			<section aria-label={`${campaign.name} detail`} className="q-sb-records__detail">
				<Detail key={campaign.id} campaign={campaign} />
			</section>
		</div>
	);
}

const meta: Meta = {
	title: "Patterns/Records",
	parameters: { layout: "fullscreen", density: "app" },
};
export default meta;
export const Default: StoryObj = {
	render: () => (
		<AppFrame
			active="records"
			padded={false}
			crumbs={[
				{ label: "Workspace", href: "#" },
				{ label: "Campaigns", href: "#" },
				{ label: "Beta · EU" },
			]}
		>
			<Records />
		</AppFrame>
	),
};
