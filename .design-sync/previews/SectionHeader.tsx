import { ArrowLink, Button, SectionHeader } from "@optimusfoundry/quiet";

export const Medium = () => (
	<div style={{ width: 760 }}>
		<SectionHeader
			index="01"
			eyebrow="Runs"
			title="Recent runs,"
			accent="all triggers"
			description="Every run from the last 24 hours across web-message, schedule and webhook triggers."
			actions={<ArrowLink href="#">All runs</ArrowLink>}
		/>
	</div>
);

export const Small = () => (
	<div style={{ width: 700 }}>
		<SectionHeader
			size="sm"
			as="h3"
			title="Artifacts"
			actions={<ArrowLink href="#">View all</ArrowLink>}
		/>
	</div>
);

export const TitleOnly = () => (
	<div style={{ width: 360 }}>
		<SectionHeader size="sm" as="h3" eyebrow="Project" title="Support triage" />
	</div>
);

export const WithAction = () => (
	<div style={{ width: 700 }}>
		<SectionHeader
			size="sm"
			as="h3"
			title="Approvals"
			description="Seven drafts waiting on Ada Park."
			actions={
				<Button size="sm" variant="secondary">
					Review all
				</Button>
			}
		/>
	</div>
);
