import type { ReactNode } from "react";
import "./Story.scss";

// Layout for the component stories (Components/*): a row of examples, a column of them, a caption.
// A story that needs more layout than this gets its own <Name>.scss next to it.

/** Examples side by side, wrapping, centred on one line. */
export function Row({ children, label }: { children: ReactNode; label?: string }) {
	return (
		<div className="q-sb-story__row-wrap">
			{label && <p className="q-sb-story__label">{label}</p>}
			<div className="q-sb-story__row">{children}</div>
		</div>
	);
}

/** Examples stacked, up to a readable width (forms, cards, alerts). */
export function Column({ children, wide }: { children: ReactNode; wide?: boolean }) {
	return (
		<div className={wide ? "q-sb-story__column q-sb-story__column--wide" : "q-sb-story__column"}>
			{children}
		</div>
	);
}

/** A muted line under a demo: what to try, or the state it shows. */
export function Note({ children }: { children: ReactNode }) {
	return <p className="q-sb-story__note">{children}</p>;
}
