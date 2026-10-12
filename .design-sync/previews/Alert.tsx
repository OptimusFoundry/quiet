import { Alert, ArrowLink, Button } from "@optimusfoundry/quiet";

const col = { display: "grid", gap: "var(--q-space-stack)", width: 420 } as const;

export const Default = () => (
	<div style={col}>
		<Alert title="Run 233f76c2 is waiting for approval.">
			Ada Park asked to send the release notes draft to #launches. Approve it from the run page.
		</Alert>
	</div>
);

export const Variants = () => (
	<div style={col}>
		<Alert variant="info" title="Headless runner is in preview." />
		<Alert variant="success" title="Artifact published." />
		<Alert variant="warning" title="Budget 82% spent this month." />
		<Alert variant="error" title="Webhook delivery failed." />
	</div>
);

export const WithAction = () => (
	<div style={col}>
		<Alert
			variant="warning"
			title="The Orca sandbox expires in 3 days."
			action={<ArrowLink href="#">Renew sandbox</ArrowLink>}
		>
			Runs on the Assistant project pause when it does.
		</Alert>
		<Alert
			variant="error"
			title="Run 9a01be44 failed."
			onDismiss={() => {}}
			action={
				<Button size="sm" variant="secondary">
					Retry run
				</Button>
			}
		>
			The web-message trigger timed out after 120s. Cost so far $0.902049.
		</Alert>
	</div>
);

export const Plain = () => (
	<div style={col}>
		<Alert icon={false}>Runs started from the CLI show up here within a few seconds.</Alert>
	</div>
);
