import type React from "react";
import "./UncertaintyCell.scss";

export interface UncertaintyCellProps
	extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
	value: number;
	/** Symmetric error: shown as ±error, range value−error … value+error */
	error?: number;
	/** Asymmetric bounds (override `error`) */
	low?: number;
	high?: number;
	/** The column's scale [min, max] — pass the same one to every cell so bands compare. Default: 0 … the cell's high */
	domain?: [number, number];
	format?: (value: number) => string;
	/** Hide the band but keep the ± text and the heavier/lighter weights */
	showBand?: boolean;
	/** Spoken text for an uncertain value; default `"<value>, likely between <low> and <high>"` */
	describe?: (value: number, low: number, high: number) => string;
	/** The root <span>. */
	ref?: React.Ref<HTMLSpanElement>;
	className?: string;
	style?: React.CSSProperties;
}

const plain = (v: number) => (typeof v === "number" ? v.toLocaleString("en-US") : String(v));

/**
 * A table number that carries its doubt, because a forecast and a count shouldn't look the same.
 * Forecasts get a small track beside the number with their range shaded on the column's shared
 * `domain`; measured values (no range) are set heavier. Screen readers hear the range ("5,400,
 * likely between 4,780 and 6,020"). Use it in a Table column's `render`. Evolved from plain
 * numeric cells.
 * @startingPoint section="Future" subtitle="Uncertainty cell" viewport="700x240"
 */
export function UncertaintyCell({
	value,
	error,
	low,
	high,
	domain,
	format,
	showBand = true,
	describe,
	ref,
	className,
	style,
	...rest
}: UncertaintyCellProps) {
	const lo = low ?? (error != null ? value - error : undefined);
	const hi = high ?? (error != null ? value + error : undefined);
	const uncertain = lo != null && hi != null && hi > lo;
	const fmt = format || plain;
	const [dMin, dMax] = domain || [Math.min(0, lo ?? value), Math.max(hi ?? value, value)];
	const at = (v: number) =>
		dMax === dMin ? 0 : Math.min(1, Math.max(0, (v - dMin) / (dMax - dMin)));
	// "±620" when the error is symmetric, otherwise the bounds.
	// Built only for an uncertain value: a measured one has no low/high to format.
	const range = !uncertain ? "" : error != null ? `±${fmt(error)}` : `${fmt(lo!)}–${fmt(hi!)}`;
	const spoken = uncertain
		? describe
			? describe(value, lo, hi)
			: `${fmt(value)}, likely between ${fmt(lo)} and ${fmt(hi)}`
		: fmt(value);
	const band = uncertain && showBand;
	const cls = [
		"q-uncertainty-cell",
		uncertain ? "q-uncertainty-cell--uncertain" : "q-uncertainty-cell--measured",
		className,
	]
		.filter(Boolean)
		.join(" ");
	return (
		<span
			{...rest}
			ref={ref}
			className={cls}
			style={
				band
					? ({
							"--_lo": at(lo!),
							"--_hi": at(hi!),
							"--_v": at(value),
							...style,
						} as React.CSSProperties)
					: style
			}
		>
			{band && (
				<span aria-hidden="true" className="q-uncertainty-cell__track">
					<span className="q-uncertainty-cell__band" />
					<span className="q-uncertainty-cell__point" />
				</span>
			)}
			<span aria-hidden="true" className="q-uncertainty-cell__value">
				{fmt(value)}
				{uncertain && <span className="q-uncertainty-cell__range">{range}</span>}
			</span>
			<span className="q-sr-only">{spoken}</span>
		</span>
	);
}
