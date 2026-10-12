import type React from "react";
import { Icon, type IconName } from "../core/Icon";
import "./EmptyState.scss";

/**
 * Nothing-here state: an icon on a round ground, a title, one honest sentence, actions.
 * @startingPoint section="Data" subtitle="Empty and no-result states" viewport="700x360"
 */
export interface EmptyStateProps {
	/** An icon name from the set (`Icon` `name`, e.g. "search", "file") or your own node, set on a round ground. Omit for none */
	icon?: IconName | React.ReactNode;
	eyebrow?: React.ReactNode;
	title?: React.ReactNode;
	description?: React.ReactNode;
	actions?: React.ReactNode;
	size?: "sm" | "md" | "lg";
	/** Sets the state on a soft ground (a placeholder area) */
	bordered?: boolean;
	align?: "center" | "start";
	/** Heading level for the title; default 3 */
	headingLevel?: 2 | 3 | 4 | 5 | 6;
	className?: string;
	style?: React.CSSProperties;
}

const SIZES: string[] = ["sm", "md", "lg"];

export function EmptyState({
	icon,
	eyebrow,
	title,
	description,
	actions,
	size = "md",
	bordered = false,
	align = "center",
	headingLevel = 3,
	className,
	style,
}: EmptyStateProps) {
	const H = `h${headingLevel}` as "h2" | "h3" | "h4" | "h5" | "h6";
	const cls = [
		"q-empty-state",
		`q-empty-state--${SIZES.includes(size) ? size : "md"}`,
		bordered && "q-empty-state--bordered",
		align !== "center" && "q-empty-state--start",
		className,
	]
		.filter(Boolean)
		.join(" ");
	return (
		<div className={cls} style={style}>
			{icon && (
				<span aria-hidden="true" className="q-empty-state__icon">
					{typeof icon === "string" ? <Icon name={icon} /> : icon}
				</span>
			)}
			{eyebrow && <span className="q-empty-state__eyebrow">{eyebrow}</span>}
			{title && (
				<H className="q-empty-state__title">
					{title}
					<span aria-hidden="true" className="q-empty-state__dot">
						.
					</span>
				</H>
			)}
			{description && <p className="q-empty-state__description">{description}</p>}
			{actions && <div className="q-empty-state__actions">{actions}</div>}
		</div>
	);
}
