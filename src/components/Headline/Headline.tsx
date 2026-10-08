import type { ElementType, ReactNode } from "react";
import styles from "./Headline.module.scss";

const TAGS = { display: "h1", h2: "h2", h3: "h3", h4: "h4" } as const;

export interface HeadlineProps {
	size?: keyof typeof TAGS;
	/** Override the rendered tag, e.g. a display-sized h2. */
	as?: ElementType;
	/** Upright text before the accent. */
	lead?: ReactNode;
	/** The single italic phrase. */
	accent?: ReactNode;
	/** Upright text after the accent. */
	after?: ReactNode;
	/** Append the accent-coloured full stop. Default true. */
	period?: boolean;
	/** Colour the italic phrase with the accent (then drop other accent use on the surface). */
	tintAccent?: boolean;
	className?: string;
}

/** Plain lead, one italic phrase, accent full stop: "Heavy software, *quietly made*." */
export function Headline({
	size = "h2",
	as,
	lead,
	accent,
	after,
	period = true,
	tintAccent = false,
	className,
}: HeadlineProps) {
	const Tag = as ?? TAGS[size];
	return (
		<Tag className={[styles.headline, styles[size], className].filter(Boolean).join(" ")}>
			{lead}
			{lead && accent ? " " : ""}
			{accent && <em className={tintAccent ? styles.tinted : undefined}>{accent}</em>}
			{after ? (accent ? " " : "") : ""}
			{after}
			{period && (
				<span className={styles.period} aria-hidden="true">
					.
				</span>
			)}
		</Tag>
	);
}
