import {
	type CSSProperties,
	type ReactNode,
	type RefObject,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { FilterTabs, Text } from "../../index";
import { cssVar, type TokenName } from "../../styles/tokens.generated";
import "./Guide.scss";

// Story-only helpers for the Guidelines specimens (docs/guidelines/*). Measurements are read from
// the live tokens with getComputedStyle, so they follow density and theme. Molten marks redlines only.

export type Density = "app" | "compact" | "marketing";

/** Panel and well containers for specimens: add to a `className`. */
export const panel = "q-sb-guide__panel";
export const well = "q-sb-guide__well";

export function Mono({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<span className={className ? `q-sb-guide__mono ${className}` : "q-sb-guide__mono"}>
			{children}
		</span>
	);
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
			<header className="q-sb-guide__header">
				<Mono>Guidelines · docs/guidelines/{doc}</Mono>
				<Text as="h1" heading={2}>
					{title}
					<span className="q-sb-guide__accent">.</span>
				</Text>
				<Text size="lg" color="muted" className="q-sb-guide__intro">
					{intro}
				</Text>
			</header>
			{children}
		</main>
	);
}

/** One specimen block: an h2 with the rule it shows. */
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
		<section className="q-sb-guide__part">
			<div className="q-sb-guide__part-head">
				<div className="q-sb-guide__part-title">
					<Text as="h2" heading={4}>
						{title}
					</Text>
					{rule && (
						<Text size="sm" color="muted">
							{rule}
						</Text>
					)}
				</div>
				{aside}
			</div>
			{children}
		</section>
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
		<FilterTabs
			size="sm"
			label={label}
			value={value}
			onChange={(v) => onChange(v as Density)}
			items={[
				{ value: "app", label: "App" },
				{ value: "compact", label: "Compact" },
				{ value: "marketing", label: "Marketing" },
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
			<Mono className="q-sb-guide__gap-label">
				{token} · {px}
				{note ? ` · ${note}` : ""}
			</Mono>
		</div>
	);
}

/** A horizontal redline used beside or inside a box: shows a padding/width token. */
export function Span({ token, label }: { token: TokenName; label?: string }) {
	const ref = useRef<HTMLSpanElement>(null);
	const px = useSize(ref, "width");
	return (
		<span className="q-sb-guide__span">
			<span
				ref={ref}
				aria-hidden="true"
				className="q-sb-guide__span-bar"
				style={{ "--_w": cssVar(token) } as CSSProperties}
			/>
			<Mono>
				{label ?? token} · {px}
			</Mono>
		</span>
	);
}
