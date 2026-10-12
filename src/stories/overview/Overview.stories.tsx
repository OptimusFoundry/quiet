import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../../components/core/Badge";
import { Link } from "../../components/core/Link";
import { docsHref, GROUPS, type Group, sanitize } from "./groups";
import { tiles as app } from "./tiles/app";
import { tiles as charts } from "./tiles/charts";
import { tiles as chat } from "./tiles/chat";
import { tiles as core } from "./tiles/core";
import { tiles as data } from "./tiles/data";
import { tiles as display } from "./tiles/display";
import { tiles as feedback } from "./tiles/feedback";
import { tiles as forms } from "./tiles/forms";
import { tiles as future } from "./tiles/future";
import { tiles as layout } from "./tiles/layout";
import { tiles as navigation } from "./tiles/navigation";
import { tiles as overlays } from "./tiles/overlays";
import type { Tile } from "./tiles/types";
import "./Overview.scss";

// The UI kit: every component, live, in the toolbar's theme. Each tile links to its Docs page.
// Tiles live in ./tiles/<group>.tsx; scripts/check-stories.mjs fails when a component has none.
const meta: Meta = {
	title: "Overview",
	parameters: { layout: "fullscreen" },
};
export default meta;

const TILES: Record<string, Tile[]> = {
	core,
	forms,
	display,
	data,
	navigation,
	feedback,
	overlays,
	layout,
	app,
	charts,
	chat,
	future,
};

function TileCard({ group, tile }: { group: Group; tile: Tile }) {
	return (
		<li className={tile.wide ? "q-sb-kit__tile q-sb-kit__tile--wide" : "q-sb-kit__tile"}>
			<div className="q-sb-kit__preview" inert>
				{tile.render()}
			</div>
			<div className="q-sb-kit__caption">
				<a className="q-sb-kit__name" href={docsHref(group, tile.name)} target="_top">
					{tile.name}
				</a>
				<p className="q-sb-kit__blurb">{tile.blurb}</p>
			</div>
		</li>
	);
}

function Kit() {
	const total = GROUPS.reduce((n, g) => n + (TILES[g.folder]?.length ?? 0), 0);
	return (
		<main className="q-sb-kit">
			<header className="q-sb-kit__hero">
				<h1 className="q-sb-kit__title">quiet</h1>
				<p className="q-sb-kit__intro">
					A design system for calm, dense product screens: soft ink, one lava accent, grounds
					instead of rules. React and TypeScript on <code>--q-*</code> tokens, with keyboard
					operation, ARIA and soft motion built in.
				</p>
				<div className="q-sb-kit__facts">
					<Badge>{total} components</Badge>
					<Badge>{GROUPS.length} groups</Badge>
					<span className="q-sb-kit__hint">
						Switch the theme in the toolbar. Read the{" "}
						<Link href="./?path=/docs/foundations-spacing--default" target="_top">
							foundations
						</Link>{" "}
						or see whole{" "}
						<Link href="./?path=/story/patterns-dashboard--default" target="_top">
							screens
						</Link>
						.
					</span>
				</div>
				<nav className="q-sb-kit__toc" aria-label="Groups">
					{GROUPS.map((g) => (
						<a key={g.folder} href={`#${sanitize(g.label)}`} className="q-sb-kit__toc-link">
							{g.label}
						</a>
					))}
				</nav>
			</header>
			{GROUPS.map((g) => (
				<section
					key={g.folder}
					id={sanitize(g.label)}
					className="q-sb-kit__group"
					aria-labelledby={`${sanitize(g.label)}-title`}
				>
					<div className="q-sb-kit__group-head">
						<h2 id={`${sanitize(g.label)}-title`} className="q-sb-kit__group-title">
							{g.label}
						</h2>
						<p className="q-sb-kit__group-blurb">{g.blurb}</p>
					</div>
					<ul className="q-sb-kit__grid">
						{(TILES[g.folder] ?? []).map((t) => (
							<TileCard key={t.name} group={g} tile={t} />
						))}
					</ul>
				</section>
			))}
		</main>
	);
}

export const UIKit: StoryObj = { name: "UI kit", render: () => <Kit /> };
