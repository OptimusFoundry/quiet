import { ArrowLink, Button, Icon, PageHero } from "@optimusfoundry/quiet";

export const App = () => (
	<div style={{ width: 640 }}>
		<PageHero
			size="md"
			title="Good morning,"
			accent="Ada"
			description="Three runs finished overnight. Two are waiting on your approval."
			actions={
				<Button size="sm" leftIcon={<Icon name="plus" />}>
					New run
				</Button>
			}
			ruled={false}
			style={{ padding: 0 }}
		/>
	</div>
);

export const Large = () => (
	<div style={{ width: 760 }}>
		<PageHero
			index="02"
			eyebrow="Projects"
			title="Every agent,"
			accent="still running"
			description="Twelve projects on Orca and Headless runners, what triggers them, and who approves their output."
			actions={
				<>
					<Button arrow>Start a project</Button>
					<ArrowLink href="#">Read the runbook</ArrowLink>
				</>
			}
			style={{ padding: "var(--q-space-6) 0" }}
		/>
	</div>
);

export const Ruled = () => (
	<div style={{ width: 640 }}>
		<PageHero
			size="md"
			eyebrow="Settings"
			title="Billing"
			description="Usage this cycle: $41.902049 across 1,284 runs."
			actions={
				<Button size="sm" variant="secondary">
					Download invoices
				</Button>
			}
		/>
	</div>
);

export const WithAfter = () => (
	<div style={{ width: 640 }}>
		<PageHero
			size="md"
			as="h2"
			title="Spend,"
			accent="this cycle"
			after="so far"
			description="$41.902049 across 1,284 runs on Orca and Headless."
			ruled={false}
			style={{ padding: 0 }}
		/>
	</div>
);
