import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../components/core/Button";
import { Text } from "../components/core/Text";
import { Popover } from "../components/overlays/Popover";

// quiet's own: the close options are not shown in the Optimus Foundry reference catalog.
function Options() {
	return (
		<div
			style={{ display: "flex", alignItems: "flex-start", gap: 24, padding: 24, minHeight: 320 }}
		>
			<Popover trigger={<Button variant="secondary">Default</Button>} title="Share this build">
				<Text>Escape or a click outside closes it.</Text>
			</Popover>
			<Popover
				trigger={<Button variant="secondary">With close</Button>}
				title="Invite a teammate"
				showClose
			>
				<Text>The × closes it too.</Text>
			</Popover>
			<Popover
				trigger={<Button variant="secondary">Sticky</Button>}
				title="Pinned note"
				closeOnClickOutside={false}
				closeOnEscape={false}
				showClose
			>
				<Text>Only the × or the trigger closes it.</Text>
			</Popover>
		</div>
	);
}

const meta: Meta = { title: "Overlays/Popover options" };
export default meta;

export const CloseOptions: StoryObj = { render: () => <Options /> };
