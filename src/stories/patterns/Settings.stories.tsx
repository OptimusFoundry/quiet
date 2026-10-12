import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
	Avatar,
	Button,
	ButtonGroup,
	Checkbox,
	HoldButton,
	PageHeader,
	Panel,
	ScopeGrant,
	Select,
	Sidebar,
	Switch,
	Text,
	TextField,
	toast,
} from "../../index";
import { AppFrame, useNarrow } from "./AppFrame";
import "./Settings.scss";

// Settings — the reference kit's settings.html in the app look: a PageHeader, a 200 sticky section
// nav + a 640 form column of surface Panels, --q-space-section apart; Switch rows on hairlines inside
// their Panel, and the danger zone last in an outlined Panel with an error edge. Agent permissions
// are a ScopeGrant (already granted, so its action is a secondary Update and Save profile stays the
// one primary); the destructive step is a HoldButton.

const SECTIONS = [
	{ label: "Profile", value: "profile" },
	{ label: "Notifications", value: "notifications" },
	{ label: "Meerkat", value: "agent" },
	{ label: "Danger zone", value: "danger" },
];
const section = "q-sb-settings__section";

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
			<PageHeader
				title="Settings"
				description="Your profile, what reaches your inbox, and what Meerkat may do alone. Each section saves on its own."
			/>
			<div className={narrow ? "q-sb-settings q-sb-settings--narrow" : "q-sb-settings"}>
				{!narrow && (
					<Sidebar
						compact
						label="Settings sections"
						width={200}
						items={SECTIONS}
						value={current}
						onChange={go}
						className="q-sb-settings__nav"
					/>
				)}
				<div className="q-sb-app-frame__stack q-sb-app-frame__stack--section">
					<Panel
						id="profile"
						className={section}
						title="Profile"
						description="How you appear to your team and on invoices."
					>
						<div className="q-sb-app-frame__stack q-sb-app-frame__stack--field">
							<div className="q-sb-app-frame__row q-sb-app-frame__row--stack">
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
								className={
									narrow
										? "q-sb-settings__names q-sb-settings__names--narrow"
										: "q-sb-settings__names"
								}
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
							<div className="q-sb-app-frame__row q-sb-app-frame__row--stack q-sb-settings__actions">
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
						</div>
					</Panel>

					<Panel
						id="notifications"
						className={section}
						title="Notifications"
						description="Email only. Nothing promotional. Switches apply at once."
					>
						<div className="q-sb-app-frame__stack q-sb-app-frame__stack--field">
							<div className="q-sb-settings__notices">
								{(
									[
										["Campaign bounces", "When a campaign passes 5% bounces.", true],
										["Weekly brief", "One email, Mondays at 08:00.", true],
										["Meerkat's posts", "A copy of everything Meerkat posts for you.", false],
									] as const
								).map(([label, description, on]) => (
									<div key={label} className="q-sb-settings__notice">
										<Switch
											size="sm"
											label={label}
											description={description}
											defaultChecked={on}
											labelPosition="left"
											className="q-sb-settings__switch"
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
						</div>
					</Panel>

					<Panel
						id="agent"
						className={section}
						title="Meerkat"
						description="What the agent may do without asking. You can change this any time; it applies from the next run."
					>
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
							granted
							onGrant={() => toast({ title: "Meerkat's access updated." })}
						/>
					</Panel>

					<Panel
						id="danger"
						variant="outlined"
						className={`${section} q-sb-settings__danger`}
						title="Danger zone"
					>
						<div className="q-sb-app-frame__row q-sb-app-frame__row--stack">
							<div className="q-sb-settings__danger-text">
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
					</Panel>
				</div>
			</div>
		</>
	);
}

const meta: Meta = {
	title: "Patterns/Settings",
	parameters: { layout: "fullscreen", density: "app" },
};
export default meta;
export const Default: StoryObj = {
	render: () => (
		<AppFrame active="settings" crumbs={[{ label: "Account", href: "#" }, { label: "Settings" }]}>
			<SettingsPage />
		</AppFrame>
	),
};
