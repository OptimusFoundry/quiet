import type React from "react";
import { useLinkElement } from "../../lib/link";
import { Icon } from "../core/Icon";
import "./EntityLink.scss";

export interface EntityLinkProps
	extends Omit<
		React.AnchorHTMLAttributes<HTMLAnchorElement>,
		"href" | "children" | "id" | "className" | "style"
	> {
	/** Where the record lives. In-app paths go through the router link. */
	href: string;
	/** The record's name. Optional when `id` names it. */
	children?: React.ReactNode;
	/** Short noun for the record ("Run", "Project"), shown before the name in the link colour (one link, one colour). With `icon`, the
	 * icon stands for it and the kind is read by screen readers only. */
	kind?: string;
	/** Leading glyph or Icon, in the link colour. Decorative. */
	icon?: React.ReactNode;
	/** The record's ID (e.g. `233f76c2`), shown after the name, or as the name when there are no
	 * children. Not the DOM id. */
	id?: string;
	/** Set the name and ID in the mono font, for short IDs (`233f76c2`, `B2`). */
	mono?: boolean;
	/** Opens in a new tab: trailing arrow-up-right icon, target/rel set, "(opens in new tab)" for screen readers. */
	external?: boolean;
	/** `done` strikes through in muted text; `blocked` shows a hollow status dot. Both are announced. */
	state?: "default" | "done" | "blocked";
	/** Text size. Default: inherits the surrounding text. */
	size?: "sm" | "md";
	className?: string;
	style?: React.CSSProperties;
}

const STATE_TEXT = { done: "done", blocked: "blocked" } as const;

/**
 * A reference to another record (a run, project, artifact, ticket) that unmistakably navigates:
 * accent text on a soft accent underline, an optional leading icon and muted kind ("Run"), and a
 * mono variant for short IDs. Inline, so it wraps in prose and table cells. Renders through the
 * configured router link (`QuietRoot linkComponent`) for in-app paths.
 * @startingPoint section="App" subtitle="Links to runs, projects, tickets" viewport="700x200"
 */
export function EntityLink({
	href,
	children,
	kind,
	icon,
	id,
	mono = false,
	external = false,
	state = "default",
	size,
	className,
	style,
	...rest
}: EntityLinkProps) {
	const A = useLinkElement(href, external);
	const st = state === "done" || state === "blocked" ? state : null;
	const hasName = children != null && children !== false && children !== "";
	const cls = [
		"q-entity-link",
		size === "sm" || size === "md" ? `q-entity-link--${size}` : null,
		mono && "q-entity-link--mono",
		st && `q-entity-link--${st}`,
		className,
	]
		.filter(Boolean)
		.join(" ");
	return (
		<A
			href={href}
			target={external ? "_blank" : undefined}
			rel={external ? "noopener noreferrer" : undefined}
			{...rest}
			className={cls}
			style={style}
		>
			{st === "blocked" && <span aria-hidden="true" className="q-entity-link__dot" />}
			{icon != null && (
				<span aria-hidden="true" className="q-entity-link__icon">
					{icon}
				</span>
			)}
			{kind && (
				<span className={icon != null ? "q-sr-only" : "q-entity-link__kind"}>
					{kind}
					{icon != null ? " " : null}
				</span>
			)}
			{kind && icon == null && " "}
			{hasName && <span className="q-entity-link__name">{children}</span>}
			{id && hasName && " "}
			{id && <span className={hasName ? "q-entity-link__id" : "q-entity-link__name"}>{id}</span>}
			{external && <Icon name="arrow-up-right" size="sm" className="q-entity-link__external" />}
			{external && <span className="q-sr-only"> (opens in new tab)</span>}
			{st && <span className="q-sr-only">{` (${STATE_TEXT[st]})`}</span>}
		</A>
	);
}
