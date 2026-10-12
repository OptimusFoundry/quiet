import { Avatar } from "../../../components/core/Avatar";
import { Badge } from "../../../components/core/Badge";
import { Button } from "../../../components/core/Button";
import { ButtonGroup } from "../../../components/core/ButtonGroup";
import { Headline } from "../../../components/core/Headline";
import { Icon } from "../../../components/core/Icon";
import { Link } from "../../../components/core/Link";
import { Skeleton } from "../../../components/core/Skeleton";
import { Spinner } from "../../../components/core/Spinner";
import { StatusDot } from "../../../components/core/StatusDot";
import { Tag } from "../../../components/core/Tag";
import { Text } from "../../../components/core/Text";
import type { Tile } from "./types";

export const tiles: Tile[] = [
	{
		name: "Button",
		blurb: "Dense pill actions: one accent primary per view, quiet secondaries.",
		render: () => (
			<div className="q-sb-tile-row">
				<Button size="sm">Save</Button>
				<Button size="sm" variant="secondary">
					Cancel
				</Button>
				<Button size="sm" variant="ghost" icon={<Icon name="more" />} aria-label="More" />
			</div>
		),
	},
	{
		name: "Text",
		blurb: "Body sizes, weights and inks, mono for IDs, truncation and clamps.",
		render: () => (
			<div className="q-sb-tile-stack">
				<Text weight="medium">Invoice paid</Text>
				<Text size="sm" color="muted">
					Settled 2 min ago
				</Text>
				<Text mono>inv_2026_0042</Text>
			</div>
		),
	},
	{
		name: "Icon",
		blurb: "Stroke icons on a 24 grid, sized in em to follow the text beside them.",
		render: () => (
			<div className="q-sb-tile-row">
				<Icon name="runs" size="lg" />
				<Icon name="approvals" size="lg" />
				<Icon name="file" size="lg" />
				<Icon name="search" size="lg" />
			</div>
		),
	},
	{
		name: "Badge",
		blurb: "Counts and statuses in a sans pill; status reads through the dot.",
		render: () => (
			<div className="q-sb-tile-row">
				<Badge variant="success">Passed</Badge>
				<Badge variant="error">Failed</Badge>
				<Badge count={12} variant="primary" />
			</div>
		),
	},
	{
		name: "Tag",
		blurb: "Small pills for categories and filters, selectable and removable.",
		render: () => (
			<div className="q-sb-tile-row">
				<Tag size="sm" selectable defaultSelected>
					Live
				</Tag>
				<Tag size="sm">Billing</Tag>
				<Tag size="sm" onRemove={() => {}}>
					nightly
				</Tag>
			</div>
		),
	},
	{
		name: "Link",
		blurb: "Inline text links in the accent ink, external ones marked.",
		render: () => (
			<Text size="sm">
				Read the <Link href="#billing">billing guide</Link> or the{" "}
				<Link href="https://example.com/api" external>
					API
				</Link>
				.
			</Text>
		),
	},
	{
		name: "Avatar",
		blurb: "People and workspaces: an image, initials or a fallback icon.",
		render: () => (
			<div className="q-sb-tile-row">
				<Avatar name="Ada Lovelace" />
				<Avatar name="Grace Hopper" />
				<Avatar name="Agentworks" shape="square" />
				<Avatar />
			</div>
		),
	},
	{
		name: "Headline",
		blurb: "Page and section titles at the display and heading steps.",
		render: () => <Headline size="h3" lead="Runs this week" />,
	},
	{
		name: "ButtonGroup",
		blurb: "Buttons spaced as a set, or attached into one segmented pill.",
		render: () => (
			<ButtonGroup attached label="Range">
				<Button variant="secondary" size="sm">
					Day
				</Button>
				<Button variant="secondary" size="sm">
					Week
				</Button>
				<Button variant="secondary" size="sm">
					Month
				</Button>
			</ButtonGroup>
		),
	},
	{
		name: "StatusDot",
		blurb: "A dot and a label for live, prototype or archived.",
		render: () => (
			<div className="q-sb-tile-stack">
				<StatusDot status="live" />
				<StatusDot status="prototype" />
				<StatusDot status="archived" />
			</div>
		),
	},
	{
		name: "Spinner",
		blurb: "A hairline ring for waits too short for a skeleton.",
		render: () => <Spinner size="sm" label="Starting runner" />,
	},
	{
		name: "Skeleton",
		blurb: "Slow-pulsing placeholders shaped like the content on its way.",
		render: () => (
			<div className="q-sb-tile-row">
				<Skeleton variant="circular" width={32} height={32} />
				<Skeleton lines={2} width={140} />
			</div>
		),
	},
];
