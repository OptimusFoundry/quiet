import type React from "react";
import { useLinkElement } from "../../lib/link";
import { Icon } from "./Icon";
import "./Link.scss";

/**
 * Inline text link in the accent text colour, with a soft underline that firms up on hover.
 * @startingPoint section="Actions" subtitle="Inline text links" viewport="600x160"
 */
export interface LinkProps
	extends Omit<
		React.AnchorHTMLAttributes<HTMLAnchorElement>,
		"href" | "children" | "className" | "style"
	> {
	href?: string;
	ref?: React.Ref<HTMLAnchorElement>;
	variant?: "default" | "primary" | "muted";
	size?: "inherit" | "sm" | "md" | "lg";
	underline?: "hover" | "always" | "none";
	/** Opens in a new tab and appends an arrow-up-right icon */
	external?: boolean;
	rightIcon?: React.ReactNode;
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

const SIZES: string[] = ["sm", "md", "lg"];

export function Link({
	href = "#",
	variant = "default",
	size = "inherit",
	underline = "hover",
	external = false,
	rightIcon,
	children,
	className,
	style,
	...rest
}: LinkProps) {
	const cls = [
		"q-link",
		variant === "primary" || variant === "muted" ? `q-link--${variant}` : null,
		SIZES.includes(size) && `q-link--${size}`,
		`q-link--underline-${underline}`,
		className,
	]
		.filter(Boolean)
		.join(" ");
	const A = useLinkElement(href, external);
	return (
		<A
			href={href}
			target={external ? "_blank" : undefined}
			rel={external ? "noopener noreferrer" : undefined}
			{...rest}
			className={cls}
			style={style}
		>
			{children}
			{rightIcon ? (
				<span aria-hidden="true" className="q-link__icon">
					{rightIcon}
				</span>
			) : (
				external && <Icon name="arrow-up-right" className="q-link__icon" />
			)}
			{external && <span className="q-sr-only"> (opens in new tab)</span>}
		</A>
	);
}
