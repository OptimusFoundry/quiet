import React from "react";
import { useCopy } from "../chat/chat-utils";
import { Button } from "../core/Button";
import { Icon } from "../core/Icon";
import "./DescriptionList.scss";

/** One property: its label, value and the optional extras. */
export interface DescriptionListItem {
	/** What the property is ("Project", "Created") */
	label: React.ReactNode;
	/** The value; empty or undefined renders a muted "—" read as "Not set" */
	value?: React.ReactNode;
	/** A muted note under the value */
	hint?: React.ReactNode;
	/** Sets the value in the mono font (IDs, hashes, MIME types) */
	mono?: boolean;
	/** Adds a copy button after the value that puts this text on the clipboard */
	copy?: string;
}

/**
 * An entity's properties as label/value pairs, each value right next to its label. Semantic
 * `<dl>`; values can be links, mono IDs and copyable. Inline (label column + value) or stacked.
 * @startingPoint section="App" subtitle="Label/value pairs for detail pages" viewport="700x260"
 */
export interface DescriptionListProps
	extends Omit<React.HTMLAttributes<HTMLDListElement>, "children" | "className" | "style"> {
	/** The pairs, in order */
	items: DescriptionListItem[];
	/** inline: label column + value beside it (default). stacked: label above value, for narrow panels */
	layout?: "inline" | "stacked";
	/** On the outer wrapper (the size container); other attributes go on the `<dl>` */
	className?: string;
	style?: React.CSSProperties;
	/** Pairs per row on wide screens; collapses to 1 when the list is under 720px wide */
	columns?: 1 | 2 | 3;
	size?: "sm" | "md";
}

const isEmpty = (v: React.ReactNode) =>
	v === undefined || v === null || v === false || (typeof v === "string" && v.trim() === "");

function CopyButton({ text, labelId }: { text: string; labelId: string }) {
	const [state, copy] = useCopy();
	const wordId = React.useId();
	return (
		<>
			<span id={wordId} hidden>
				Copy
			</span>
			<Button
				variant="ghost"
				size="sm"
				className="q-description-list__copy"
				aria-labelledby={`${wordId} ${labelId}`}
				data-state={state}
				onClick={() => copy(text)}
				icon={<Icon glyph={state === "copied" ? "✓" : "⧉"} size="md" />}
			/>
			<span role="status" className="q-sr-only">
				{state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : ""}
			</span>
		</>
	);
}

export function DescriptionList({
	items,
	layout = "inline",
	columns = 1,
	size = "md",
	className,
	style,
	...rest
}: DescriptionListProps) {
	const base = React.useId();
	const cls = [
		"q-description-list",
		`q-description-list--${layout === "stacked" ? "stacked" : "inline"}`,
		`q-description-list--${size === "sm" ? "sm" : "md"}`,
		`q-description-list--cols-${[1, 2, 3].includes(columns) ? columns : 1}`,
		className,
	]
		.filter(Boolean)
		.join(" ");
	return (
		// The outer div is the size container the column count answers to (a dl may only hold pairs).
		<div className={cls} style={style}>
			<dl className="q-description-list__list" {...rest}>
				{items.map((item, i) => {
					const labelId = `${base}-${i}`;
					const empty = isEmpty(item.value);
					return (
						<div key={i} className="q-description-list__pair">
							<dt id={labelId} className="q-description-list__label">
								{item.label}
							</dt>
							<dd className="q-description-list__detail">
								<span className="q-description-list__line">
									{empty ? (
										<span className="q-description-list__value q-description-list__value--empty">
											<span aria-hidden="true">—</span>
											<span className="q-sr-only">Not set</span>
										</span>
									) : (
										<span
											className={[
												"q-description-list__value",
												item.mono && "q-description-list__value--mono",
											]
												.filter(Boolean)
												.join(" ")}
										>
											{item.value}
										</span>
									)}
									{item.copy != null && item.copy !== "" && (
										<CopyButton text={item.copy} labelId={labelId} />
									)}
								</span>
								{item.hint != null && <span className="q-description-list__hint">{item.hint}</span>}
							</dd>
						</div>
					);
				})}
			</dl>
		</div>
	);
}
