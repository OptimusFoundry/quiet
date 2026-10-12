import type React from "react";
import "./StatusDot.scss";

/** Status indicator: a dot and a sentence-case label. Live takes the accent dot (a mark). */
export interface StatusDotProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
	ref?: React.Ref<HTMLSpanElement>;
	status?: "live" | "prototype" | "archived";
	/** Defaults to the status in sentence case ("Live", "Prototype", "Archived") */
	label?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

const LABELS: Record<string, string> = {
	live: "Live",
	prototype: "Prototype",
	archived: "Archived",
};

export function StatusDot({ label, status = "live", className, style, ...rest }: StatusDotProps) {
	const mod = status === "live" || status === "prototype" ? `q-status-dot--${status}` : null;
	return (
		<span
			{...rest}
			className={["q-status-dot", mod, className].filter(Boolean).join(" ")}
			style={style}
		>
			<span aria-hidden="true" className="q-status-dot__dot" />
			{label ?? LABELS[status] ?? status}
		</span>
	);
}
