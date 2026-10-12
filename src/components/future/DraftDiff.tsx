import React from "react";
import { Button } from "../core/Button";
import { Icon } from "../core/Icon";
import "./DraftDiff.scss";

export interface DraftDiffHunk {
	id?: string | number;
	/** Unchanged text before the hunk */
	keep?: React.ReactNode;
	/** Original words */
	before: React.ReactNode;
	/** Suggested words */
	after: React.ReactNode;
	/** Unchanged text after the hunk */
	tail?: React.ReactNode;
}
export type DraftDiffState = "pending" | "accepted" | "rejected";
export interface DraftDiffProps {
	hunks: DraftDiffHunk[];
	/** Controlled state per hunk */
	value?: DraftDiffState[];
	/** Initial state per hunk; all pending by default */
	defaultValue?: DraftDiffState[];
	onChange?: (value: DraftDiffState[]) => void;
	/** Who suggests what, e.g. "Meerkat suggests 3 edits" (also the section's accessible name) */
	label?: React.ReactNode;
	/** The suggestion's intent, e.g. "shorter, one claim per sentence" */
	note?: React.ReactNode;
	shipLabel?: React.ReactNode;
	onShip?: () => void;
	className?: string;
	style?: React.CSSProperties;
}

const quote = (v: React.ReactNode) => (typeof v === "string" ? `“${v}”` : "suggestion");

/**
 * Inline, word-level suggestions instead of "regenerate", which throws away what was right. Each
 * hunk shows the struck original and the proposed words with accept (check) and keep (close) keys;
 * a resolved hunk can be reopened. The ship button stays disabled while any hunk is pending.
 * Evolved from a textarea + regenerate.
 * @startingPoint section="Future" subtitle="Accept suggestions hunk by hunk" viewport="760x300"
 */
export function DraftDiff({
	hunks = [],
	value,
	defaultValue,
	onChange,
	label,
	note,
	shipLabel = "Ship",
	onShip,
	className,
	style,
}: DraftDiffProps) {
	const [inner, setInner] = React.useState<DraftDiffState[]>(
		() => defaultValue ?? hunks.map(() => "pending"),
	);
	const states = value ?? inner;
	const set = (next: DraftDiffState[]) => {
		setInner(next);
		onChange?.(next);
	};
	const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
	const focusNext = React.useRef<number | null>(null);
	React.useEffect(() => {
		if (focusNext.current == null) return;
		refs.current[focusNext.current]?.focus();
		focusNext.current = null;
	});
	const resolve = (i: number, v: DraftDiffState) => {
		focusNext.current = i;
		set(states.map((x, j) => (j === i ? v : x)));
	};
	const accepted = states.filter((s) => s === "accepted").length;
	const pending = states.filter((s) => s === "pending").length;
	const kept = states.length - accepted - pending;
	const uid = React.useId();
	return (
		<section
			aria-label={typeof label === "string" ? label : "Suggested edits"}
			className={["q-draft-diff", className].filter(Boolean).join(" ")}
			style={style}
		>
			<header className="q-draft-diff__header">
				<div className="q-draft-diff__heading">
					{label && <span className="q-draft-diff__label">{label}</span>}
					{note && <span className="q-draft-diff__note">{note}</span>}
				</div>
				<div className="q-draft-diff__bulk">
					<Button
						variant="ghost"
						size="sm"
						disabled={pending === 0}
						onClick={() => set(states.map((s) => (s === "pending" ? "accepted" : s)))}
					>
						Accept all
					</Button>
					<Button
						variant="ghost"
						size="sm"
						disabled={pending === states.length}
						onClick={() => set(hunks.map(() => "pending"))}
					>
						Reset
					</Button>
				</div>
			</header>
			<p className="q-draft-diff__text">
				{hunks.map((h, i) => {
					const st = states[i] ?? "pending";
					return (
						<React.Fragment key={h.id ?? i}>
							{h.keep}
							{st === "pending" ? (
								<span className="q-draft-diff__hunk">
									<del className="q-draft-diff__before">{h.before}</del>{" "}
									<ins className="q-draft-diff__after">{h.after}</ins>
									<span className="q-draft-diff__choices">
										<button
											type="button"
											ref={(el) => {
												refs.current[i] = el;
											}}
											className="q-draft-diff__choice q-draft-diff__choice--accept"
											aria-label={`Accept ${quote(h.after)}`}
											onClick={() => resolve(i, "accepted")}
										>
											<Icon name="check" size="sm" />
										</button>
										<button
											type="button"
											className="q-draft-diff__choice"
											aria-label={`Keep ${quote(h.before)}`}
											onClick={() => resolve(i, "rejected")}
										>
											<Icon name="close" size="sm" />
										</button>
									</span>
								</span>
							) : (
								<button
									type="button"
									ref={(el) => {
										refs.current[i] = el;
									}}
									className={`q-draft-diff__resolved q-draft-diff__resolved--${st}`}
									aria-label={
										(st === "accepted" ? `Accepted ${quote(h.after)}` : `Kept ${quote(h.before)}`) +
										". Reconsider"
									}
									onClick={() => resolve(i, "pending")}
								>
									{st === "accepted" ? h.after : h.before}
								</button>
							)}
							{h.tail}
						</React.Fragment>
					);
				})}
			</p>
			<footer className="q-draft-diff__footer">
				<span id={`${uid}s`} role="status" className="q-draft-diff__summary">
					{accepted} accepted · {pending} pending · {kept} kept
				</span>
				<Button size="sm" disabled={pending > 0} aria-describedby={`${uid}s`} onClick={onShip}>
					{shipLabel}
				</Button>
			</footer>
		</section>
	);
}
