import type { ReactNode } from "react";
import styles from "./Badge.module.scss";

type Variant = "default" | "primary" | "secondary" | "outline" | "success" | "warning" | "error";
const STATUS_DOT: Partial<Record<Variant, "ink" | "hollow" | "accent">> = {
	success: "ink",
	warning: "hollow",
	error: "accent",
};

export interface BadgeProps {
	variant?: Variant;
	size?: "sm" | "md" | "lg";
	/** Leading dot; on by default for success, warning and error. */
	dot?: boolean;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	/** Numeric badge; collapses to max+. */
	count?: number;
	max?: number;
	children?: ReactNode;
	className?: string;
}

/** Sans pill for counts and statuses. Status reads through the dot, never a colour fill. */
export function Badge({
	variant = "default",
	size = "md",
	dot,
	leftIcon,
	rightIcon,
	count,
	max = 99,
	children,
	className,
}: BadgeProps) {
	const showDot = dot ?? (Boolean(STATUS_DOT[variant]) && !leftIcon);
	const dotKind = STATUS_DOT[variant] ?? (variant === "primary" ? "on-ink" : "ink");
	const isCount = count != null;
	return (
		<span
			className={[styles.badge, styles[variant], styles[size], className].filter(Boolean).join(" ")}
			data-count={isCount || undefined}
		>
			{showDot && <span aria-hidden="true" className={styles.dot} data-kind={dotKind} />}
			{leftIcon}
			{isCount ? (count > max ? `${max}+` : count) : children}
			{rightIcon}
		</span>
	);
}
