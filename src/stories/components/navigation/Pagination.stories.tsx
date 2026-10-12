import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Pagination } from "../../../components/navigation/Pagination";
import { Column, Note, Row } from "../Story";

const meta = {
	title: "Components/Navigation/Pagination",
	component: Pagination,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { total: 24, defaultPage: 7, variant: "default", size: "md" },
	argTypes: { onChange: { control: false } },
} satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
	render: (args) => (
		<Column wide>
			<Row label="Default">
				<Pagination {...args} variant="default" label="Runs, default" />
			</Row>
			<Row label="Outline">
				<Pagination {...args} variant="outline" label="Runs, outline" />
			</Row>
			<Row label="Ghost">
				<Pagination {...args} variant="ghost" label="Runs, ghost" />
			</Row>
		</Column>
	),
};

export const Sizes: Story = {
	render: (args) => (
		<Column wide>
			<Pagination {...args} size="sm" label="Runs, small" />
			<Pagination {...args} size="md" label="Runs, medium" />
			<Pagination {...args} size="lg" label="Runs, large" />
		</Column>
	),
};

export const FewPages: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Under a short list, drop the first and last buttons. `siblings` sets how many pages show either side of the current one.",
			},
		},
	},
	args: { total: 5, defaultPage: 2, showFirstLast: false, variant: "ghost", size: "sm" },
};

export const Disabled: Story = {
	parameters: {
		docs: { description: { story: "While the next page loads, disable the whole control." } },
	},
	args: { disabled: true },
};

function ControlledDemo() {
	const [page, setPage] = useState(1);
	const perPage = 25;
	const total = 312;
	const from = (page - 1) * perPage + 1;
	const to = Math.min(total, page * perPage);
	return (
		<Column wide>
			<Pagination page={page} onChange={setPage} total={Math.ceil(total / perPage)} />
			<Note>
				Showing invoices {from} to {to} of {total}.
			</Note>
		</Column>
	);
}

export const Controlled: Story = {
	parameters: {
		docs: {
			description: { story: "`page` + `onChange` when the app owns the page (a URL param)." },
		},
	},
	render: () => <ControlledDemo />,
};
