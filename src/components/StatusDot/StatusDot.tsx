import type { ReactNode } from "react";
import styles from "./StatusDot.module.scss";

export type StatusTone = "success" | "warning" | "danger" | "accent" | "neutral";

/** State as a small dot + grey label — the references never use solid status fills. */
export function StatusDot({
	tone = "neutral",
	pulse = false,
	children,
}: {
	tone?: StatusTone;
	pulse?: boolean;
	children: ReactNode;
}) {
	return (
		<span className={styles.status}>
			<span
				className={`${styles.dot} ${styles[tone]} ${pulse ? styles.pulse : ""}`}
				aria-hidden="true"
			/>
			{children}
		</span>
	);
}
