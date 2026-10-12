import type React from "react";
import { useEffect, useRef } from "react";
import { Button, Icon, Tooltip } from "@optimusfoundry/quiet";

// Tooltips open on hover/focus; hover the trigger on mount so the card shows it open.
function Hovered({ children }: { children: React.ReactNode }) {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const t = ref.current?.querySelector(".q-tooltip");
		t?.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
	}, []);
	return (
		<div ref={ref} style={{ display: "grid", placeItems: "center", width: 280, minHeight: 120 }}>
			{children}
		</div>
	);
}

export const Default = () => (
	<Hovered>
		<Tooltip content="Billed per token">
			<Button variant="secondary" size="sm" icon={<Icon name="info" />} aria-label="How cost is billed" />
		</Tooltip>
	</Hovered>
);

export const Bottom = () => (
	<Hovered>
		<Tooltip content="Last run 4 min ago" placement="bottom">
			<Button variant="secondary" size="sm">
				Orca
			</Button>
		</Tooltip>
	</Hovered>
);

export const Right = () => (
	<Hovered>
		<Tooltip content="$0.902049 this run" placement="right">
			<Button variant="secondary" size="sm">
				Cost
			</Button>
		</Tooltip>
	</Hovered>
);

export const Left = () => (
	<Hovered>
		<Tooltip content="Needs approval" placement="left">
			<Button variant="secondary" size="sm">
				Send
			</Button>
		</Tooltip>
	</Hovered>
);
