import React from "react";
import { focusNeighbour } from "../../a11y/hooks";
import "./Alert.scss";
import { CloseButton, StatusIcon } from "./parts";

/**
 * Inline, in-flow message box on its status ground (--q-radius-md); status reads through the icon.
 * @startingPoint section="Feedback" subtitle="Info · success · warning · error" viewport="700x420"
 */
export interface AlertProps {
	variant?: "info" | "success" | "warning" | "error";
	title?: React.ReactNode;
	children?: React.ReactNode;
	/** false hides it; node replaces it */
	icon?: false | React.ReactNode;
	/** e.g. an ArrowLink or small Button */
	action?: React.ReactNode;
	/** Shows the close button */
	onDismiss?: () => void;
	className?: string;
	style?: React.CSSProperties;
}

const VARIANTS: string[] = ["info", "success", "warning", "error"];

export function Alert({
	variant = "info",
	title,
	children,
	icon,
	action,
	onDismiss,
	className,
	style,
}: AlertProps) {
	// quiet: dismiss collapses the alert's height (0 rest · 1 wrapped · 2 collapsing · 3 gone), then calls onDismiss.
	const [leave, setLeave] = React.useState(0);
	const boxRef = React.useRef<HTMLDivElement>(null);
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
	if (leave === 3) return null;
	const v = (VARIANTS.includes(variant) ? variant : "info") as NonNullable<AlertProps["variant"]>;
	const glyph = icon === false ? null : icon || <StatusIcon status={v} />;
	const box = (
		<div
			ref={boxRef}
			role={variant === "error" ? "alert" : "status"}
			className={["q-alert", `q-alert--${v}`, className].filter(Boolean).join(" ")}
			style={style}
		>
			{glyph && (
				<span aria-hidden="true" className="q-alert__icon">
					{glyph}
				</span>
			)}
			<div className="q-alert__content">
				{title && <div className="q-alert__title">{title}</div>}
				{children && <div className="q-alert__body">{children}</div>}
				{action && <div className="q-alert__actions">{action}</div>}
			</div>
			{onDismiss && (
				<CloseButton
					label="Dismiss alert"
					onClick={() => {
						// The alert goes inert as it collapses: hand focus on before it does.
						focusNeighbour(boxRef.current);
						setLeave((l) => l || 1);
					}}
					className="q-alert__dismiss"
				/>
			)}
		</div>
	);
	return leave ? (
		<div className="q-collapse" data-open={leave === 1 ? "true" : "false"}>
			<div
				className="q-collapse-inner q-alert__collapse"
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
