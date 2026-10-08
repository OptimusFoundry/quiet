import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { Kbd } from "../Kbd/Kbd";
import styles from "./Button.module.scss";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "ghost";
	size?: "sm" | "md" | "lg";
	icon?: ReactNode;
	/** Keyboard shortcut shown inside the button, e.g. "N" or "⌘↵". */
	kbd?: string;
	ref?: Ref<HTMLButtonElement>;
}

export function Button({
	variant = "secondary",
	size = "md",
	icon,
	kbd,
	className,
	children,
	type = "button",
	ref,
	...props
}: ButtonProps) {
	return (
		<button
			ref={ref}
			type={type}
			className={[styles.button, styles[variant], styles[size], className]
				.filter(Boolean)
				.join(" ")}
			{...props}
		>
			{icon && <span className={styles.icon}>{icon}</span>}
			{children}
			{kbd && <Kbd tone={variant === "primary" ? "inverse" : "default"}>{kbd}</Kbd>}
		</button>
	);
}
