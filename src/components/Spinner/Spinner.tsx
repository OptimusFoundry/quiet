import styles from "./Spinner.module.scss";

const SIZES = { xs: 12, sm: 16, md: 24, lg: 32, xl: 48 } as const;

export interface SpinnerProps {
	size?: keyof typeof SIZES | number;
	tone?: "default" | "muted" | "on-ink" | "accent";
	/** Visible mono caption; also the accessible name. Omit for "Loading". */
	label?: string;
}

export function Spinner({ size = "md", tone = "default", label }: SpinnerProps) {
	const px = typeof size === "number" ? size : SIZES[size];
	return (
		<span role="status" aria-label={label ?? "Loading"} className={styles.spinner}>
			<span
				className={styles.ring}
				data-tone={tone}
				data-heavy={px >= 32 || undefined}
				style={{ width: px, height: px }}
			/>
			{label && <span className={styles.label}>{label}</span>}
		</span>
	);
}
