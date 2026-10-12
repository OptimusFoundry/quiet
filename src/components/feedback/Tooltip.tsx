import React from "react";
import { useEscape } from "../../a11y/hooks";
import "./Tooltip.scss";

export interface TooltipProps
	extends Omit<React.HTMLAttributes<HTMLSpanElement>, "content" | "children"> {
	/** The wrapper <span> around the trigger and bubble; the trigger itself is `children`. */
	ref?: React.Ref<HTMLSpanElement>;
	content: React.ReactNode;
	children: React.ReactNode;
	placement?: "top" | "bottom" | "left" | "right";
	/** ms before showing */
	delay?: number;
}

const INTERACTIVE: string[] = ["a", "button", "input", "select", "textarea"];

/**
 * Ink tooltip in sans sentence case, soft corners (--q-radius-sm). Four placements, optional delay.
 * @startingPoint section="Feedback" subtitle="Ink tooltips, 4 placements" viewport="600x200"
 */
export function Tooltip({
	content,
	children,
	placement = "top",
	delay = 0,
	className,
	ref,
	...rest
}: TooltipProps) {
	const [open, setOpen] = React.useState(false);
	const t = React.useRef<ReturnType<typeof setTimeout>>(undefined);
	const id = React.useId();
	const show = () => {
		clearTimeout(t.current);
		t.current = setTimeout(() => setOpen(true), delay);
	};
	const hide = () => {
		clearTimeout(t.current);
		setOpen(false);
	};
	// quiet: a short grace period lets the pointer cross onto the tooltip without it vanishing (WCAG 1.4.13).
	const leave = () => {
		clearTimeout(t.current);
		t.current = setTimeout(() => setOpen(false), 120);
	};
	React.useEffect(() => () => clearTimeout(t.current), []);
	useEscape(open, hide);
	// quiet: the trigger is described by the tooltip and reachable by keyboard even when it is plain text.
	const el = React.isValidElement<React.HTMLAttributes<HTMLElement>>(children) ? children : null;
	const plain =
		el &&
		typeof el.type === "string" &&
		!INTERACTIVE.includes(el.type) &&
		el.props.tabIndex == null;
	const trigger = el
		? React.cloneElement(el, { "aria-describedby": id, ...(plain ? { tabIndex: 0 } : null) })
		: children;
	return (
		<span
			{...rest}
			ref={ref}
			onMouseEnter={(e) => {
				show();
				rest.onMouseEnter?.(e);
			}}
			onMouseLeave={(e) => {
				leave();
				rest.onMouseLeave?.(e);
			}}
			onFocus={(e) => {
				show();
				rest.onFocus?.(e);
			}}
			onBlur={(e) => {
				hide();
				rest.onBlur?.(e);
			}}
			aria-describedby={el ? rest["aria-describedby"] : id}
			tabIndex={el ? rest.tabIndex : 0}
			className={["q-tooltip", className].filter(Boolean).join(" ")}
		>
			{trigger}
			<span
				role="tooltip"
				id={id}
				className="q-tooltip__bubble"
				data-placement={placement}
				data-state={open ? "open" : "closed"}
			>
				{content}
			</span>
		</span>
	);
}
