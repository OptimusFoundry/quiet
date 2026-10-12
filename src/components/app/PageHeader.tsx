import type React from "react";
import { Link } from "../core/Link";
import "./PageHeader.scss";

/**
 * The top of an app screen (list, detail, settings): an optional back link and eyebrow, the page
 * title with inline status, a description, key facts, actions on the right and a tabs slot below.
 * No rule underneath; the space below it groups the page.
 * @startingPoint section="App" subtitle="Title, status, meta and actions for a screen" viewport="900x220"
 */
export interface PageHeaderProps
	extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "className" | "style"> {
	/** The page title. Rendered as the screen's heading. */
	title: React.ReactNode;
	/** Heading level of the title. `h1` for a screen, `h2` when the header sits inside one. */
	as?: "h1" | "h2";
	/** A muted line under the title (kept to a readable measure, about 640px). */
	description?: React.ReactNode;
	/** A small muted line above the title: a kind ("Artifact · spreadsheet") or a breadcrumb. */
	eyebrow?: React.ReactNode;
	/** A link back to the parent screen, shown as "← label" above the title. Routed via `QuietRoot linkComponent`. */
	back?: { label: string; href: string };
	/** Badges shown inline after the title, baseline-aligned. */
	status?: React.ReactNode;
	/** Key facts under the title, spaced apart (no separator marks); wraps on narrow screens. Items may hold links. */
	meta?: React.ReactNode[];
	/** Buttons for the page, right-aligned; wraps below the title on narrow screens. Put the primary last. */
	actions?: React.ReactNode;
	/** Full-width slot under the header, e.g. a `Tabs`. */
	tabs?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

export function PageHeader({
	title,
	as: Heading = "h1",
	description,
	eyebrow,
	back,
	status,
	meta,
	actions,
	tabs,
	className,
	style,
	...rest
}: PageHeaderProps) {
	const facts = meta?.filter((m) => m != null && m !== false && m !== "") ?? [];
	return (
		<header
			{...rest}
			className={["q-page-header", className].filter(Boolean).join(" ")}
			style={style}
		>
			{(back || eyebrow) && (
				<div className="q-page-header__above">
					{back && (
						<Link href={back.href} size="sm" className="q-page-header__back">
							<span aria-hidden="true">← </span>
							{back.label}
						</Link>
					)}
					{eyebrow && <div className="q-page-header__eyebrow">{eyebrow}</div>}
				</div>
			)}
			<div className="q-page-header__main">
				<div className="q-page-header__heading">
					<div className="q-page-header__title-row">
						<Heading className="q-page-header__title">{title}</Heading>
						{status && <span className="q-page-header__status">{status}</span>}
					</div>
					{description && <p className="q-page-header__description">{description}</p>}
					{facts.length > 0 && (
						<ul className="q-page-header__meta">
							{facts.map((m, i) => (
								<li key={i} className="q-page-header__meta-item">
									{m}
								</li>
							))}
						</ul>
					)}
				</div>
				{actions && <div className="q-page-header__actions">{actions}</div>}
			</div>
			{tabs && <div className="q-page-header__tabs">{tabs}</div>}
		</header>
	);
}
