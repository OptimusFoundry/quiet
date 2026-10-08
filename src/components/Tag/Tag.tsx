import { type ReactNode, useState } from "react";
import styles from "./Tag.module.scss";

export interface TagProps {
	children: ReactNode;
	tone?: "default" | "ink";
	size?: "sm" | "md";
	icon?: ReactNode;
	/** Small avatar rendered flush left. */
	avatar?: ReactNode;
	/** Shows a × button that calls this. */
	onRemove?: () => void;
	/** Toggle chip; selected = ink fill. */
	selectable?: boolean;
	selected?: boolean;
	defaultSelected?: boolean;
	onSelect?: (selected: boolean) => void;
	disabled?: boolean;
	className?: string;
}

/** Mono caps pill for stacks, categories and filters. */
export function Tag({
	children,
	tone = "default",
	size = "md",
	icon,
	avatar,
	onRemove,
	selectable = false,
	selected,
	defaultSelected = false,
	onSelect,
	disabled = false,
	className,
}: TagProps) {
	const [inner, setInner] = useState(defaultSelected);
	const on = selected ?? inner;
	const content = (
		<>
			{avatar}
			{icon && (
				<span aria-hidden="true" className={styles.icon}>
					{icon}
				</span>
			)}
			{children}
		</>
	);
	// The toggle and the × are siblings so neither interactive element nests inside the other.
	return (
		<span
			className={[styles.tag, styles[size], className].filter(Boolean).join(" ")}
			data-tone={tone}
			data-selectable={selectable || undefined}
			data-selected={(selectable && on) || undefined}
			data-avatar={avatar ? true : undefined}
			data-disabled={disabled || undefined}
		>
			{selectable ? (
				<button
					type="button"
					className={styles.toggle}
					aria-pressed={on}
					disabled={disabled}
					onClick={() => {
						setInner(!on);
						onSelect?.(!on);
					}}
				>
					{content}
				</button>
			) : (
				content
			)}
			{onRemove && (
				<button
					type="button"
					className={styles.remove}
					aria-label={`Remove ${typeof children === "string" ? children : ""}`.trim()}
					disabled={disabled}
					onClick={onRemove}
				>
					×
				</button>
			)}
		</span>
	);
}
