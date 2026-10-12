import { Button, ButtonGroup, Icon } from "@optimusfoundry/quiet";

export const Variants = () => (
	<ButtonGroup>
		<Button variant="primary">Restart run</Button>
		<Button variant="secondary">Close run</Button>
		<Button variant="outline">Export</Button>
		<Button variant="ghost">Cancel</Button>
		<Button variant="destructive">Delete project</Button>
	</ButtonGroup>
);

export const Sizes = () => (
	<ButtonGroup>
		<Button size="sm">New run</Button>
		<Button size="md">New run</Button>
		<Button size="lg">New run</Button>
	</ButtonGroup>
);

export const States = () => (
	<ButtonGroup>
		<Button loading>Saving</Button>
		<Button disabled>Create API key</Button>
		<Button variant="secondary" arrow>
			View all runs
		</Button>
	</ButtonGroup>
);

export const WithIcons = () => (
	<ButtonGroup>
		<Button variant="secondary" leftIcon={<Icon name="plus" />}>
			Add marketplace
		</Button>
		<Button variant="outline" rightIcon={<Icon name="arrow-down" />}>
			Download
		</Button>
		<Button variant="ghost" icon={<Icon name="more" />} aria-label="More actions" />
	</ButtonGroup>
);
