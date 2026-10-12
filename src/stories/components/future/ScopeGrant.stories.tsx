import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ScopeGrant } from "../../../components/future/ScopeGrant";
import { Column, Note } from "../Story";

const SCOPES = [
	{ id: "read", label: "Read runs and artifacts", defaultGranted: true },
	{ id: "draft", label: "Draft release notes and emails", defaultGranted: true },
	{ id: "publish", label: "Publish to the changelog", short: "publish", asks: true },
	{ id: "pause", label: "Pause or resume runners", defaultGranted: true },
	{ id: "bill", label: "Change plans or invoices", short: "billing", asks: true },
];
const DURATIONS = [
	{ value: "1h", label: "1 hour", expires: "expires in 1 hour" },
	{ value: "today", label: "Today", expires: "expires at midnight" },
	{ value: "always", label: "Until revoked", expires: "until you revoke it" },
];

const meta = {
	title: "Components/Agent & trust/ScopeGrant",
	component: ScopeGrant,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		agent: "Meerkat",
		title: "What Meerkat may do in Northwind",
		caption: "Scoped to this workspace",
		scopes: SCOPES,
		durations: DURATIONS,
		defaultDuration: "today",
	},
	argTypes: {
		agent: { control: "text" },
		title: { control: "text" },
		caption: { control: "text" },
		scopes: { control: false },
		durations: { control: false },
		onChange: { control: false },
		onDurationChange: { control: false },
		onGrant: { control: false },
		onRevoke: { control: false },
	},
	decorators: [
		(Story) => (
			<Column wide>
				<Story />
			</Column>
		),
	],
} satisfies Meta<typeof ScopeGrant>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

function GrantDemo() {
	const [granted, setGranted] = useState(false);
	const [last, setLast] = useState("");
	return (
		<>
			<ScopeGrant
				agent="Meerkat"
				title="What Meerkat may do in Northwind"
				caption="Scoped to this workspace"
				scopes={SCOPES}
				durations={DURATIONS}
				defaultDuration="today"
				granted={granted}
				onGrant={(g) => {
					setGranted(true);
					setLast(`${g.scopes.join(", ")} · ${g.duration}`);
				}}
				onRevoke={() => {
					setGranted(false);
					setLast("");
				}}
			/>
			<Note>{last ? `Granted: ${last}` : "Grant, then Update or Revoke all."}</Note>
		</>
	);
}

export const GrantAndRevoke: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Once `granted`, Grant becomes Update and Revoke all appears; the grant is announced.",
			},
		},
	},
	render: () => <GrantDemo />,
};

export const Granted: Story = { args: { granted: true } };

function ControlledDemo() {
	const [ids, setIds] = useState(["read"]);
	const [duration, setDuration] = useState("1h");
	return (
		<>
			<ScopeGrant
				agent="Meerkat"
				title="What Meerkat may do on this run"
				scopes={SCOPES}
				value={ids}
				onChange={setIds}
				durations={DURATIONS}
				duration={duration}
				onDurationChange={setDuration}
			/>
			<Note>
				value: [{ids.join(", ")}] · duration: {duration}
			</Note>
		</>
	);
}

export const Controlled: Story = {
	parameters: {
		docs: {
			description: { story: "`value`/`onChange` and `duration`/`onDurationChange` own the state." },
		},
	},
	render: () => <ControlledDemo />,
};

export const WithoutDurations: Story = {
	args: { durations: [], scopes: SCOPES.slice(0, 3), caption: undefined },
};
