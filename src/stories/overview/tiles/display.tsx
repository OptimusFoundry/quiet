import { Accordion } from "../../../components/display/Accordion";
import { Card } from "../../../components/display/Card";
import type { Tile } from "./types";

export const tiles: Tile[] = [
	{
		name: "Card",
		blurb: "Content on a soft ground, no border; a link or button when it leads somewhere.",
		render: () => (
			<div className="q-sb-tile-stack">
				<Card eyebrow="Workspace" title="Invoice reconciliation" meta="Updated 2h ago" />
			</div>
		),
	},
	{
		name: "Accordion",
		blurb: "Disclosure rows set apart by space: answers, settings and details on demand.",
		render: () => (
			<div className="q-sb-tile-stack">
				<Accordion
					defaultExpanded={["billing"]}
					items={[
						{
							id: "billing",
							title: "When am I billed?",
							content: "Monthly, on the day you joined.",
						},
						{ id: "seats", title: "Can I change seats?", content: "Yes, from Settings." },
					]}
				/>
			</div>
		),
	},
];
