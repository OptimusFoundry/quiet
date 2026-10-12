import React from "react";
import "./BorderProgress.scss";

export interface BorderProgressProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
	/** The root <div> (the progressbar is its edge <svg>; `aria-label` names that). */
	ref?: React.Ref<HTMLDivElement>;
	value?: number;
	max?: number;
	/** Unknown length: a short segment travels the edge */
	indeterminate?: boolean;
	/** Accessible name for the progress (a string), e.g. "Rendering 3 clips" */
	label?: React.ReactNode;
	/** Accessible name when there is no string label; defaults to "Progress" */
	"aria-label"?: string;
	/** Spoken value, e.g. "2 of 3 clips"; defaults to the percentage */
	valueText?: string;
	/** The container being drawn, e.g. a Card */
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

/**
 * A container whose own edge is the progress bar. No bar inside the content: an ink stroke draws
 * clockwise from the top-left corner as the work completes, so any card tells you at a glance
 * whether it has finished becoming itself; a full ink edge means done. Wraps a Card (or anything
 * with the same radius). Evolved from the progress bar.
 * @startingPoint section="Future" subtitle="The edge is the progress" viewport="600x260"
 */
export function BorderProgress({
	value = 0,
	max = 100,
	indeterminate = false,
	label,
	"aria-label": ariaLabel,
	valueText,
	children,
	className,
	style,
	ref,
	...rest
}: BorderProgressProps) {
	const id = React.useId();
	const pct = Math.max(0, Math.min(1, value / max));
	const done = !indeterminate && pct >= 1;
	const cls = ["q-border-progress", indeterminate && "q-border-progress--indeterminate", className]
		.filter(Boolean)
		.join(" ");
	return (
		<div
			{...rest}
			ref={ref}
			className={cls}
			data-state={done ? "done" : pct === 0 && !indeterminate ? "idle" : "running"}
			aria-busy={!done || undefined}
			style={{ "--_progress": pct, ...style } as React.CSSProperties}
		>
			{children}
			<svg
				role="progressbar"
				aria-valuemin={0}
				aria-valuemax={max}
				aria-valuenow={indeterminate ? undefined : value}
				aria-valuetext={indeterminate ? undefined : (valueText ?? `${Math.round(pct * 100)}%`)}
				aria-label={
					ariaLabel || (typeof label === "string" ? label : label ? undefined : "Progress")
				}
				aria-labelledby={!ariaLabel && label && typeof label !== "string" ? id : undefined}
				className="q-border-progress__edge"
			>
				<rect pathLength="1" className="q-border-progress__stroke" />
			</svg>
			{label && typeof label !== "string" && (
				<span id={id} className="q-sr-only">
					{label}
				</span>
			)}
		</div>
	);
}
