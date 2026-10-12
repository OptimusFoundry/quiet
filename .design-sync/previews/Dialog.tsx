import type React from "react";
import { Button, Dialog, Text } from "@optimusfoundry/quiet";

// An open Dialog is position: fixed; the card contains it in its own box, so give that box the
// height of a screen for the dialog to centre in.
const Screen = ({ children }: { children: React.ReactNode }) => <div style={{ minHeight: 480 }}>{children}</div>;

export const Confirm = () => (
	<Screen>
	<Dialog
		open
		onClose={() => {}}
		eyebrow="Run 233f76c2"
		title="Restart this run?"
		actions={
			<>
				<Button variant="secondary">Cancel</Button>
				<Button variant="primary">Restart run</Button>
			</>
		}
	>
		<Text>The agent starts a new session with the same trigger and project. The transcript so far is kept.</Text>
	</Dialog>
	</Screen>
);

export const Destructive = () => (
	<Screen>
	<Dialog
		open
		onClose={() => {}}
		icon="warning"
		title="Delete the Assistant project?"
		size="sm"
		actions={
			<>
				<Button variant="ghost">Keep it</Button>
				<Button variant="destructive">Delete project</Button>
			</>
		}
	>
		<Text>Its 14 runs, 37 artifacts and every webhook stop for good. This can't be undone.</Text>
	</Dialog>
	</Screen>
);
