import type { ReactNode } from "react";
import styles from "./Eyebrow.module.scss";

export interface EyebrowProps {
	/** Serial shown in ink before the label, e.g. "01" or "01 / 14". */
	index?: ReactNode;
	tone?: "muted" | "ink";
	children: ReactNode;
	className?: string;
}

/** Mono caps label above a headline or section. */
export function Eyebrow({ index, tone = "muted", children, className }: EyebrowProps) {
	return (
		<div className={[styles.eyebrow, className].filter(Boolean).join(" ")} data-tone={tone}>
			{index != null && <span className={styles.index}>{index}</span>}
			<span>{children}</span>
		</div>
	);
}
