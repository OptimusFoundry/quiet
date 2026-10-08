import { type InputHTMLAttributes, type Ref, useId, useState } from "react";
import styles from "./Switch.module.scss";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
	label?: string;
	description?: string;
	ref?: Ref<HTMLInputElement>;
}

export function Switch({
	label,
	description,
	id,
	className,
	checked,
	defaultChecked,
	onChange,
	ref,
	...props
}: SwitchProps) {
	const auto = useId();
	const inputId = id ?? auto;
	// Tracked even when uncontrolled so aria-checked always mirrors the input.
	const [inner, setInner] = useState(Boolean(defaultChecked));
	const isOn = checked ?? inner;
	return (
		<label htmlFor={inputId} className={[styles.row, className].filter(Boolean).join(" ")}>
			{(label || description) && (
				<span className={styles.text}>
					{label && <span className={styles.label}>{label}</span>}
					{description && <span className={styles.description}>{description}</span>}
				</span>
			)}
			<input
				ref={ref}
				id={inputId}
				type="checkbox"
				role="switch"
				aria-checked={isOn}
				checked={isOn}
				onChange={(e) => {
					setInner(e.target.checked);
					onChange?.(e);
				}}
				className={styles.input}
				{...props}
			/>
			<span className={styles.track} aria-hidden="true">
				<span className={styles.thumb} />
			</span>
		</label>
	);
}
