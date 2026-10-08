import type { ReactNode } from "react";
import styles from "./StatusDot.module.scss";

export type Status = "live" | "prototype" | "archived";

export interface StatusDotProps {
	status?: Status;
	/** Defaults to the status name. */
	label?: ReactNode;
	className?: string;
}

/** Mono caps status. The accent dot (live) is one of the accent's three permitted uses. */
export function StatusDot({ status = "live", label, className }: StatusDotProps) {
	return (
		<span className={[styles.status, className].filter(Boolean).join(" ")}>
			<span aria-hidden="true" className={styles.dot} data-status={status} />
			{label ?? status}
		</span>
	);
}
