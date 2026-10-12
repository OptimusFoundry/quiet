import React from "react";
import { Avatar } from "../core/Avatar";
import { Button } from "../core/Button";
import { Tabs } from "../navigation/Tabs";
import "./BudgetLeash.scss";

export interface BudgetLeashProps extends React.HTMLAttributes<HTMLElement> {
	/** The root <section>. */
	ref?: React.Ref<HTMLElement>;
	/** The run or agent, e.g. "Meerkat · research run" */
	label: string;
	/**
	 * Mark for the agent; decorative (the title carries the name). A string renders as a square
	 * Avatar with its initials, e.g. `agent="Meerkat"`; pass a node for anything else.
	 */
	agent?: React.ReactNode;
	spent: number;
	cap: number;
	onCapChange?: (cap: number) => void;
	/** Leash lengths to pick from; shown only with `onCapChange` */
	presets?: number[];
	/** Amount "Give slack" adds to the cap */
	slack?: number;
	slackLabel?: string;
	/** Share of the cap where it starts slowing (default 0.6) */
	slowAt?: number;
	/** Share of the cap where it crawls and the line goes taut (default 0.85) */
	crawlAt?: number;
	/** Words for full speed, slowing, crawling, stopped */
	speeds?: [string, string, string, string];
	/** What happens at the cap, e.g. "asks before spending more" */
	atCap?: string;
	/** Number → display string (default "$40", "$8.40") */
	format?: (value: number) => string;
	className?: string;
	style?: React.CSSProperties;
}

const usd = (v: number) => `$${Number.isInteger(v) ? v : v.toFixed(2)}`;
const SPEEDS: [string, string, string, string] = [
	"full speed",
	"slowing",
	"crawling",
	"stopped at the leash",
];

/**
 * A spend limit on an agent drawn as a leash, not a hard stop. The slack line from the agent to
 * its cap sags while there is room and pulls taut (taking the accent) as it spends; the agent
 * slows before it stops, and you can see the tension from across the room. Read as a meter;
 * lengthen it with presets or "Give slack". Evolved from the budget cap.
 * @startingPoint section="Future" subtitle="A spend cap that goes taut" viewport="640x200"
 */
export function BudgetLeash({
	label,
	agent,
	spent = 0,
	cap,
	onCapChange,
	presets: presetList = [],
	slack,
	slackLabel = "Give slack",
	slowAt = 0.6,
	crawlAt = 0.85,
	speeds = SPEEDS,
	atCap,
	format = usd,
	className,
	style,
	ref,
	...rest
}: BudgetLeashProps) {
	const pct = cap > 0 ? Math.min(1, Math.max(0, spent / cap)) : 0;
	const level = pct >= 1 ? 3 : pct >= crawlAt ? 2 : pct >= slowAt ? 1 : 0;
	const speed = speeds[level];
	const uid = React.useId();
	const sag = 20 + (1 - pct) * 34;
	const x = pct * 100;
	const cls = ["q-budget-leash", level >= 2 && "q-budget-leash--taut", className]
		.filter(Boolean)
		.join(" ");
	// Presets change the cap, so without onCapChange there is nothing for them to do.
	const presets = onCapChange ? presetList : [];
	return (
		<section
			{...rest}
			ref={ref}
			aria-labelledby={`${uid}l`}
			className={cls}
			style={{ "--_pct": `${x}%`, ...style } as React.CSSProperties}
		>
			<header className="q-budget-leash__header">
				<div className="q-budget-leash__who">
					{agent && (
						<span aria-hidden="true" className="q-budget-leash__agent">
							{typeof agent === "string" ? <Avatar name={agent} size="sm" shape="square" /> : agent}
						</span>
					)}
					<div className="q-budget-leash__heading">
						<span id={`${uid}l`} className="q-budget-leash__label">
							{label}
						</span>
						<span aria-hidden="true" className="q-budget-leash__speed">
							{speed.charAt(0).toUpperCase() + speed.slice(1)}
							{level === 3 && atCap ? ` · ${atCap}` : ""}
						</span>
					</div>
				</div>
				<span aria-hidden="true" className="q-budget-leash__amount">
					{format(spent)} <span className="q-budget-leash__cap">/ {format(cap)}</span>
				</span>
			</header>
			<div
				role="meter"
				aria-labelledby={`${uid}l`}
				aria-valuemin={0}
				aria-valuemax={cap}
				aria-valuenow={Math.min(spent, cap)}
				aria-valuetext={`${format(spent)} of ${format(cap)}, ${speed}`}
				className="q-budget-leash__track"
			>
				<span className="q-budget-leash__rail" />
				<span className="q-budget-leash__fill" />
				<svg
					aria-hidden="true"
					viewBox="0 0 100 40"
					preserveAspectRatio="none"
					className="q-budget-leash__line"
				>
					<path
						d={`M ${x} 20 Q ${(x + 100) / 2} ${sag} 100 20`}
						vectorEffect="non-scaling-stroke"
					/>
				</svg>
				<span className="q-budget-leash__stake" />
				<span className="q-budget-leash__runner" />
			</div>
			{(presets.length > 0 || (slack && onCapChange)) && (
				<div className="q-budget-leash__controls">
					{presets.length > 0 && (
						<div className="q-budget-leash__presets">
							<span aria-hidden="true" className="q-budget-leash__presets-label">
								Leash
							</span>
							<Tabs
								variant="enclosed"
								size="sm"
								label="Leash length"
								value={String(cap)}
								tabs={presets.map((p) => ({ value: String(p), label: format(p) }))}
								onChange={(v: string) => onCapChange?.(Number(v))}
							/>
						</div>
					)}
					{slack && onCapChange && (
						<Button size="sm" variant="ghost" onClick={() => onCapChange(cap + slack)}>
							{slackLabel} · +{format(slack)}
						</Button>
					)}
				</div>
			)}
			<p role="status" className="q-sr-only">
				{level ? `${label}: ${speed}${level === 3 && atCap ? `, ${atCap}` : ""}` : ""}
			</p>
		</section>
	);
}
