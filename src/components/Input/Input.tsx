import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import { Kbd } from "../Kbd/Kbd";
import styles from "./Input.module.scss";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
	icon?: ReactNode;
	kbd?: string;
	ref?: Ref<HTMLInputElement>;
}

export function Input({ icon, kbd, className, ref, ...props }: InputProps) {
	return (
		<span className={[styles.field, className].filter(Boolean).join(" ")}>
			{icon && <span className={styles.icon}>{icon}</span>}
			<input ref={ref} className={styles.input} {...props} />
			{kbd && <Kbd>{kbd}</Kbd>}
		</span>
	);
}
