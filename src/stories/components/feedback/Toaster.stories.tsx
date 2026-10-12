import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, useRef } from "react";
import { Button } from "../../../components/core/Button";
import { Toaster, toast } from "../../../components/feedback/Toaster";
import { Column, Note, Row } from "../Story";

const meta = {
	title: "Components/Feedback/Toaster",
	component: Toaster,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"Mount one `<Toaster />` near the app root, then call `toast()` from anywhere. Only the first mounted Toaster renders, so on this Docs page every story shares one stack (and one position); open a story on its own to try its props.",
			},
		},
	},
	args: { position: "bottom-right", duration: 5000, max: 5, label: "Notifications" },
	argTypes: {
		position: {
			control: "select",
			options: [
				"top-left",
				"top-center",
				"top-right",
				"bottom-left",
				"bottom-center",
				"bottom-right",
			],
		},
	},
} satisfies Meta<typeof Toaster>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: (args) => (
		<Column>
			<Row>
				<Button
					onClick={() => toast({ title: "Draft saved", description: "Your changes are stored." })}
				>
					Raise a toast
				</Button>
				<Button variant="ghost" onClick={() => toast.dismiss()}>
					Dismiss all
				</Button>
			</Row>
			<Toaster {...args} />
		</Column>
	),
};

export const Statuses: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'`status` sets the mark and the announcement: info is the plain toast, error is assertive (`role="alert"`).',
			},
		},
	},
	render: (args) => (
		<Column>
			<Row>
				<Button
					variant="secondary"
					onClick={() => toast({ title: "Draft saved", description: "Your changes are stored." })}
				>
					Info
				</Button>
				<Button
					variant="secondary"
					onClick={() => toast({ title: "Webhook created", status: "success", meta: "just now" })}
				>
					Success
				</Button>
				<Button
					variant="secondary"
					onClick={() =>
						toast({ title: "Budget at 80%", status: "warning", meta: "Meerkat · daily" })
					}
				>
					Warning
				</Button>
				<Button
					variant="secondary"
					onClick={() =>
						toast({
							title: "Delivery failed",
							description: "The endpoint returned 500.",
							status: "error",
						})
					}
				>
					Error
				</Button>
			</Row>
			<Toaster {...args} />
		</Column>
	),
};

export const PersistentWithAction: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`duration: 0` keeps a toast until it's dismissed: use it when there's something to do.",
			},
		},
	},
	render: (args) => (
		<Column>
			<Row>
				<Button
					variant="secondary"
					onClick={() => {
						const id = toast({
							title: "Delivery failed",
							description: "The endpoint returned 500.",
							status: "error",
							duration: 0,
							action: (
								<Button size="sm" variant="outline" onClick={() => toast.dismiss(id)}>
									Retry
								</Button>
							),
						});
					}}
				>
					Failed delivery
				</Button>
			</Row>
			<Toaster {...args} />
		</Column>
	),
};

function ReplaceDemo(args: ComponentProps<typeof Toaster>) {
	const n = useRef(0);
	return (
		<Column>
			<Row>
				<Button
					variant="secondary"
					onClick={() => {
						const id = `export-${++n.current}`;
						toast({ id, title: "Exporting workspace", meta: "northwind", duration: 0 });
						setTimeout(
							() =>
								toast({
									id,
									title: "Workspace exported",
									status: "success",
									meta: "northwind-2026-10-12.zip",
								}),
							1500,
						);
					}}
				>
					Export workspace
				</Button>
			</Row>
			<Note>Reusing an `id` replaces the toast in place: start, then finish, in one slot.</Note>
			<Toaster {...args} />
		</Column>
	);
}

export const ReplaceInPlace: Story = { render: (args) => <ReplaceDemo {...args} /> };

function DismissDemo(args: ComponentProps<typeof Toaster>) {
	const last = useRef<string>(undefined);
	return (
		<Column>
			<Row>
				<Button
					variant="secondary"
					onClick={() => {
						last.current = toast(`Run #${4180 + Math.floor(Math.random() * 20)} queued`);
					}}
				>
					Queue a run
				</Button>
				<Button variant="ghost" onClick={() => last.current && toast.dismiss(last.current)}>
					Dismiss last
				</Button>
				<Button variant="ghost" onClick={() => toast.dismiss()}>
					Dismiss all
				</Button>
			</Row>
			<Note>
				`toast()` returns the id; `toast.dismiss(id)` removes one, `toast.dismiss()` all. A string
				is shorthand for a title. `max` (3 here) lets the oldest give way.
			</Note>
			<Toaster {...args} />
		</Column>
	);
}

export const DismissAndMax: Story = {
	args: { max: 3 },
	render: (args) => <DismissDemo {...args} />,
};

export const TwoToasters: Story = {
	parameters: {
		docs: {
			description: {
				story: "A second Toaster on the page stays inert, so every toast renders once.",
			},
		},
	},
	render: (args) => (
		<Column>
			<Row>
				<Button
					variant="secondary"
					onClick={() => toast({ title: "Rendered once", status: "success" })}
				>
					Raise a toast
				</Button>
			</Row>
			<Toaster {...args} />
			<Toaster position="top-left" />
		</Column>
	),
};
