// Layout for the Future stories: the catalog's numbered Block + Spec rows, plus the concept's
// lineage ("Evolved from") and idea, as in the Claude Design "Future Components" pages.
import type { ReactNode } from "react";
import "./Concept.scss";

const MONO = "q-sb-concept__mono";
const MONO_STRONG = "q-sb-concept__mono q-sb-concept__mono--strong";

export function FuturePage({
	title,
	intro,
	children,
}: {
	title: string;
	intro: ReactNode;
	children?: ReactNode;
}) {
	return (
		<main className="q-sb-concept">
			<div className={MONO_STRONG}>Future</div>
			<h1 className="q-sb-concept__title">
				{title}
				<span className="q-sb-concept__dot">.</span>
			</h1>
			<p className="q-sb-concept__intro">{intro}</p>
			{children}
		</main>
	);
}

export function Concept({
	id,
	index,
	name,
	from,
	idea,
	children,
}: {
	id: string;
	index: number;
	name: string;
	from: ReactNode;
	idea: ReactNode;
	children?: ReactNode;
}) {
	return (
		<section id={id} className="q-sb-concept__section">
			<div className="q-sb-concept__head">
				<span className={MONO_STRONG}>{String(index).padStart(2, "0")}</span>
				<h2 className="q-sb-concept__name">
					{name}
					<span className="q-sb-concept__dot">.</span>
				</h2>
			</div>
			<div className="q-sb-concept__meta">
				<div>
					<div className={MONO}>Evolved from</div>
					<div className="q-sb-concept__from">{from}</div>
				</div>
				<p className="q-sb-concept__idea">{idea}</p>
			</div>
			{children}
		</section>
	);
}

export function Spec({
	label,
	children,
	col,
}: {
	label: string;
	col?: boolean;
	children?: ReactNode;
}) {
	// Flex-wrap instead of a fixed 160px grid column: on narrow screens the label folds above the
	// content, so specimens never force sideways scroll.
	return (
		<div className={col ? "q-sb-concept__spec q-sb-concept__spec--col" : "q-sb-concept__spec"}>
			<div className={`${MONO} q-sb-concept__spec-label`}>{label}</div>
			<div className="q-sb-concept__spec-body">{children}</div>
		</div>
	);
}
