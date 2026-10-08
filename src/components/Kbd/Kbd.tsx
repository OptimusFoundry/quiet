import type { ReactNode } from "react";
import styles from "./Kbd.module.scss";

export function Kbd({
	children,
	tone = "default",
}: {
	children: ReactNode;
	tone?: "default" | "inverse";
}) {
	return <kbd className={`${styles.kbd} ${styles[tone]}`}>{children}</kbd>;
}
