import {
	type CSSProperties,
	type ReactNode,
	type RefObject,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { FilterTabs, Text } from "../../index";

// Story-only helpers for the Guidelines specimens (docs/guidelines/*). Measurements are read from
// the live tokens with getComputedStyle, so they follow density and theme. Molten marks redlines only.

export type Density = "app" | "compact" | "marketing";

const mono: CSSProperties = {
	fontFamily: "var(--q-font-mono)",
	fontSize: "var(--q-text-2xs)",
	letterSpacing: "var(--q-tracking-mono)",
	textTransform: "uppercase",
	color: "var(--q-fg-muted)",
};

export function Mono({ children, style }: { children: ReactNode; style?: CSSProperties }) {
	return <span style={{ ...mono, ...style }}>{children}</span>;
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
export function useVar(ref: RefObject<HTMLElement | null>, name: string) {
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
		<main
			aria-label={title}
			style={{
				maxWidth: "var(--q-w-max)",
				margin: "0 auto",
				padding: "var(--q-space-6) var(--q-space-page-x) var(--q-space-12)",
				boxSizing: "border-box",
				background: "var(--q-bg)",
				color: "var(--q-fg-body)",
				fontFamily: "var(--q-font-sans)",
				display: "grid",
				gap: "var(--q-space-6)",
				minWidth: 0,
			}}
		>
			<header style={{ display: "grid", gap: "var(--q-space-2)" }}>
				<Mono>Guidelines · docs/guidelines/{doc}</Mono>
				<Text as="h1" heading={2}>
					{title}
					<span style={{ color: "var(--q-accent)" }}>.</span>
				</Text>
				<Text size="lg" color="muted" style={{ maxWidth: "var(--q-w-form)" }}>
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
		<section
			style={{
				display: "grid",
				gap: "var(--q-space-3)",
				paddingTop: "var(--q-space-2)",
				borderTop: "var(--q-hairline) solid var(--q-fg)",
				minWidth: 0,
			}}
		>
			<div
				style={{
					display: "flex",
					flexWrap: "wrap",
					justifyContent: "space-between",
					alignItems: "flex-start",
					gap: "var(--q-space-2)",
				}}
			>
				<div style={{ display: "grid", gap: "var(--q-space-1)", maxWidth: "var(--q-w-form)" }}>
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
export function Gap({ token, note }: { token: string; note?: string }) {
	const ref = useRef<HTMLDivElement>(null);
	const px = useSize(ref, "height");
	return (
		<div
			ref={ref}
			style={{
				position: "relative",
				height: `var(${token})`,
				borderTop: "var(--q-hairline) dashed var(--q-accent)",
				borderBottom: "var(--q-hairline) dashed var(--q-accent)",
				boxSizing: "border-box",
				display: "flex",
				alignItems: "center",
				justifyContent: "flex-end",
				minHeight: "var(--q-space-1)",
			}}
		>
			<Mono style={{ background: "var(--q-bg)", paddingLeft: "var(--q-space-1)", lineHeight: 1 }}>
				{token} · {px}
				{note ? ` · ${note}` : ""}
			</Mono>
		</div>
	);
}

/** A horizontal redline used beside or inside a box: shows a padding/width token. */
export function Span({ token, label }: { token: string; label?: string }) {
	const ref = useRef<HTMLSpanElement>(null);
	const px = useSize(ref, "width");
	return (
		<span style={{ display: "inline-flex", alignItems: "center", gap: "var(--q-space-1)" }}>
			<span
				ref={ref}
				aria-hidden="true"
				style={{
					width: `var(${token})`,
					height: "var(--q-space-1)",
					borderLeft: "var(--q-hairline) solid var(--q-accent)",
					borderRight: "var(--q-hairline) solid var(--q-accent)",
					background:
						"linear-gradient(var(--q-accent), var(--q-accent)) center / 100% var(--q-hairline) no-repeat",
					boxSizing: "border-box",
					flex: "none",
				}}
			/>
			<Mono>
				{label ?? token} · {px}
			</Mono>
		</span>
	);
}

export const panel: CSSProperties = {
	display: "grid",
	gap: "var(--q-space-stack)",
	padding: "var(--q-space-card-pad)",
	border: "var(--q-hairline) solid var(--q-border)",
	borderRadius: "var(--q-radius-lg)",
	minWidth: 0,
};

export const well: CSSProperties = {
	display: "grid",
	gap: "var(--q-space-stack)",
	padding: "var(--q-space-card-pad)",
	background: "var(--q-bg-subtle)",
	borderRadius: "var(--q-radius-lg)",
	minWidth: 0,
};
