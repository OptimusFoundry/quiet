import React from "react";
import { Icon } from "./Icon";
import "./Tag.scss";

export interface TagProps extends Omit<React.HTMLAttributes<HTMLElement>, "children" | "onSelect"> {
	/**
	 * The root: a <span>, or the toggle <button> when `selectable`. A selectable tag that is also
	 * removable renders a <span> holding the toggle and the × as sibling buttons.
	 */
	ref?: React.Ref<HTMLElement>;
	children?: React.ReactNode;
	/** default · strong (a deeper ground, for emphasis). `ink` is a deprecated alias of strong */
	tone?: "default" | "strong" | "ink";
	/** quiet addition: semantic status colour, from the theme's --q-status-* tokens */
	status?: "info" | "success" | "warning" | "error";
	size?: "sm" | "md";
	icon?: React.ReactNode;
	/** Small Avatar (size 'xs') rendered flush left */
	avatar?: React.ReactNode;
	/** Shows a close icon that calls this */
	onRemove?: () => void;
	/** Toggle chip; selected = accent tint */
	selectable?: boolean;
	selected?: boolean;
	defaultSelected?: boolean;
	onSelect?: (selected: boolean) => void;
	disabled?: boolean;
	className?: string;
	style?: React.CSSProperties;
}

const STATUSES: unknown[] = ["info", "success", "warning", "error"];

/**
 * Small sans pill for stacks, categories and filters. Removable and selectable (selected = accent tint).
 * @startingPoint section="Primitives" subtitle="Pills — removable, selectable" viewport="700x180"
 */
export function Tag({
	children,
	tone = "default",
	status,
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
	style,
	onClick,
	ref,
	...rest
}: TagProps) {
	const [inner, setInner] = React.useState(defaultSelected);
	const [leaving, setLeaving] = React.useState(false);
	const on = selected ?? inner;
	// Buttons can't nest: with a ×, the toggle becomes its own button beside it.
	const split = selectable && !!onRemove;
	const El = selectable && !split ? "button" : "span";
	const toggle = () => {
		if (!selectable || disabled) return;
		setInner(!on);
		onSelect?.(!on);
	};
	// Fade out, then hand the removal to the parent (immediately under reduced motion).
	const remove = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		if (leaving) return;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		setLeaving(true);
		setTimeout(
			() => {
				setLeaving(false);
				onRemove!();
			},
			reduce ? 0 : 160,
		);
	};
	const removeName = `Remove${typeof children === "string" || typeof children === "number" ? ` ${children}` : ""}`;
	const cls = [
		"q-tag",
		size === "sm" && "q-tag--sm",
		(tone === "strong" || tone === "ink") && "q-tag--strong",
		STATUSES.includes(status) && `q-tag--${status}`,
		selectable && "q-tag--selectable",
		avatar && "q-tag--with-avatar",
		disabled && "q-tag--disabled",
		leaving && "q-anim-fade",
		className,
	]
		.filter(Boolean)
		.join(" ");
	const content = (
		<>
			{avatar}
			{icon && (
				<span aria-hidden="true" className="q-tag__icon">
					{icon}
				</span>
			)}
			{children}
		</>
	);
	return (
		<El
			ref={ref as React.Ref<HTMLButtonElement>}
			{...rest}
			onClick={(e: React.MouseEvent<HTMLElement>) => {
				onClick?.(e);
				if (!split) toggle();
			}}
			disabled={El === "button" ? disabled : undefined}
			aria-pressed={El === "button" ? on : undefined}
			type={El === "button" ? "button" : undefined}
			className={cls}
			data-state={leaving ? "closing" : undefined}
			style={style}
		>
			{split ? (
				<button
					type="button"
					aria-pressed={on}
					disabled={disabled}
					onClick={toggle}
					className="q-tag__select"
				>
					{content}
				</button>
			) : (
				content
			)}
			{onRemove && (
				<button
					type="button"
					aria-label={removeName}
					disabled={disabled}
					onClick={remove}
					className="q-tag__remove"
				>
					<Icon name="close" />
				</button>
			)}
		</El>
	);
}
