import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Table } from "../../../components/data/Table";
import { Switch } from "../../../components/forms/Switch";
import { UncertaintyCell } from "../../../components/future/UncertaintyCell";
import { Column, Row } from "../Story";

const FIGURES = [
	{ id: "runs", name: "Runs this month", value: 4812 },
	{ id: "forecast", name: "Forecast · Nov", value: 5400, error: 620 },
	{ id: "eu", name: "EU after retries", value: 1760, error: 140 },
	{ id: "pro", name: "Pro upgrades", value: 412, low: 380, high: 470 },
];
const DOMAIN: [number, number] = [0, 6500];

const meta = {
	title: "Components/Agent & trust/UncertaintyCell",
	component: UncertaintyCell,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: { value: 5400, error: 620, domain: DOMAIN, showBand: true },
	argTypes: {
		domain: { control: false },
		format: { control: false },
		describe: { control: false },
	},
} satisfies Meta<typeof UncertaintyCell>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const MeasuredAndForecast: Story = {
	parameters: {
		docs: {
			description: {
				story: "A measured value (no range) is set heavier; a forecast carries its band.",
			},
		},
	},
	render: () => (
		<Row>
			<UncertaintyCell value={4812} domain={DOMAIN} />
			<UncertaintyCell value={5400} error={620} domain={DOMAIN} />
			<UncertaintyCell value={412} low={380} high={470} domain={[0, 600]} />
		</Row>
	),
};

export const Formatted: Story = {
	args: {
		value: 18400,
		error: 2100,
		domain: [0, 25000],
		format: (v) => `$${v.toLocaleString("en-US")}`,
	},
};

function TableDemo() {
	const [bands, setBands] = useState(true);
	return (
		<Column wide>
			<Switch label="Show bands" checked={bands} onChange={setBands} />
			<Table
				label="Runs, measured and forecast"
				columns={[
					{ key: "name", header: "Figure" },
					{
						key: "value",
						header: "Count",
						align: "right",
						width: 220,
						render: (r) => (
							<UncertaintyCell
								value={r.value}
								error={r.error}
								low={r.low}
								high={r.high}
								domain={DOMAIN}
								showBand={bands}
							/>
						),
					},
				]}
				data={FIGURES}
			/>
		</Column>
	);
}

export const InATable: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Pass one `domain` to every cell in a column so the bands compare. `showBand={false}` keeps the ± text.",
			},
		},
	},
	render: () => <TableDemo />,
};
