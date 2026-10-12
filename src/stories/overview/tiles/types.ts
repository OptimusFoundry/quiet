import type { ReactNode } from "react";

/** One component on the Overview page: a small live example, its name and a one-liner. */
export interface Tile {
	/** The component file's name (`src/components/<group>/<name>.tsx`); also its story title. */
	name: string;
	/** One sentence: what it is for, in quiet's voice. */
	blurb: string;
	/** A small, static-looking example. It renders inert (no focus, no clicks). */
	render: () => ReactNode;
	/** A wider preview, two columns of the grid. */
	wide?: boolean;
}
