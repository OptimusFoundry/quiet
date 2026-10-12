import React from "react";
import { Grid } from "./Grid";
import "./Stack.scss";

type StackDirection = "row" | "column" | "row-reverse" | "column-reverse";

export interface StackProps {
	direction?: StackDirection;
	/**
	 * Direction when the container is in the md band (720–960px by default). Inside a Grid the
	 * Grid's breakpoint rules, as for Col; elsewhere the Stack measures its parent element (give the
	 * parent a definite width, not one that depends on the Stack).
	 */
	directionMd?: StackDirection;
	/** Direction when the container is under 720px by default. Defaults to `directionMd`, then `direction` */
	directionSm?: StackDirection;
	/** Parent widths for the sm / md bands when not inside a Grid. Default [720, 960], as Grid */
	breakpoints?: [number, number];
	/** xs 8 · sm 16 · md 24 · lg 32 · xl 48 · 2xl 64, or px */
	gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | number;
	align?: React.CSSProperties["alignItems"];
	justify?: React.CSSProperties["justifyContent"];
	wrap?: boolean;
	/** Children rise in, 60ms apart */
	animated?: boolean;
	as?: keyof React.JSX.IntrinsicElements;
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

const GAPS: (string | number)[] = ["none", "xs", "sm", "md", "lg", "xl", "2xl"];
const DIRS: string[] = ["row", "column", "row-reverse", "column-reverse"];
const px = (v: string | number | undefined) => (typeof v === "number" ? `${v}px` : v);

/**
 * Flex row/column on the 8px grid.
 * @startingPoint section="Layout" subtitle="Flex stacks on the 8px grid" viewport="700x200"
 */
export function Stack({
	direction = "column",
	directionMd,
	directionSm,
	breakpoints = [720, 960],
	gap = "sm",
	align,
	justify,
	wrap = false,
	animated = false,
	as = "div",
	children,
	className,
	style,
}: StackProps) {
	const Tag = as as React.ElementType;
	const ref = React.useRef<HTMLElement>(null);
	const responsive = directionSm != null || directionMd != null;
	const gridBp = React.useContext(Grid.Ctx);
	const inGrid = gridBp != null;
	// Inside a Grid the Stack follows the Grid's breakpoint; otherwise it measures its parent.
	// Without directionSm/directionMd, nothing is measured.
	const [ownBp, setOwnBp] = React.useState<"sm" | "md" | "lg">("lg");
	React.useEffect(() => {
		const parent = ref.current?.parentElement;
		if (!responsive || !parent || inGrid || typeof ResizeObserver === "undefined") return;
		const ro = new ResizeObserver(([e]) => {
			const w = e!.contentRect.width;
			setOwnBp(w < breakpoints[0] ? "sm" : w < breakpoints[1] ? "md" : "lg");
		});
		ro.observe(parent);
		return () => ro.disconnect();
	}, [responsive, inGrid, breakpoints[0], breakpoints[1]]);
	const bp = !responsive ? "lg" : (gridBp ?? ownBp);
	const dir =
		bp === "sm"
			? (directionSm ?? directionMd ?? direction)
			: bp === "md"
				? (directionMd ?? direction)
				: direction;
	const named = GAPS.includes(gap);
	const cls = [
		"q-stack",
		DIRS.includes(dir) && `q-stack--${dir}`,
		named && `q-stack--gap-${gap}`,
		wrap && "q-stack--wrap",
		className,
	]
		.filter(Boolean)
		.join(" ");
	const vars = {
		...(!named && { "--_gap": px(gap) }),
		...(align && { "--_align": align }),
		...(justify && { "--_justify": justify }),
	};
	const kids = animated
		? React.Children.toArray(children).map((c, i) => (
				<div key={i} className="q-stack__item" style={{ "--_i": i } as React.CSSProperties}>
					{c}
				</div>
			))
		: children;
	return (
		<Tag ref={ref} className={cls} style={{ ...vars, ...style }}>
			{kids}
		</Tag>
	);
}
