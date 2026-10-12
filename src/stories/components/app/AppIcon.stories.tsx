import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppIcon } from "../../../components/app/AppIcon";
import { Button } from "../../../components/core/Button";
import { ICONS, type IconName } from "../../../components/core/icons";
import { Row } from "../Story";
import "./AppIcon.scss";

const NAMES = Object.keys(ICONS) as IconName[];

const meta = {
	title: "Components/App/AppIcon",
	component: AppIcon,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { name: "runs", size: "md" },
	argTypes: {
		name: { control: "select", options: NAMES },
		size: { control: "select", options: ["sm", "md", "lg", 24, 32] },
	},
} satisfies Meta<typeof AppIcon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const TheSet: Story = {
	parameters: {
		docs: {
			description: {
				story: "Every icon in `core/icons.ts`, at lg. `Icon` draws the same set, sized in em.",
			},
		},
	},
	render: () => (
		<ul className="q-sb-app-icon__set">
			{NAMES.map((n) => (
				<li key={n} className="q-sb-app-icon__cell">
					<AppIcon name={n} size="lg" />
					<span className="q-sb-app-icon__name">{n}</span>
				</li>
			))}
		</ul>
	),
};

export const Sizes: Story = {
	parameters: {
		docs: { description: { story: "sm 14, md 16 (the default), lg 20, or any pixel size." } },
	},
	render: () => (
		<Row>
			<AppIcon name="approvals" size="sm" />
			<AppIcon name="approvals" size="md" />
			<AppIcon name="approvals" size="lg" />
			<AppIcon name="approvals" size={28} />
		</Row>
	),
};

export const Labelled: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Decorative by default (`aria-hidden`). With `label` it is an image with that name; inside a labelled button it stays decorative.",
			},
		},
	},
	render: () => (
		<Row>
			<AppIcon name="warning" label="Needs approval" />
			<Button variant="ghost" size="sm" icon={<AppIcon name="bell" />} aria-label="Notifications" />
			<Button variant="secondary" size="sm" leftIcon={<AppIcon name="download" />}>
				Download
			</Button>
		</Row>
	),
};
