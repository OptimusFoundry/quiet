import type React from "react";
import { useEffect } from "react";
import { Button, Checkbox, Radio, Stack, Text } from "@optimusfoundry/quiet";
import { Drawer } from "@optimusfoundry/quiet";

// An open Drawer is position: fixed; give the card's box the height of a screen to hold it.
// It moves focus to its close button on open; drop that focus so the card shows the resting look.
const Screen = ({ children }: { children: React.ReactNode }) => {
	useEffect(() => {
		const t = setTimeout(() => (document.activeElement as HTMLElement | null)?.blur(), 50);
		return () => clearTimeout(t);
	}, []);
	return <div style={{ minHeight: 480 }}>{children}</div>;
};

export const Filters = () => (
	<Screen>
		<Drawer
			open
			onClose={() => {}}
			eyebrow="Runs"
			title="Filter runs"
			description="Narrow 214 runs in the Assistant project."
			footer={
				<>
					<Button variant="secondary">Reset</Button>
					<Button>Apply filters</Button>
				</>
			}
		>
			<Stack gap="lg">
				<Checkbox label="Failed only" defaultChecked />
				<Checkbox label="Needs approval" />
				<Radio label="Runner" options={["Orca", "Headless", "Any"]} defaultValue="Any" />
			</Stack>
		</Drawer>
	</Screen>
);

export const LeftSmall = () => (
	<Screen>
		<Drawer open onClose={() => {}} side="left" size="sm" title="Run 233f76c2">
			<Stack gap="md">
				<Text>Trigger: web-message from Ada Park.</Text>
				<Text>Runner: Orca · 4m 12s · $0.902049.</Text>
				<Text>3 artifacts written, 1 approval pending.</Text>
			</Stack>
		</Drawer>
	</Screen>
);
