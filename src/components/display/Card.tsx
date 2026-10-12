import type React from "react";
import { useLinkElement } from "../../lib/link";
import "./Card.scss";

export interface CardProps {
	eyebrow?: React.ReactNode;
	title?: React.ReactNode;
	children?: React.ReactNode;
	/** Metadata in the footer row, set as a label */
	meta?: React.ReactNode;
	/** Right side of the footer row (e.g. an `Icon`) */
	footer?: React.ReactNode;
	href?: string;
	/** Also called on Enter/Space when the card acts as a button */
	onClick?: (event: React.SyntheticEvent<HTMLElement>) => void;
	className?: string;
	style?: React.CSSProperties;
}

/**
 * Content on a soft ground (`--q-bg-subtle`, `--q-radius-lg`), no border. When it is a link or a
 * button, the ground deepens on hover and keyboard focus.
 * @startingPoint section="Display" subtitle="Work card on a ground" viewport="700x320"
 */
export function Card({
	eyebrow,
	title,
	children,
	meta,
	footer,
	href,
	onClick,
	className,
	style,
}: CardProps) {
	const interactive = !!(href || onClick);
	const A = useLinkElement(href);
	const El: React.ElementType = href ? A : "div";
	return (
		<El
			href={href}
			onClick={onClick}
			{...(!href && onClick
				? {
						role: "button",
						tabIndex: 0,
						onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
							if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
								e.preventDefault();
								onClick!(e);
							}
						},
					}
				: {})}
			className={["q-card", interactive && "q-card--interactive", className]
				.filter(Boolean)
				.join(" ")}
			style={style}
		>
			{eyebrow && <div className="q-card__eyebrow">{eyebrow}</div>}
			{title && <div className="q-card__title">{title}</div>}
			{children && <div className="q-card__body">{children}</div>}
			{(meta || footer) && (
				<div className="q-card__footer">
					{meta && <div className="q-card__meta">{meta}</div>}
					{footer}
				</div>
			)}
		</El>
	);
}
