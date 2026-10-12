import type React from "react";
import { isDev } from "../../lib/env";
import { Icon } from "../core/Icon";
import "./parts.scss";

// Shared marks for the feedback and overlay components (not exported from the package: a lowercase
// file, so `npm run gen` skips it). One close button and one status icon, so every surface that
// dismisses or carries a status draws them the same way.

export type FeedbackStatus = "info" | "success" | "warning" | "error";

const STATUS_ICON: Record<FeedbackStatus, string> = {
	info: "info",
	success: "check",
	warning: "warning",
	error: "warning",
};

export const isStatus = (s: unknown): s is FeedbackStatus =>
	typeof s === "string" && s in STATUS_ICON;

/** A bare status icon in its status colour (the theme's status fg token). Decorative. */
export function StatusIcon({
	status,
	size = "md",
	className,
}: {
	status: FeedbackStatus;
	size?: "md" | "lg";
	className?: string;
}) {
	return (
		<Icon
			name={STATUS_ICON[status]}
			size={size === "lg" ? "xl" : "md"}
			className={["q-status-icon", `q-status-icon--${status}`, className].filter(Boolean).join(" ")}
		/>
	);
}

/** The square close button with the stroke cross. `label` names what it closes. */
export function CloseButton({
	label,
	onClick,
	className,
	...rest
}: {
	label: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label">) {
	return (
		<button
			type="button"
			{...rest}
			aria-label={label}
			onClick={onClick}
			className={["q-close-button", className].filter(Boolean).join(" ")}
		>
			<Icon name="close" />
		</button>
	);
}

const warned = new Set<string>();
/** Warns once per message in development: a deprecated prop or variant that now does nothing. */
export function warnDeprecated(message: string): void {
	if (!isDev() || warned.has(message)) return;
	warned.add(message);
	console.warn(`quiet: ${message}`);
}
