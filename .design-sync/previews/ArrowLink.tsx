import { ArrowLink } from "@optimusfoundry/quiet";

export const Default = () => <ArrowLink href="#">View all runs</ArrowLink>;

export const InPageJump = () => (
	<ArrowLink href="#artifacts" arrow={"↘"}>
		Jump to artifacts
	</ArrowLink>
);

export const InAList = () => (
	<div style={{ display: "grid", gap: "var(--q-space-stack)", justifyItems: "start" }}>
		<ArrowLink href="#">Open project settings</ArrowLink>
		<ArrowLink href="#">Review 3 pending approvals</ArrowLink>
		<ArrowLink href="#" arrow={"↘"}>
			Usage this month
		</ArrowLink>
	</div>
);
