import React from "react";
import "./Panel.scss";

/**
 * Titled section container for app screens. Groups with a surface (subtle ground, large radius)
 * instead of a rule on top; an empty panel collapses to its header plus one muted line.
 * @startingPoint section="App" subtitle="Titled surface section" viewport="700x240"
 */
export interface PanelProps
	extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "children" | "className" | "style"> {
	/** Section heading; when given the panel is a `<section>` named by it */
	title?: React.ReactNode;
	/** Heading level for the title; default "h2" */
	as?: "h2" | "h3";
	/** Muted count after the title, e.g. 3 */
	count?: React.ReactNode;
	/** One line under the title */
	description?: React.ReactNode;
	/** Top-right actions, e.g. a ghost Button or a "View all" Link */
	actions?: React.ReactNode;
	/** surface (default): subtle ground; outlined: hairline on the page ground; plain: no ground */
	variant?: "surface" | "outlined" | "plain";
	/** Inner padding; "none" lets a table or list sit edge to edge (the header keeps its inset). Default "md" */
	padding?: "none" | "sm" | "md";
	/** Shown as one muted line, in place of the body, when children are empty */
	empty?: React.ReactNode;
	/** Row under the body, e.g. a "Show all" link or a muted note */
	footer?: React.ReactNode;
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

const VARIANTS: string[] = ["surface", "outlined", "plain"];
const PADDINGS: string[] = ["none", "sm", "md"];

const isEmptyChildren = (children: React.ReactNode) =>
	React.Children.toArray(children).filter((c) => c !== "").length === 0;

export function Panel({
	title,
	as: Heading = "h2",
	count,
	description,
	actions,
	variant = "surface",
	padding = "md",
	empty,
	footer,
	children,
	className,
	style,
	...rest
}: PanelProps) {
	const titleId = `${React.useId()}-title`;
	const titled = title != null && title !== false && title !== "";
	const showEmpty = empty != null && empty !== false && isEmptyChildren(children);
	const hasBody = !showEmpty && !isEmptyChildren(children);
	const hasHeader = titled || description || actions;
	const cls = [
		"q-panel",
		`q-panel--${VARIANTS.includes(variant) ? variant : "surface"}`,
		`q-panel--pad-${PADDINGS.includes(padding) ? padding : "md"}`,
		className,
	]
		.filter(Boolean)
		.join(" ");
	const El = titled ? "section" : "div";
	return (
		<El
			{...rest}
			className={cls}
			style={style}
			aria-labelledby={titled ? (rest["aria-labelledby"] ?? titleId) : rest["aria-labelledby"]}
			data-empty={showEmpty || undefined}
		>
			{hasHeader && (
				<div className="q-panel__header">
					<div className="q-panel__heading">
						{titled && (
							<Heading className="q-panel__title">
								<span id={titleId}>{title}</span>
								{count != null && count !== false && count !== "" && (
									<span className="q-panel__count">{count}</span>
								)}
							</Heading>
						)}
						{description && <p className="q-panel__description">{description}</p>}
					</div>
					{actions && <div className="q-panel__actions">{actions}</div>}
				</div>
			)}
			{showEmpty && <p className="q-panel__empty">{empty}</p>}
			{hasBody && <div className="q-panel__body">{children}</div>}
			{footer && !showEmpty && <div className="q-panel__footer">{footer}</div>}
		</El>
	);
}
