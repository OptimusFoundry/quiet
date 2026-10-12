import type React from "react";
import "./Headline.scss";

export interface HeadlineProps extends Omit<React.HTMLAttributes<HTMLHeadingElement>, "children"> {
	/** The rendered heading (or the `as` element). */
	ref?: React.Ref<HTMLElement>;
	size?: "display" | "h2" | "h3" | "h4";
	/** Override the rendered tag */
	as?: keyof React.JSX.IntrinsicElements;
	/** The headline text */
	lead?: React.ReactNode;
	/** More text after `lead`, joined with a space */
	after?: React.ReactNode;
	/** Append the accent full stop where the theme shows it. Default true. */
	period?: boolean;
	className?: string;
	style?: React.CSSProperties;
}

const TAGS: Record<string, "h1" | "h2" | "h3" | "h4"> = {
	display: "h1",
	h2: "h2",
	h3: "h3",
	h4: "h4",
};

/**
 * Headline in Geist at the display and heading steps, with an optional accent full stop (off in
 * the default themes, `--q-period-display`).
 * @startingPoint section="Typography" subtitle="Display and heading steps" viewport="700x320"
 */
export function Headline({
	size = "h2",
	as,
	lead,
	after,
	period = true,
	className,
	style,
	...rest
}: HeadlineProps) {
	const Tag = (as || TAGS[size])! as React.ElementType;
	const cls = ["q-headline", TAGS[size] && `q-headline--${size}`, className]
		.filter(Boolean)
		.join(" ");
	return (
		<Tag {...rest} className={cls} style={style}>
			{lead}
			{lead && after ? " " : ""}
			{after}
			{period && <span className="q-headline__period">.</span>}
		</Tag>
	);
}
