import { Badge } from "../../../components/core/Badge";
import { Button } from "../../../components/core/Button";
import { Text } from "../../../components/core/Text";
import { AspectRatio } from "../../../components/layout/AspectRatio";
import { Col } from "../../../components/layout/Col";
import { Grid } from "../../../components/layout/Grid";
import { PageTransition } from "../../../components/layout/PageTransition";
import { Stack } from "../../../components/layout/Stack";
import type { Tile } from "./types";

export const tiles: Tile[] = [
	{
		name: "Stack",
		blurb: "Rows and columns on the 8px scale; switches direction by its container's width.",
		render: () => (
			<Stack gap="xs" align="center">
				<Text size="sm" color="heading">
					Invoice 2026-0412
				</Text>
				<Stack direction="row" gap="xs">
					<Button size="sm" variant="secondary">
						Download
					</Button>
					<Button size="sm">Approve</Button>
				</Stack>
			</Stack>
		),
	},
	{
		name: "Grid",
		blurb: "Fixed or auto-fit columns that reflow by their own width, not the viewport.",
		render: () => (
			<div className="q-sb-tile-stack">
				<Grid columns={3} gap="xs" rowGap="xs">
					<Badge>Queued</Badge>
					<Badge>Running</Badge>
					<Badge>Passed</Badge>
					<Badge>Failed</Badge>
					<Badge>Skipped</Badge>
					<Badge>Waiting</Badge>
				</Grid>
			</div>
		),
	},
	{
		name: "Col",
		blurb: "One cell of a 12-column Grid, with spans for each width band.",
		render: () => (
			<div className="q-sb-tile-stack">
				<Grid columns={12} gap="xs">
					<Col span={8} spanSm={8}>
						<AspectRatio ratio={3} label="span 8" />
					</Col>
					<Col span={4} spanSm={4}>
						<AspectRatio ratio={1.5} label="span 4" />
					</Col>
				</Grid>
			</div>
		),
	},
	{
		name: "AspectRatio",
		blurb: "A fixed-ratio frame for media, or a labelled placeholder.",
		render: () => (
			<div className="q-sb-tile-stack">
				<Grid columns={3} gap="xs" align="center">
					<AspectRatio ratio="square" label="1:1" />
					<AspectRatio ratio="photo" label="4:3" />
					<AspectRatio ratio="video" label="16:9" />
				</Grid>
			</div>
		),
	},
	{
		name: "PageTransition",
		blurb: "A slow, soft enter when the view or route changes.",
		render: () => (
			<PageTransition transitionKey="runs" variant="slideUp">
				<Stack gap="xs" align="center">
					<Text size="sm" color="heading">
						Runs
					</Text>
					<Text size="sm" color="muted">
						12 today, 2 waiting for approval
					</Text>
				</Stack>
			</PageTransition>
		),
	},
];
