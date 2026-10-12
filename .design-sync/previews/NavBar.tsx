import { NavBar } from "@optimusfoundry/quiet";

export const AppHeader = () => (
	<div style={{ width: 760 }}>
		<NavBar
			label="Main"
			links={[
				{ label: "Runs", href: "#runs", current: true },
				{ label: "Artifacts", href: "#artifacts" },
				{ label: "Triggers", href: "#triggers" },
				{ label: "Settings", href: "#settings" },
			]}
			cta="New run"
			ctaHref="#new"
		/>
	</div>
);

export const SiteHeader = () => (
	<div style={{ width: 760 }}>
		<NavBar
			label="Site"
			links={[
				{ label: "Product", href: "#product" },
				{ label: "Pricing", href: "#pricing" },
				{ label: "Docs", href: "#docs" },
			]}
			cta="Start a project"
			onCta={() => {}}
		/>
	</div>
);
