import { type InputHTMLAttributes, type Ref, useId, useState } from "react";
import styles from "./Switch.module.scss";

export interface SwitchProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "onChange"> {
	label?: string;
	description?: string;
	size?: "sm" | "md" | "lg";
	labelPosition?: "left" | "right";
	onChange?: (checked: boolean) => void;
	ref?: Ref<HTMLInputElement>;
}

/** Ink-outlined pill: paper with an ink knob when off, ink with a paper knob when on. */
export function Switch({
	label,
	description,
	size = "md",
	labelPosition = "right",
	id,
	className,
	checked,
	defaultChecked,
	disabled,
	onChange,
	ref,
	...props
}: SwitchProps) {
	const auto = useId();
	const inputId = id ?? auto;
	// Tracked even when uncontrolled so aria-checked always mirrors the input.
	const [inner, setInner] = useState(Boolean(defaultChecked));
	const isOn = checked ?? inner;
	const text = (label || description) && (
		<span className={styles.text}>
			{label && <span className={styles.label}>{label}</span>}
			{description && <span className={styles.description}>{description}</span>}
		</span>
	);
	return (
		<label
			htmlFor={inputId}
			className={[styles.row, styles[size], className].filter(Boolean).join(" ")}
			data-disabled={disabled || undefined}
			data-label-left={labelPosition === "left" || undefined}
		>
			{labelPosition === "left" && text}
			<input
				ref={ref}
				id={inputId}
				type="checkbox"
				role="switch"
				aria-checked={isOn}
				checked={isOn}
				disabled={disabled}
				onChange={(e) => {
					setInner(e.target.checked);
					onChange?.(e.target.checked);
				}}
				className={styles.input}
				{...props}
			/>
			<span className={styles.track} aria-hidden="true">
				<span className={styles.thumb} />
			</span>
			{labelPosition === "right" && text}
		</label>
	);
}
