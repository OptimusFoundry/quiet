import { Button, ButtonGroup, Icon } from "@optimusfoundry/quiet";

export const Spaced = () => (
	<ButtonGroup>
		<Button variant="secondary">Cancel</Button>
		<Button>Approve run</Button>
	</ButtonGroup>
);

export const Attached = () => (
	<ButtonGroup attached label="Time range">
		<Button variant="secondary" size="sm">
			Day
		</Button>
		<Button variant="secondary" size="sm">
			Week
		</Button>
		<Button variant="secondary" size="sm">
			Month
		</Button>
	</ButtonGroup>
);

export const AttachedIcons = () => (
	<ButtonGroup attached label="Pagination">
		<Button size="sm" variant="secondary" icon={<Icon name="prev" />} aria-label="Previous run" />
		<Button size="sm" variant="secondary" icon={<Icon name="next" />} aria-label="Next run" />
	</ButtonGroup>
);

export const Vertical = () => (
	<ButtonGroup vertical attached label="Runner">
		<Button variant="secondary" size="sm">
			Orca
		</Button>
		<Button variant="secondary" size="sm">
			Headless
		</Button>
		<Button variant="secondary" size="sm">
			Local
		</Button>
	</ButtonGroup>
);

export const FullWidth = () => (
	<div style={{ width: 360 }}>
		<ButtonGroup fullWidth>
			<Button variant="secondary">Back</Button>
			<Button arrow>Continue</Button>
		</ButtonGroup>
	</div>
);
