import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { Kbd } from "../Kbd/Kbd";
import { Spinner } from "../Spinner/Spinner";
import styles from "./Button.module.scss";

interface Shared {
	variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
	size?: "sm" | "md" | "lg";
	/** Trailing → that nudges 4px on hover. */
	arrow?: boolean;
	/** Shows a spinner and blocks clicks. */
	loading?: boolean;
	fullWidth?: boolean;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	/** Icon-only circle; pass aria-label. */
	icon?: ReactNode;
	/** Keyboard shortcut shown inside the button, e.g. "N" or "⌘↵". */
	kbd?: string;
}

type AsButton = Shared &
	ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; ref?: Ref<HTMLButtonElement> };
type AsLink = Shared &
	AnchorHTMLAttributes<HTMLAnchorElement> & {
		href: string;
		disabled?: boolean;
		ref?: Ref<HTMLAnchorElement>;
	};
export type ButtonProps = AsButton | AsLink;

/** Pill button. Ink primary; never filled with the accent. Press: no shrink, no bounce. */
export function Button(props: ButtonProps) {
	const {
		variant = "primary",
		size = "md",
		arrow = false,
		loading = false,
		fullWidth = false,
		leftIcon,
		rightIcon,
		icon,
		kbd,
		className,
		children,
		...rest
	} = props;
	const iconOnly = icon != null && children == null;
	const cls = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(" ");
	const data = {
		"data-icon-only": iconOnly || undefined,
		"data-full": fullWidth || undefined,
		"aria-busy": loading || undefined,
	};
	const inner = (
		<>
			{loading ? (
				<Spinner
					size={size === "lg" ? 16 : size === "sm" ? 12 : 14}
					tone={variant === "primary" ? "on-ink" : "default"}
				/>
			) : (
				leftIcon
			)}
			{iconOnly && !loading && icon}
			{children}
			{rightIcon}
			{kbd && <Kbd tone={variant === "primary" ? "inverse" : "default"}>{kbd}</Kbd>}
			{arrow && (
				<span aria-hidden="true" className={styles.arrow}>
					→
				</span>
			)}
		</>
	);

	if (rest.href !== undefined && !rest.disabled && !loading) {
		const { ref, disabled: _d, ...anchor } = rest as AsLink;
		return (
			<a ref={ref} className={cls} {...data} {...anchor}>
				{inner}
			</a>
		);
	}
	const { ref, disabled, type = "button", href: _h, ...button } = rest as AsButton;
	return (
		<button
			ref={ref}
			type={type}
			className={cls}
			disabled={disabled || loading}
			data-disabled={disabled || undefined}
			{...data}
			{...button}
		>
			{inner}
		</button>
	);
}
