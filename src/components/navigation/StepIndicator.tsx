import type React from "react";
import { Icon } from "../core/Icon";
import "./StepIndicator.scss";

export interface StepIndicatorProps {
	steps: Array<{
		label: React.ReactNode;
		description?: React.ReactNode;
		status?: "complete" | "current" | "upcoming" | "error";
	}>;
	/** 0-based */
	current?: number;
	orientation?: "horizontal" | "vertical";
	size?: "sm" | "md" | "lg";
	/** Marker numbers (default "arabic") */
	numerals?: "roman" | "arabic";
	/** Makes completed steps clickable */
	onStepClick?: (index: number) => void;
	/** Accessible name for the step list, e.g. "Checkout progress" */
	label?: string;
	className?: string;
	style?: React.CSSProperties;
}

const ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];

/**
 * Numbered steps with hairline connectors. Arabic numerals by default; a check marks a complete step,
 * the accent ring the current one, a warning icon an error.
 * @startingPoint section="Navigation" subtitle="Multi-step progress" viewport="800x260"
 */
export function StepIndicator({
	steps = [],
	current = 0,
	orientation = "horizontal",
	size = "md",
	numerals = "arabic",
	onStepClick,
	label,
	className,
	style,
}: StepIndicatorProps) {
	const vert = orientation === "vertical";
	return (
		<ol
			aria-label={label}
			className={[
				"q-step-indicator",
				vert && "q-step-indicator--vertical",
				(size === "sm" || size === "lg") && `q-step-indicator--${size}`,
				className,
			]
				.filter(Boolean)
				.join(" ")}
			style={style}
		>
			{steps.map((s, i) => {
				const st = s.status || (i < current ? "complete" : i === current ? "current" : "upcoming");
				const click = onStepClick && st === "complete";
				const glyph =
					st === "complete" ? (
						<Icon name="check" size="sm" />
					) : st === "error" ? (
						<Icon name="warning" size="sm" />
					) : numerals === "roman" ? (
						ROMAN[i]
					) : (
						String(i + 1)
					);
				const last = i === steps.length - 1;
				const name = typeof s.label === "string" ? s.label : `step ${i + 1}`;
				return (
					<li
						key={i}
						aria-current={st === "current" ? "step" : undefined}
						className={`q-step-indicator__step q-step-indicator__step--${st}`}
					>
						<div className="q-step-indicator__track">
							<button
								type="button"
								disabled={!click}
								onClick={() => click && onStepClick!(i)}
								aria-label={click ? `Go back to ${name}` : undefined}
								aria-hidden={click ? undefined : "true"}
								className="q-step-indicator__marker"
							>
								{glyph}
							</button>
							{!last && (
								<span
									aria-hidden="true"
									className={
										i < current
											? "q-step-indicator__line q-step-indicator__line--done"
											: "q-step-indicator__line"
									}
								/>
							)}
						</div>
						<div className="q-step-indicator__text">
							<span className="q-step-indicator__label">
								{s.label}
								{st !== "current" && (
									<span className="q-sr-only">
										{", " +
											{ complete: "completed", upcoming: "not started", error: "has an error" }[st]}
									</span>
								)}
							</span>
							{s.description && (
								<span className="q-step-indicator__description">{s.description}</span>
							)}
						</div>
					</li>
				);
			})}
		</ol>
	);
}
