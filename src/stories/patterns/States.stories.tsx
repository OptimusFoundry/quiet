import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import {
	Alert,
	Banner,
	Button,
	Col,
	DecayingBadge,
	EmptyState,
	GhostFuture,
	Grid,
	List,
	PageHero,
	SectionHeader,
	Skeleton,
	StatCard,
	Table,
	Text,
	toast,
} from "../../index";
import { AppFrame, row, stack } from "./AppFrame";

// States — the four states every data surface needs, on one page: loading keeps the layout's
// shape (Skeleton, Table loading), empty says what will arrive (EmptyState, GhostFuture), error
// says what failed and offers one retry, and offline/partial shows what is stale instead of hiding it.

const NOW = Date.UTC(2026, 9, 8, 12);
const COLUMNS = [
	{ key: "name", header: "Campaign" },
	{ key: "signups", header: "Signups", align: "right" as const },
	{ key: "bounce", header: "Bounce", align: "right" as const },
];
const ROWS = [
	{ id: 1, name: "Spring waitlist", signups: "1,240", bounce: "2.1%" },
	{ id: 2, name: "Beta · EU", signups: "379", bounce: "6.4%" },
	{ id: 3, name: "Partners", signups: "214", bounce: "1.2%" },
];

function Loading() {
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		if (!loading) return;
		const t = setTimeout(() => setLoading(false), 1600);
		return () => clearTimeout(t);
	}, [loading]);
	return (
		<section aria-labelledby="loading-h" style={stack("var(--q-space-stack)")}>
			<SectionHeader
				size="sm"
				as="h2"
				title={<span id="loading-h">Loading</span>}
				description="Hold the layout's shape. Never a spinner over an empty page."
				actions={
					<Button size="sm" variant="ghost" onClick={() => setLoading(true)}>
						Load again
					</Button>
				}
			/>
			<Grid columns={12} gap="md">
				{["Verified signups", "MRR", "Bounce rate"].map((label, i) => (
					<Col key={label} span={4}>
						<Skeleton
							variant="rounded"
							height={112}
							loading={loading}
							label={i === 0 ? "Loading stats" : undefined}
						>
							<StatCard label={label} value={["4,812", "$13.2k", "3.1%"][i] ?? ""} />
						</Skeleton>
					</Col>
				))}
			</Grid>
			<Table
				size="sm"
				label="Campaigns"
				loading={loading}
				loadingRows={3}
				columns={COLUMNS}
				data={ROWS}
			/>
		</section>
	);
}

function Empty() {
	const [rows, setRows] = useState<string[]>([]);
	return (
		<section aria-labelledby="empty-h" style={stack("var(--q-space-stack)")}>
			<SectionHeader
				size="sm"
				as="h2"
				title={<span id="empty-h">Empty</span>}
				description="Say what will arrive and how to start it. A first-run list can show its likely future."
			/>
			<Grid columns={12} gap="md">
				<Col span={6}>
					<EmptyState
						size="sm"
						bordered
						title="No campaigns yet"
						description="A campaign is a signup page plus the emails that follow it. Most teams start with a waitlist."
						actions={
							<Button size="sm" arrow>
								New campaign
							</Button>
						}
					/>
				</Col>
				<Col span={6}>
					<div style={stack("var(--q-space-stack)")}>
						<GhostFuture
							caption="Dashed rows are what the first fortnight looked like for 40 similar waitlists. They fold away as real signups arrive."
							ghosts={[
								{ label: "Someone from your launch post", hint: "within an hour" },
								{ label: "Your first referral", hint: "day 3" },
								{ label: "A bounced address", hint: "day 4, auto-removed" },
							]}
						>
							{rows.length > 0 && (
								<List
									size="sm"
									items={rows.map((r) => ({
										id: r,
										primary: r,
										secondary: "Verified",
										trailing: "now",
									}))}
								/>
							)}
						</GhostFuture>
						<div style={row()}>
							<Button
								size="sm"
								variant="secondary"
								onClick={() =>
									setRows((r) => [
										...r,
										["Mira Osei", "Jon Takeda", "Sam Lee"][r.length % 3] ?? "Mira Osei",
									])
								}
							>
								Add a signup
							</Button>
						</div>
					</div>
				</Col>
			</Grid>
		</section>
	);
}

function Failed() {
	const [state, setState] = useState<"error" | "retrying" | "ok">("error");
	useEffect(() => {
		if (state !== "retrying") return;
		const t = setTimeout(() => {
			setState("ok");
			toast({ status: "success", title: "Campaigns loaded." });
		}, 1200);
		return () => clearTimeout(t);
	}, [state]);
	return (
		<section aria-labelledby="error-h" style={stack("var(--q-space-stack)")}>
			<SectionHeader
				size="sm"
				as="h2"
				title={<span id="error-h">Error</span>}
				description="Name what failed, keep what still works, and offer one way forward."
			/>
			{state === "ok" ? (
				<Table size="sm" label="Campaigns, loaded" columns={COLUMNS} data={ROWS} />
			) : (
				<Alert
					variant="error"
					title="Campaigns didn't load."
					action={
						<Button
							size="sm"
							variant="secondary"
							loading={state === "retrying"}
							onClick={() => setState("retrying")}
						>
							Try again
						</Button>
					}
				>
					The signups service timed out after 10 seconds. Your data is safe; nothing was changed.
				</Alert>
			)}
		</section>
	);
}

function Partial() {
	return (
		<section aria-labelledby="offline-h" style={stack("var(--q-space-stack)")}>
			<SectionHeader
				size="sm"
				as="h2"
				title={<span id="offline-h">Offline and partial</span>}
				description="Show the last known values and how old they are. Don't blank the page."
			/>
			<Banner variant="paper" status="warning" title="You're offline." label="Connection">
				Showing what we had at 11:40. Changes you make now sync when you're back.
			</Banner>
			<Grid columns={12} gap="md">
				<Col span={6}>
					<div style={stack("var(--q-space-inline)")}>
						<StatCard label="Verified signups" value="4,812" period="as of 11:40" />
						<div>
							<DecayingBadge checkedAt={NOW - 20 * 60_000} now={NOW}>
								Synced
							</DecayingBadge>
						</div>
					</div>
				</Col>
				<Col span={6}>
					<div style={stack("var(--q-space-inline)")}>
						<StatCard label="Bounce rate" value="—" period="not loaded" />
						<Text size="sm" color="muted">
							The analytics service didn't answer. Signups above are still current.
						</Text>
					</div>
				</Col>
			</Grid>
		</section>
	);
}

const meta: Meta = { title: "Patterns/States", parameters: { layout: "fullscreen" } };
export default meta;
export const Default: StoryObj = {
	render: () => (
		<AppFrame active="dashboard" crumbs={[{ label: "Patterns", href: "#" }, { label: "States" }]}>
			<PageHero
				size="md"
				ruled={false}
				style={{ padding: 0 }}
				title="States"
				description="Loading, empty, error, and offline — the same four on every list, card and chart."
			/>
			<Loading />
			<Empty />
			<Failed />
			<Partial />
		</AppFrame>
	),
};
