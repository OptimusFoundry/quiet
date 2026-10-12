import type React from "react";
import { useEffect } from "react";
import { ArrowLink, Button, Icon, Popover, Text } from "@optimusfoundry/quiet";

// The panel is absolutely positioned off the trigger; the wrapper gives it room in the card.
// Opening moves focus into the panel; drop it so the card shows the resting look.
const Room = ({ children }: { children: React.ReactNode }) => {
	useEffect(() => {
		const t = setTimeout(() => (document.activeElement as HTMLElement | null)?.blur(), 50);
		return () => clearTimeout(t);
	}, []);
	return <div style={{ display: "grid", placeItems: "center", width: 420, minHeight: 280 }}>{children}</div>;
};

export const Default = () => (
	<Room>
		<Popover
			defaultOpen
			placement="bottom"
			trigger={
				<Button size="sm" variant="secondary">
					Share run
				</Button>
			}
			title="Share run 233f76c2"
			width={260}
		>
			Anyone in the Assistant project can open the transcript and its 3 artifacts.
		</Popover>
	</Room>
);

export const Rich = () => (
	<Room>
		<Popover
			defaultOpen
			placement="bottom"
			align="start"
			showClose
			trigger={<Button size="sm" variant="secondary" icon={<Icon name="help" />} aria-label="What is a runner?" />}
			title="What is a runner?"
			width={300}
		>
			<Text>Orca runs in a hosted sandbox; Headless drives a browser for web tasks.</Text>
			<ArrowLink href="#">Read the runner guide</ArrowLink>
		</Popover>
	</Room>
);

export const Placements = () => (
	<Room>
		<Popover
			defaultOpen
			placement="right"
			trigger={
				<Button size="sm" variant="secondary">
					Cost
				</Button>
			}
			title="$0.902049"
			width={200}
		>
			Billed per token on Orca.
		</Popover>
	</Room>
);
