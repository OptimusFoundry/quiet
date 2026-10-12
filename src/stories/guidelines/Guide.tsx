import {
	type CSSProperties,
	type ReactNode,
	type RefObject,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { PageHeader, Panel, Tabs } from "../../index";
import { cssVar, type TokenName } from "../../styles/tokens.generated";
import "./Guide.scss";

// Story-only helpers for the Guidelines specimens (docs/guidelines/*). Measurements are read from
// the live tokens with getComputedStyle, so they follow density and theme. Molten marks redlines only.

export type Density = "comfortable" | "compact";

/** The panel's white inside a section: what a specimen of a screen sits on. Add to a `className`. */
export const stage = "q-sb-guide__stage";
/** A hand-built surface panel (the warm ground) for redlines that reach inside its padding. */
export const surface = "q-sb-guide__surface";

/** Code, IDs and token names: plain mono in their real case. */
export function Mono({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<code className={className ? `q-sb-guide__mono ${className}` : "q-sb-guide__mono"}>
			{children}
		</code>
	);
}

/** A measured number: tabular, so columns of them line up. */
export function Num({ children }: { children: ReactNode }) {
	return <span className="q-sb-guide__num">{children}</span>;
}

/** Live px size of an element (follows density and theme via ResizeObserver). */
export function useSize(ref: RefObject<HTMLElement | null>, axis: "width" | "height") {
	const [px, setPx] = useState(0);
	useLayoutEffect(() => {
		const el = ref.current;
		if (!el) return;
		const read = () => setPx(Math.round(el.getBoundingClientRect()[axis]));
		read();
		if (typeof ResizeObserver === "undefined") return;
		const ro = new ResizeObserver(read);
		ro.observe(el);
		return () => ro.disconnect();
	}, [ref, axis]);
	return px;
}

/** A custom property resolved on `ref` (re-read every render, so it follows density changes). */
export function useVar(ref: RefObject<HTMLElement | null>, name: TokenName) {
	const [value, setValue] = useState("");
	useLayoutEffect(() => {
		const el = ref.current;
		if (el) setValue(getComputedStyle(el).getPropertyValue(name).trim());
	});
	return value;
}

export function GuidePage({
	title,
	doc,
	intro,
	children,
}: {
	title: string;
	doc: string;
	intro: ReactNode;
	children: ReactNode;
}) {
	return (
		<main aria-label={title} className="q-sb-guide">
			<PageHeader
				as="h1"
				eyebrow="Guidelines"
				title={title}
				description={intro}
				meta={[<Mono key="doc">docs/guidelines/{doc}</Mono>]}
			/>
			{children}
		</main>
	);
}

/** One specimen section: a titled surface Panel with the rule it shows. */
export function Part({
	title,
	rule,
	children,
	aside,
}: {
	title: string;
	rule?: ReactNode;
	children: ReactNode;
	aside?: ReactNode;
}) {
	return (
		<Panel title={title} description={rule} actions={aside}>
			{children}
		</Panel>
	);
}

export function DensitySwitch({
	value,
	onChange,
	label = "Density",
}: {
	value: Density;
	onChange: (d: Density) => void;
	label?: string;
}) {
	return (
		<Tabs
			variant="enclosed"
			size="sm"
			label={label}
			value={value}
			onChange={(v) => onChange(v as Density)}
			tabs={[
				{ value: "comfortable", label: "Comfortable" },
				{ value: "compact", label: "Compact" },
			]}
		/>
	);
}

/** A vertical redline: renders the gap `token` itself, with molten end ticks and its live px. */
export function Gap({ token, note }: { token: TokenName; note?: string }) {
	const ref = useRef<HTMLDivElement>(null);
	const px = useSize(ref, "height");
	return (
		<div ref={ref} className="q-sb-guide__gap" style={{ "--_h": cssVar(token) } as CSSProperties}>
			<span className="q-sb-guide__label q-sb-guide__gap-label">
				<Mono>{token}</Mono>
				<Num>{px}</Num>
				{note && <span>{note}</span>}
			</span>
		</div>
	);
}

/** A horizontal redline: a width token drawn at its live px (clipped to the column), with what it is for. */
export function Span({ token, label }: { token: TokenName; label?: string }) {
	const ref = useRef<HTMLSpanElement>(null);
	const drawn = useSize(ref, "width");
	const value = useVar(ref, token);
	const px = value.endsWith("px") ? Math.round(Number.parseFloat(value)) : drawn;
	return (
		<span className="q-sb-guide__span">
			<span className="q-sb-guide__label">
				<Mono>{token}</Mono>
				<Num>{px}</Num>
				{label && <span>{label}</span>}
			</span>
			<span
				ref={ref}
				aria-hidden="true"
				className="q-sb-guide__span-bar"
				style={{ "--_w": cssVar(token) } as CSSProperties}
			/>
		</span>
	);
}
