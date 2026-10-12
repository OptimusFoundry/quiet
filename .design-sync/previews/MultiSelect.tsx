import { useEffect, useRef } from "react";
import { MultiSelect } from "@optimusfoundry/quiet";

const col = { display: "grid", gap: "var(--q-space-stack)", maxWidth: 380 } as const;

const triggers = [
	{ value: "web-message", label: "web-message", description: "Chat widget on your site" },
	{ value: "schedule", label: "schedule", description: "Cron, in the project's timezone" },
	{ value: "webhook", label: "webhook", description: "POST to a signed URL" },
	{ value: "slack", label: "slack", description: "Mentions in a connected channel" },
	{ divider: true as const },
	{ value: "email", label: "email", description: "Coming soon", disabled: true },
];

const people = ["Ada Park", "Jonas Berg", "Mira Okafor", "Lena Holm", "Theo Grant", "Sana Iqbal"];

export const Default = () => (
	<div style={col}>
		<MultiSelect
			label="Triggers"
			options={triggers}
			defaultValue={["web-message", "webhook"]}
			helperText="A run starts on any of these."
		/>
	</div>
);

// The listbox is absolutely positioned under the field; the wrapper gives it room in the card.
export const Open = () => {
	const ref = useRef<HTMLElement>(null);
	useEffect(() => {
		ref.current?.click();
	}, []);
	return (
		<div style={{ ...col, minHeight: 380, alignContent: "start" }}>
			<MultiSelect ref={ref} label="Triggers" options={triggers} defaultValue={["web-message", "schedule"]} />
		</div>
	);
};

export const Collapsed = () => (
	<div style={col}>
		<MultiSelect
			label="Approvers"
			options={people}
			defaultValue={["Ada Park", "Jonas Berg", "Mira Okafor", "Theo Grant"]}
			maxDisplay={2}
		/>
	</div>
);

export const Empty = () => (
	<div style={col}>
		<MultiSelect label="Notify" placeholder="Choose people" options={people} />
	</div>
);

export const States = () => (
	<div style={col}>
		<MultiSelect
			label="Approvers"
			placeholder="Choose approvers"
			required
			options={people}
			error="Production deploys need at least one approver."
		/>
		<MultiSelect label="Runners" options={["Orca", "Headless"]} defaultValue={["Orca"]} disabled />
	</div>
);
