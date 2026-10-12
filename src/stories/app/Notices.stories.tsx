import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useState } from "react";
import { NoticeChip } from "../../components/app/NoticeChip";
import { ShellNotice } from "../../components/app/ShellNotice";
import { SidebarNotice } from "../../components/app/SidebarNotice";
import { TopBar } from "../../components/app/TopBar";
import { Link } from "../../components/core/Link";
import "./Notices.scss";

// App/Notices — conditions that hold until something changes, placed by urgency. In a screen they
// sit in the frame: Patterns/App shell, "With notices".

const meta = {
	title: "App/Notices",
	parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;

function Section({
	id,
	title,
	note,
	children,
}: {
	id: string;
	title: string;
	note: string;
	children: ReactNode;
}) {
	return (
		<section id={id} className="q-sb-notices__section" aria-labelledby={`${id}-title`}>
			<h2 id={`${id}-title`} className="q-sb-notices__title">
				{title}
			</h2>
			<p className="q-sb-notices__note">{note}</p>
			{children}
		</section>
	);
}

function Dismissible() {
	const [shown, setShown] = useState(true);
	return shown ? (
		<ShellNotice tone="info" onDismiss={() => setShown(false)}>
			Scheduled maintenance tonight, 23:00 to 23:30 UTC. Sends queue and go out after.
		</ShellNotice>
	) : (
		<button type="button" className="q-sb-notices__reset" onClick={() => setShown(true)}>
			Show it again
		</button>
	);
}

function Notices() {
	return (
		<div className="q-sb-notices">
			<Section
				id="shell"
				title="ShellNotice: urgent, workspace-wide"
				note="One line on the canvas above the panel (AppShell notice). At most one; no close button while the condition holds."
			>
				<div className="q-sb-notices__canvas">
					<ShellNotice action={<Link href="#">Update billing</Link>}>
						Your card was declined, so campaigns pause on Oct 15.
					</ShellNotice>
					<ShellNotice tone="info" action={<Link href="#">Stop viewing</Link>}>
						You're viewing Sjocamp as Ada Park.
					</ShellNotice>
					<Dismissible />
				</div>
			</Section>
			<Section
				id="sidebar"
				title="SidebarNotice: a slow nudge"
				note="A card at the Sidebar's foot, above the account. Dismissible. In the collapsed rail, an icon with a mark."
			>
				<div className="q-sb-notices__canvas q-sb-notices__rail">
					<div className="q-sb-notices__sidebar">
						<SidebarNotice
							title="Trial: 3 days left"
							progress={0.78}
							progressLabel="Trial used"
							action={{ label: "Choose a plan", href: "#" }}
							onDismiss={() => {}}
						/>
					</div>
					<div className="q-sb-notices__sidebar">
						<SidebarNotice
							title="Usage at 82%"
							description="8,200 of 10,000 sends this month."
							progress={0.82}
							action={{ label: "See usage", onClick: () => {} }}
						/>
					</div>
					<SidebarNotice
						collapsed
						title="Trial: 3 days left"
						action={{ label: "Choose a plan", href: "#" }}
					/>
				</div>
			</Section>
			<Section
				id="chip"
				title="NoticeChip: about this page"
				note="A pill in the TopBar that opens the details in the third pane. In a narrow bar only its mark shows."
			>
				<div className="q-sb-notices__bars">
					<TopBar
						crumbs={[{ label: "Campaigns", href: "#" }, { label: "Spring waitlist" }]}
						actions={<NoticeChip aria-expanded={false}>Campaign paused</NoticeChip>}
					/>
					<TopBar
						crumbs={[{ label: "Settings", href: "#" }, { label: "Domains" }]}
						actions={<NoticeChip tone="info">DNS check pending</NoticeChip>}
					/>
					<div className="q-sb-notices__narrow">
						<TopBar
							crumbs={[{ label: "Campaigns", href: "#" }, { label: "Spring waitlist" }]}
							actions={<NoticeChip>Campaign paused</NoticeChip>}
						/>
					</div>
				</div>
			</Section>
		</div>
	);
}

export const All: StoryObj = { render: () => <Notices /> };
