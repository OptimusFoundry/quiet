import { type InputHTMLAttributes, type ReactNode, type Ref, useId } from "react";
import { Kbd } from "../Kbd/Kbd";
import styles from "./Input.module.scss";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
	/** Mono caps label above the field. */
	label?: string;
	hint?: string;
	/** Replaces the hint and marks the field invalid. */
	error?: string;
	icon?: ReactNode;
	kbd?: string;
	/** Field height: sm 36 · md 48 · lg 56. */
	size?: "sm" | "md" | "lg";
	ref?: Ref<HTMLInputElement>;
}

export function Input({
	label,
	hint,
	error,
	icon,
	kbd,
	size = "md",
	id,
	className,
	ref,
	...props
}: InputProps) {
	const auto = useId();
	const inputId = id ?? auto;
	const noteId = `${inputId}-note`;
	const note = error || hint;
	return (
		<span className={[styles.wrap, className].filter(Boolean).join(" ")}>
			{label && (
				<label htmlFor={inputId} className={styles.label}>
					{label}
				</label>
			)}
			<span className={`${styles.field} ${styles[size]}`} data-invalid={error ? true : undefined}>
				{icon && <span className={styles.icon}>{icon}</span>}
				<input
					ref={ref}
					id={inputId}
					className={styles.input}
					aria-invalid={error ? true : undefined}
					aria-describedby={note ? noteId : undefined}
					{...props}
				/>
				{kbd && <Kbd>{kbd}</Kbd>}
			</span>
			{note && (
				<span id={noteId} className={styles.note} data-error={error ? true : undefined}>
					{note}
				</span>
			)}
		</span>
	);
}
