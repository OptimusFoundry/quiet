import { Button } from "../../../components/core/Button";
import { Icon } from "../../../components/core/Icon";
import { Alert } from "../../../components/feedback/Alert";
import { Banner } from "../../../components/feedback/Banner";
import { Progress } from "../../../components/feedback/Progress";
import { Toast } from "../../../components/feedback/Toast";
import { Tooltip } from "../../../components/feedback/Tooltip";
import type { Tile } from "./types";
import "../../components/feedback/Toast.scss";

// Dialog and Tooltip have no static open state (an open Dialog makes the page inert), so their
// tiles show the trigger. Toaster portals to <body>, so its tile shows the Toasts it stacks.
export const tiles: Tile[] = [
	{
		name: "Alert",
		blurb: "An in-flow message on its status ground, with an optional action.",
		render: () => (
			<Alert variant="warning" title="Two runners are near their budget.">
				Meerkat has used 84% this month.
			</Alert>
		),
	},
	{
		name: "Toast",
		blurb: "A short-lived notification that floats over the page.",
		render: () => (
			<Toast
				className="q-sb-toast--fit"
				variant="success"
				title="Invite sent"
				meta="leo@northwind.dev"
			/>
		),
	},
	{
		name: "Toaster",
		blurb: "The stack toast() raises toasts into: mount one, call it from anywhere.",
		render: () => (
			<div className="q-sb-tile-stack">
				<Toast className="q-sb-toast--fit" title="Draft saved" />
				<Toast className="q-sb-toast--fit" variant="error" title="Delivery failed" />
			</div>
		),
	},
	{
		name: "Dialog",
		blurb: "A modal for a decision that blocks the page: confirm, rename, approve.",
		render: () => (
			<Button size="sm" variant="secondary">
				Delete runner
			</Button>
		),
	},
	{
		name: "Progress",
		blurb: "A hairline bar for uploads, indexing and spend against a budget.",
		render: () => (
			<div className="q-sb-tile-stack">
				<Progress label="Uploading 3 artifacts" value={42} showValue />
				<Progress label="Import complete" value={100} variant="success" showValue />
			</div>
		),
	},
	{
		name: "Tooltip",
		blurb: "An ink label on hover or focus, mostly for icon-only buttons.",
		render: () => (
			<div className="q-sb-tile-row">
				<Tooltip content="Copies the run link">
					<Button size="sm" variant="secondary" leftIcon={<Icon name="link" />}>
						Copy link
					</Button>
				</Tooltip>
			</div>
		),
	},
	{
		name: "Banner",
		blurb: "A full-width strip above the app for page-level notices.",
		wide: true,
		render: () => (
			<Banner status="info" title="Scheduled maintenance." dismissible={false}>
				Sunday 02:00–03:00 UTC.
			</Banner>
		),
	},
];
