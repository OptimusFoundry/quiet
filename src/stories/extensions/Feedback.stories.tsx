import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useState } from "react";
import { Alert, Banner, Button, Dialog, Progress, Toast, Tooltip } from "../../index";
import "./Feedback.scss";

// The feedback group in the one look: one shared close button and status icon, overlays on
// --q-shadow-float, sans sentence-case labels.
const meta: Meta = { title: "Extensions/Feedback", parameters: { layout: "fullscreen" } };
export default meta;

function Section({ title, children }: { title: string; children: ReactNode }) {
	return (
		<section className="q-sb-feedback__section">
			<h2 className="q-sb-feedback__title">{title}</h2>
			{children}
		</section>
	);
}

export const Statuses: StoryObj = {
	render: () => (
		<div className="q-sb-feedback">
			<Section title="Alert">
				<Alert title="Exports run nightly." onDismiss={() => {}}>
					The next one starts at 02:00 UTC.
				</Alert>
				<Alert variant="success" title="Domain verified." />
				<Alert
					variant="warning"
					title="Two runners are near their budget."
					action={
						<Button size="sm" variant="secondary">
							Review budgets
						</Button>
					}
				/>
				<Alert variant="error" title="Delivery failed." onDismiss={() => {}}>
					The webhook endpoint returned 502 three times.
				</Alert>
			</Section>
			<Section title="Toast">
				<div className="q-sb-feedback__stack">
					<Toast title="Draft saved" description="Your changes are stored." onClose={() => {}} />
					<Toast variant="success" title="Invite sent." meta="leo@sjocamp.co" onClose={() => {}} />
					<Toast variant="warning" title="Budget at 80%." meta="Meerkat · daily" />
					<Toast
						variant="error"
						title="Not sent"
						description="Retry in a minute."
						onClose={() => {}}
					/>
				</div>
			</Section>
			<Section title="Progress">
				<Progress label="Uploading 3 files" value={42} showValue />
				<Progress label="Import complete" value={100} variant="success" showValue />
				<Progress label="Indexing" indeterminate />
			</Section>
			<Section title="Tooltip">
				<div className="q-sb-feedback__row">
					<Tooltip content="Copies the run link">
						<Button variant="secondary">Hover or focus me</Button>
					</Tooltip>
					<Tooltip content="Shown below" placement="bottom">
						<Button variant="secondary">Bottom</Button>
					</Tooltip>
				</div>
			</Section>
		</div>
	),
};

export const Banners: StoryObj = {
	render: () => (
		<div>
			<Banner title="Scheduled maintenance." status="info">
				Sunday 02:00–03:00 UTC.
			</Banner>
			<Banner title="Payment received." status="success" />
			<Banner
				title="Trial ends in 3 days."
				status="warning"
				action={
					<Button size="sm" variant="secondary">
						Pick a plan
					</Button>
				}
			/>
			<Banner title="You're offline." status="error" dismissible={false}>
				Changes will sync when you reconnect.
			</Banner>
		</div>
	),
};

function DialogDemo({ icon, startOpen }: { icon?: "warning" | "success"; startOpen?: boolean }) {
	const [open, setOpen] = useState(!!startOpen);
	return (
		<div className="q-sb-feedback">
			<div className="q-sb-feedback__row">
				<Button variant="secondary" onClick={() => setOpen(true)}>
					Open dialog
				</Button>
			</div>
			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				icon={icon}
				eyebrow="Runner · Meerkat"
				title="Delete this runner?"
				actions={
					<>
						<Button variant="ghost" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={() => setOpen(false)}>
							Delete runner
						</Button>
					</>
				}
			>
				Its schedule and history go with it. Runs in progress finish first.
			</Dialog>
		</div>
	);
}

export const DialogPlain: StoryObj = { render: () => <DialogDemo startOpen /> };
export const DialogWithStatusIcon: StoryObj = {
	render: () => <DialogDemo icon="warning" startOpen />,
};
