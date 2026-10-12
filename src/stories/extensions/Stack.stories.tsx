import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Col, Grid, Stack, TextField } from "../../index";
import "./Stack.scss";

// Additions on top of the Claude Design catalog: container-responsive direction
// (directionSm, directionMd, breakpoints). quiet uses no viewport breakpoints: a Stack inside a Grid
// follows the Grid's width band, as Col does; anywhere else it measures its parent.
const meta: Meta = { title: "Extensions/Stack", parameters: { layout: "fullscreen" } };
export default meta;

function FilterRow() {
	return (
		<Stack
			className="q-sb-stack__filters"
			direction="row"
			directionSm="column"
			gap="xs"
			breakpoints={[480, 720]}
		>
			<TextField aria-label="Search" placeholder="Search projects" />
			<TextField aria-label="Owner" placeholder="Owner" />
			<Stack direction="row" gap="xs" align="center">
				<Button variant="secondary">Reset</Button>
				<Button>Apply</Button>
			</Stack>
		</Stack>
	);
}

export const ResponsiveDirection: StoryObj = {
	render: () => (
		<div id="responsive-direction" className="q-sb-stack">
			<p className="q-sb-stack__note">
				One filter row in a wide and a narrow pane: a row from 480px of parent width, a column
				below. Drag the corner of the last pane to resize it.
			</p>
			<div className="q-sb-stack__panes">
				<section aria-label="Wide pane" className="q-sb-stack__pane q-sb-stack__pane--wide">
					<FilterRow />
				</section>
				<section aria-label="Narrow pane" className="q-sb-stack__pane q-sb-stack__pane--narrow">
					<FilterRow />
				</section>
			</div>
			<section aria-label="Resizable pane" className="q-sb-stack__pane q-sb-stack__pane--resizable">
				<FilterRow />
			</section>
		</div>
	),
};

export const InGrid: StoryObj = {
	render: () => (
		<div id="in-grid" className="q-sb-stack">
			<p className="q-sb-stack__note">
				Inside a Grid the Stack follows the Grid's band (sm under 720px, md under 960px), like Col.
				Resize the pane: at md the name and Create stack, at sm the actions do too.
			</p>
			<section aria-label="Grid pane" className="q-sb-stack__pane q-sb-stack__pane--resizable">
				<Grid columns={12} rowGap="xs">
					<Col span={8} spanMd={12}>
						<Stack direction="row" directionMd="column" gap="xs" align="stretch">
							<TextField aria-label="Project name" placeholder="Project name" />
							<Button variant="secondary">Create project</Button>
						</Stack>
					</Col>
					<Col span={4} spanMd={12}>
						<Stack direction="row" directionSm="column-reverse" gap="xs" justify="end">
							<Button variant="secondary">Cancel</Button>
							<Button>Save</Button>
						</Stack>
					</Col>
				</Grid>
			</section>
		</div>
	),
};
