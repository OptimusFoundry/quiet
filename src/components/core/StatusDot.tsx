import type React from "react";
import "./StatusDot.scss";

/** Status indicator — the molten dot is one of molten's three permitted uses. */
export interface StatusDotProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
	ref?: React.Ref<HTMLSpanElement>;
	status?: "live" | "prototype" | "archived";
	label?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

export function StatusDot({ label, status = "live", className, style, ...rest }: StatusDotProps) {
	const mod = status === "live" || status === "prototype" ? `q-status-dot--${status}` : null;
	return (
		<span
			{...rest}
			className={["q-status-dot", mod, className].filter(Boolean).join(" ")}
			style={style}
		>
			<span aria-hidden="true" className="q-status-dot__dot" />
			{label ?? status}
		</span>
	);
}
