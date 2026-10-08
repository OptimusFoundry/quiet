import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../components/core/Button";
import { Toaster, type ToasterProps, toast } from "../components/feedback/Toaster";
import "./Toaster.scss";

// quiet's own: Toaster is not in the Optimus Foundry reference, so it has its own story
// rather than a section in the generated catalog.
function Demo(props: ToasterProps & { second?: boolean }) {
	const { second, ...toaster } = props;
	const [last, setLast] = useState<string>();
	return (
		<div className="q-sb-toaster">
			<Button
				onClick={() =>
					setLast(toast({ title: "Draft saved", description: "Your changes are stored." }))
				}
			>
				Info toast
			</Button>
			<Button
				variant="secondary"
				onClick={() =>
					setLast(toast({ title: "Webhook created", status: "success", meta: "just now" }))
				}
			>
				Success toast
			</Button>
			<Button
				variant="secondary"
				onClick={() =>
					setLast(
						toast({
							title: "Delivery failed",
							description: "The endpoint returned 500.",
							status: "error",
							duration: 0,
							action: (
								<Button size="sm" variant="outline">
									Retry
								</Button>
							),
						}),
					)
				}
			>
				Error toast
			</Button>
			<Button variant="ghost" onClick={() => last && toast.dismiss(last)}>
				Dismiss last
			</Button>
			<Button variant="ghost" onClick={() => toast.dismiss()}>
				Dismiss all
			</Button>
			<Toaster {...toaster} />
			{second && <Toaster position="top-left" />}
		</div>
	);
}

const meta: Meta<typeof Demo> = {
	title: "Feedback/Toaster",
	component: Demo,
	args: { position: "bottom-right", duration: 5000, max: 5 },
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
};
export default meta;

export const Default: StoryObj<typeof Demo> = {};
export const TopCenter: StoryObj<typeof Demo> = { args: { position: "top-center" } };
/** A second Toaster on the page stays inert, so every toast renders once. */
export const TwoToasters: StoryObj<typeof Demo> = { args: { second: true } };
