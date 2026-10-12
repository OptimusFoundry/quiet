import React from "react";
import "./Banner.scss";
import { CloseButton, isStatus, StatusIcon, warnDeprecated } from "./parts";

export interface BannerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
	/** The root <div> (the strip). */
	ref?: React.Ref<HTMLDivElement>;
	/**
	 * @deprecated Banner has one look (its status ground); drop the prop. `"paper"` is accepted
	 * silently, `"outline"` warns once in development.
	 */
	variant?: "paper" | "outline";
	status?: "info" | "success" | "warning" | "error";
	title?: React.ReactNode;
	children?: React.ReactNode;
	action?: React.ReactNode;
	dismissible?: boolean;
	onDismiss?: () => void;
	/** Landmark name when there is no title; defaults to "Notice" */
	label?: string;
	className?: string;
	style?: React.CSSProperties;
}

/**
 * Full-width page-level strip above the header or app content, on its status ground.
 * @startingPoint section="Feedback" subtitle="Page-level strips" viewport="900x320"
 */
export function Banner({
	variant,
	status = "info",
	title,
	children,
	action,
	onDismiss,
	dismissible = true,
	label,
	className,
	style,
	ref,
	...rest
}: BannerProps) {
	// quiet: dismiss collapses the strip's height (0 rest · 1 wrapped · 2 collapsing · 3 gone).
	const [leave, setLeave] = React.useState(0);
	const id = React.useId();
	// The latest onDismiss runs when the collapse ends; a new handler identity doesn't restart the timer.
	const dismissed = React.useEffectEvent(() => onDismiss?.());
	React.useEffect(() => {
		if (leave === 1) {
			let r = requestAnimationFrame(() => {
				r = requestAnimationFrame(() => setLeave(2));
			});
			return () => cancelAnimationFrame(r);
		}
		if (leave !== 2) return;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const t = setTimeout(
			() => {
				setLeave(3);
				dismissed();
			},
			reduce ? 0 : 280,
		);
		return () => clearTimeout(t);
	}, [leave]);
	if (variant === "outline")
		warnDeprecated('Banner variant="outline" is deprecated and renders as the default; remove it.');
	if (leave === 3) return null;
	const st = isStatus(status) ? status : "info";
	const cls = ["q-banner", `q-banner--${st}`, className].filter(Boolean).join(" ");
	const box = (
		<div
			{...rest}
			ref={ref}
			role={status === "error" ? "alert" : "region"}
			aria-labelledby={title ? id : rest["aria-labelledby"]}
			aria-label={rest["aria-label"] ?? (title ? undefined : label || "Notice")}
			className={cls}
			style={style}
		>
			<div className="q-banner__inner">
				<StatusIcon status={st} className="q-banner__icon" />
				<div className="q-banner__text">
					{title && (
						<strong id={id} className="q-banner__title">
							{title}
						</strong>
					)}
					{title && children ? " " : ""}
					{children && <span className="q-banner__body">{children}</span>}
				</div>
				{action}
				{dismissible && (
					<CloseButton
						label="Dismiss banner"
						onClick={() => setLeave((l) => l || 1)}
						className="q-banner__dismiss"
					/>
				)}
			</div>
		</div>
	);
	return leave ? (
		<div className="q-collapse" data-open={leave === 1 ? "true" : "false"}>
			<div
				className="q-collapse-inner q-banner__collapse"
				data-open={leave === 1 ? "true" : "false"}
				inert
			>
				{box}
			</div>
		</div>
	) : (
		box
	);
}
