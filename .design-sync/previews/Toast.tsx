import { Button, Toast } from "@optimusfoundry/quiet";

const col = { display: "grid", gap: "var(--q-space-stack)", width: 380 } as const;

export const Default = () => (
	<div style={col}>
		<Toast
			title="Run 233f76c2 started."
			description="Assistant · web-message trigger on Orca."
			meta="Just now"
			onClose={() => {}}
		/>
	</div>
);

export const Variants = () => (
	<div style={col}>
		<Toast variant="default" title="Draft saved." />
		<Toast variant="neutral" title="Run queued." meta="3 ahead of it" />
		<Toast variant="success" title="Artifact published." />
		<Toast variant="warning" title="Budget 82% spent." />
		<Toast variant="error" title="Webhook delivery failed." description="The endpoint returned 500." onClose={() => {}} />
	</div>
);

export const WithAction = () => (
	<div style={col}>
		<Toast
			variant="error"
			title="Run 9a01be44 failed."
			description="Timed out after 120s. Cost $0.902049."
			action={
				<Button size="sm" variant="outline">
					Retry
				</Button>
			}
			onClose={() => {}}
		/>
	</div>
);
