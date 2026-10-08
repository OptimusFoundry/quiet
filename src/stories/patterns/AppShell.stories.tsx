import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	Alert,
	ArrowLink,
	Button,
	Card,
	Col,
	Grid,
	List,
	NavBar,
	PageHero,
	PageShell,
	SectionHeader,
	Text,
} from "../../index";
import { AppFrame } from "./AppFrame";
import "./AppShell.scss";

// App shell — the frame every signed-in screen sits in, and the public-page frame beside it.
// Signed in: Sidebar (240) + top bar (64: breadcrumb, ⌘K search, account) + main at density "app".
// Public (signed out, docs, status, changelog): NavBar + PageShell at density "marketing".

const REGIONS = [
	{
		primary: "Sidebar",
		secondary: "--q-w-sidebar · 240. Wordmark, grouped nav, account. Sticky, full height.",
		trailing: "nav",
	},
	{
		primary: "Top bar",
		secondary: "--q-h-topbar · 64. Breadcrumb, Search (⌘K), account menu. Sticky.",
		trailing: "header",
	},
	{
		primary: "Main",
		secondary:
			"--q-w-max wide, --q-space-page-x gutters, --q-space-section top. Sections stack at --q-space-block.",
		trailing: "main",
	},
	{
		primary: "Page title",
		secondary: "One PageHero size md per screen, unruled. Section heads are SectionHeader size sm.",
		trailing: "h1",
	},
	{
		primary: "Toasts",
		secondary:
			"Bottom right, at most three, gone in 4s (errors 6s). Only for the user's own actions.",
		trailing: "status",
	},
];

function Shell() {
	return (
		<>
			<PageHero
				size="md"
				ruled={false}
				className="q-sb-app-frame__hero"
				title="Your"
				accent="workspace"
				description="Every signed-in screen uses this frame. Pages only fill the main column; they never bring their own header or navigation."
				actions={
					<Button size="sm" variant="secondary" href="?path=/story/patterns-dashboard--default">
						See a dashboard
					</Button>
				}
			/>
			<Grid columns={12} gap="md">
				<Col span={7}>
					<div className="q-sb-app-frame__stack q-sb-app-frame__stack--stack">
						<SectionHeader size="sm" as="h2" title="Anatomy" />
						<List size="sm" items={REGIONS} />
					</div>
				</Col>
				<Col span={5}>
					<div className="q-sb-app-frame__stack q-sb-app-frame__stack--stack">
						<SectionHeader size="sm" as="h2" title="On a phone" />
						<Alert variant="info" title="Under 720px the sidebar leaves the grid.">
							Sidebar becomes its own drawer (SidebarProvider + SidebarTrigger in the top bar), the
							breadcrumb keeps only the current page, and Search drops its shortcut hint. Every Col
							stacks to full width.
						</Alert>
						<Text size="sm" color="muted">
							Two-pane pages (list and detail, chat and its side panel) stack the list above the
							detail, or move the side panel into a drawer.
						</Text>
					</div>
				</Col>
			</Grid>
			<div className="q-sb-app-frame__stack q-sb-app-frame__stack--stack">
				<SectionHeader
					size="sm"
					as="h2"
					title="Public pages"
					description="Status, changelog, docs and sign-in use the site frame: NavBar on top, PageShell for columns, marketing density."
				/>
				<div data-density="marketing" className="q-sb-app-shell__public">
					<NavBar
						label="Public site"
						homeLabel="Sjocamp home"
						links={[
							{ label: "Changelog", href: "#", current: true },
							{ label: "Status", href: "#" },
							{ label: "Docs", href: "#" },
						]}
						cta="Sign in"
						ctaHref="#"
					/>
					<PageShell
						layout="sidebar"
						header={
							<PageHero
								size="md"
								as="h2"
								eyebrow="Changelog"
								title="October"
								accent="2026"
								ruled={false}
							/>
						}
					>
						<List
							size="sm"
							items={[
								{ primary: "Oct 8", secondary: "Weekly brief" },
								{ primary: "Oct 1", secondary: "Agent caps" },
								{ primary: "Sep 24", secondary: "Referral links" },
							]}
						/>
						<Card
							eyebrow="Oct 8"
							title="The weekly brief"
							footer={<ArrowLink href="#">Read the note</ArrowLink>}
						>
							Every Monday at 08:00, one email with what moved, what Meerkat did, and what it's
							waiting on.
						</Card>
					</PageShell>
				</div>
			</div>
		</>
	);
}

const meta: Meta = { title: "Patterns/App shell", parameters: { layout: "fullscreen" } };
export default meta;
export const Default: StoryObj = {
	render: () => (
		<AppFrame
			active="dashboard"
			crumbs={[{ label: "Workspace", href: "#" }, { label: "Overview" }]}
		>
			<Shell />
		</AppFrame>
	),
};
