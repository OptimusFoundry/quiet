import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { AccountMenu } from "../../components/app/AccountMenu";
import { AppIcon } from "../../components/app/AppIcon";
import { TopBar } from "../../components/app/TopBar";
import { WorkspaceSwitcher } from "../../components/app/WorkspaceSwitcher";
import { Button } from "../../components/core/Button";
import { ICONS, type IconName } from "../../components/core/icons";
import "./AppShell.scss";

// The app frame's parts on their own: the icon set, the sidebar head and foot, the TopBar.
// The whole frame (AppShell with sidebar, TopBar and the notifications pane) is Patterns/Dashboard.

function Demo({ id, label, children }: { id: string; label: string; children: ReactNode }) {
	return (
		<section id={id} aria-label={label} className="q-sb-app-shell__demo">
			<div className="q-sb-app-shell__label">{label}</div>
			{children}
		</section>
	);
}

function AppShellParts() {
	return (
		<main className="q-sb-app-shell">
			<Demo id="app-icon" label="AppIcon: the set (md 16)">
				<ul className="q-sb-app-shell__icons">
					{(Object.keys(ICONS) as IconName[]).map((n) => (
						<li key={n} className="q-sb-app-shell__icon">
							<AppIcon name={n} size="lg" />
							<span>{n}</span>
						</li>
					))}
				</ul>
			</Demo>
			<Demo id="sidebar-parts" label="WorkspaceSwitcher and AccountMenu, on the canvas">
				<div className="q-sb-app-shell__canvas">
					<WorkspaceSwitcher
						name="Sjocamp"
						detail="Growth plan"
						items={[
							{ group: "Workspaces" },
							{ label: "Sjocamp", active: true, icon: <AppIcon name="check" size="sm" /> },
							{ label: "Optimus Foundry", icon: <span /> },
							{ divider: true },
							{ label: "New workspace", icon: <AppIcon name="plus" size="sm" /> },
						]}
					/>
					<div className="q-sb-app-shell__spacer" />
					<AccountMenu
						name="Ada Park"
						detail="ada@sjocamp.com"
						items={[
							{ label: "Profile", icon: <AppIcon name="user" size="sm" /> },
							{ divider: true },
							{ label: "Sign out", icon: <AppIcon name="sign-out" size="sm" /> },
						]}
					/>
				</div>
			</Demo>
			<Demo id="top-bar" label="TopBar: breadcrumb, or a title, and actions">
				<div className="q-sb-app-shell__frame">
					<TopBar
						crumbs={[{ label: "Campaigns", href: "#" }, { label: "Spring waitlist" }]}
						actions={
							<>
								<Button
									size="sm"
									variant="ghost"
									icon={<AppIcon name="bell" />}
									aria-label="Notifications"
								/>
								<Button size="sm" variant="primary">
									New campaign
								</Button>
							</>
						}
					/>
				</div>
				<div className="q-sb-app-shell__frame">
					<TopBar title="Settings" />
				</div>
			</Demo>
		</main>
	);
}

const meta: Meta = { title: "App/AppShell", parameters: { layout: "fullscreen" } };
export default meta;
export const Parts: StoryObj = { render: () => <AppShellParts /> };
