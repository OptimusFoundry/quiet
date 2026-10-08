import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
	Avatar,
	Button,
	ButtonGroup,
	Checkbox,
	HoldButton,
	PageHero,
	ScopeGrant,
	SectionHeader,
	Select,
	Sidebar,
	Switch,
	Text,
	TextField,
	toast,
} from "../../index";
import { AppFrame, row, stack, useNarrow } from "./AppFrame";

// Settings — the reference kit's settings.html: a 200 sticky section nav + a 640 form column,
// sections separated by --q-space-section, Switch rows on hairlines, and the danger zone in a
// molten hairline box. Agent permissions are a ScopeGrant; the destructive step is a HoldButton.

const SECTIONS = [
	{ label: "Profile", value: "profile" },
	{ label: "Notifications", value: "notifications" },
	{ label: "Meerkat", value: "agent" },
	{ label: "Danger zone", value: "danger" },
];
const section = {
	...stack("var(--q-space-field)"),
	scrollMarginTop: "calc(var(--q-h-topbar) + var(--q-space-stack))",
};

function SettingsPage() {
	const narrow = useNarrow();
	const [current, setCurrent] = useState("profile");
	const [deleted, setDeleted] = useState(false);
	const go = (v: string) => {
		setCurrent(v);
		document.getElementById(v)?.scrollIntoView({ behavior: "smooth", block: "start" });
	};
	return (
		<>
			<PageHero
				size="md"
				ruled={false}
				style={{ padding: 0 }}
				title="Settings"
				description="Your profile, what reaches your inbox, and what Meerkat may do alone. Each section saves on its own."
			/>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: narrow
						? "minmax(0, 1fr)"
						: "var(--q-w-settings-nav) minmax(0, var(--q-w-form))",
					gap: "var(--q-space-block)",
					alignItems: "start",
				}}
			>
				{!narrow && (
					<Sidebar
						compact
						label="Settings sections"
						width={200}
						items={SECTIONS}
						value={current}
						onChange={go}
						style={{
							position: "sticky",
							top: "calc(var(--q-h-topbar) + var(--q-space-stack))",
							border: 0,
							padding: 0,
						}}
					/>
				)}
				<div style={stack("var(--q-space-section)")}>
					<section id="profile" aria-labelledby="profile-h" style={section}>
						<SectionHeader
							size="sm"
							as="h2"
							title={<span id="profile-h">Profile</span>}
							description="How you appear to your team and on invoices."
						/>
						<div style={row("var(--q-space-stack)")}>
							<Avatar name="Ada Park" size="sm" />
							<ButtonGroup>
								<Button size="sm" variant="secondary">
									Upload photo
								</Button>
								<Button size="sm" variant="ghost">
									Remove
								</Button>
							</ButtonGroup>
						</div>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: narrow ? "minmax(0, 1fr)" : "repeat(2, minmax(0, 1fr))",
								gap: "var(--q-space-field)",
							}}
						>
							<TextField size="sm" label="First name" defaultValue="Ada" />
							<TextField size="sm" label="Last name" defaultValue="Park" />
						</div>
						<TextField
							size="sm"
							label="Email"
							type="email"
							defaultValue="ada@sjocamp.co"
							helperText="Campaign reports and invoices go here."
							required
						/>
						<Select
							size="sm"
							label="Time zone"
							defaultValue="cet"
							options={[
								{ value: "cet", label: "Stockholm · CET (UTC+01:00)" },
								{ value: "est", label: "Ottawa · EST (UTC−05:00)" },
								{ value: "utc", label: "UTC" },
							]}
						/>
						<div style={{ ...row("var(--q-space-stack)"), justifyContent: "flex-end" }}>
							<Button size="sm" variant="secondary">
								Cancel
							</Button>
							<Button
								size="sm"
								onClick={() => toast({ status: "success", title: "Profile saved." })}
							>
								Save profile
							</Button>
						</div>
					</section>

					<section id="notifications" aria-labelledby="notifications-h" style={section}>
						<SectionHeader
							size="sm"
							as="h2"
							title={<span id="notifications-h">Notifications</span>}
							description="Email only. Nothing promotional."
						/>
						<div style={{ display: "flex", flexDirection: "column" }}>
							{(
								[
									["Campaign bounces", "When a campaign passes 5% bounces.", true],
									["Weekly brief", "One email, Mondays at 08:00.", true],
									["Meerkat's posts", "A copy of everything Meerkat posts for you.", false],
								] as const
							).map(([label, description, on], i) => (
								<div
									key={label}
									style={{
										padding: "var(--q-space-stack) 0",
										borderTop: `var(--q-hairline) solid ${i ? "var(--q-border)" : "var(--q-fg)"}`,
									}}
								>
									<Switch
										size="sm"
										label={label}
										description={description}
										defaultChecked={on}
										labelPosition="left"
										style={{ width: "100%" }}
									/>
								</div>
							))}
						</div>
						<Checkbox
							size="sm"
							label="Include teammates' campaigns in the brief"
							description="Leo and Mira run four of the fourteen."
							defaultChecked
						/>
					</section>

					<section id="agent" aria-labelledby="agent-h" style={section}>
						<SectionHeader
							size="sm"
							as="h2"
							title={<span id="agent-h">Meerkat</span>}
							description="What the agent may do without asking. You can change this any time; it applies from the next run."
						/>
						<ScopeGrant
							agent={<Avatar name="Meerkat" size="sm" shape="square" />}
							title="Let Meerkat act for you"
							caption="Anything left off, Meerkat asks first."
							scopes={[
								{
									id: "read",
									label: "Read campaigns and signups",
									short: "read",
									defaultGranted: true,
								},
								{
									id: "draft",
									label: "Draft posts and notices",
									short: "draft",
									defaultGranted: true,
								},
								{
									id: "pause",
									label: "Pause a bouncing campaign",
									short: "pause",
									description: "Only above 5% bounces, and only for 24 hours.",
									asks: true,
								},
								{ id: "publish", label: "Publish posts", short: "publish", asks: true },
								{ id: "billing", label: "Change billing", short: "billing" },
							]}
							durations={[
								{ value: "today", label: "Today", expires: "at midnight" },
								{ value: "week", label: "This week", expires: "on Sunday" },
								{ value: "always", label: "Until I change it" },
							]}
							defaultDuration="week"
							onGrant={() => toast({ title: "Meerkat's access updated." })}
						/>
					</section>

					<section id="danger" aria-labelledby="danger-h" style={section}>
						<SectionHeader size="sm" as="h2" title={<span id="danger-h">Danger zone</span>} />
						<div
							style={{
								...row("var(--q-space-stack)"),
								padding: "var(--q-space-card-pad)",
								border: "var(--q-hairline) solid var(--q-accent)",
								borderRadius: "var(--q-radius-lg)",
							}}
						>
							<div style={{ ...stack("var(--q-space-0-5)"), flex: "1 1 240px" }}>
								<Text color="heading" weight="semibold">
									Delete workspace
								</Text>
								<Text size="sm" color="muted">
									Removes 14 campaigns, 4,812 signups and every invoice. It can't be undone.
								</Text>
							</div>
							<HoldButton
								size="sm"
								variant="destructive"
								hint="Hold to delete the workspace"
								confirmed={deleted}
								confirmedLabel="Scheduled · 7 days to cancel"
								onConfirm={() => {
									setDeleted(true);
									toast({
										status: "error",
										title: "Workspace scheduled for deletion.",
										description: "Cancel from this page within 7 days.",
									});
								}}
							>
								Delete workspace
							</HoldButton>
						</div>
					</section>
				</div>
			</div>
		</>
	);
}

const meta: Meta = { title: "Patterns/Settings", parameters: { layout: "fullscreen" } };
export default meta;
export const Default: StoryObj = {
	render: () => (
		<AppFrame active="settings" crumbs={[{ label: "Account", href: "#" }, { label: "Settings" }]}>
			<SettingsPage />
		</AppFrame>
	),
};
