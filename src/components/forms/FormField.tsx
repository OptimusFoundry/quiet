import React from "react";
import { FormHint } from "./FormHint";
import { Label } from "./Label";
import "./FormField.scss";

export interface FormFieldProps {
	label?: React.ReactNode;
	id?: string;
	required?: boolean;
	subText?: React.ReactNode;
	helperText?: React.ReactNode;
	/** Replaces helperText, in the error colour */
	error?: React.ReactNode;
	size?: "sm" | "md" | "lg";
	/** The control */
	children: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

/**
 * What FormField clones into its child. It does so only for a native element (`<input>`,
 * `<select>` …) or a component that sets the static `fieldControl` (`true` or `"native"`) — a promise that it puts
 * `id` and these aria-* on its native control and merges (not replaces) `aria-describedby` with
 * its own hint. `true` also gets `aria-labelledby` pointing at FormField's label, since a
 * `<label htmlFor>` can't name a span/div/button widget. `"native"` means the control is a
 * native labelable element (TextField, TextArea, Select), so `htmlFor` alone names it.
 */
export type FieldControl = true | "native";

type FieldControlProps = {
	"aria-labelledby"?: string;
	id?: string;
	"aria-invalid"?: boolean;
	"aria-describedby"?: string;
	"aria-required"?: boolean;
	required?: boolean;
};

// Native elements that take `required` (and so block a native form's submit).
const REQUIRABLE = new Set(["input", "select", "textarea"]);

let ofFieldId = 0;

/**
 * Label + any control + hint/error. Wires native controls and fieldControl components (TextField, TextArea, Select and the ARIA widgets) automatically (id, aria-invalid, aria-describedby, aria-required and native `required`, and aria-labelledby for widgets).
 * @startingPoint section="Forms" subtitle="Label · control · hint" viewport="600x240"
 */
export function FormField({
	label,
	id,
	required,
	subText,
	helperText,
	error,
	size = "md",
	children,
	className,
	style,
}: FormFieldProps) {
	const [auto] = React.useState(() => `of-field-${++ofFieldId}`);
	const fid = id || auto;
	const hintId = `${fid}-hint`;
	const labelId = `${fid}-label`;
	const described =
		[
			children && (children as React.ReactElement<FieldControlProps>).props?.["aria-describedby"],
			error || helperText ? hintId : null,
		]
			.filter(Boolean)
			.join(" ") || undefined;
	const kind: FieldControl | "element" | undefined = React.isValidElement<FieldControlProps>(
		children,
	)
		? typeof children.type === "string"
			? "element"
			: (children.type as { fieldControl?: FieldControl }).fieldControl
		: undefined;
	const child = kind
		? React.cloneElement(children as React.ReactElement<FieldControlProps>, {
				id: fid,
				"aria-invalid": !!error || undefined,
				"aria-describedby": described,
				"aria-required": required || undefined,
				// Native `required` too, so a native form won't submit it empty; the control's own wins.
				...(required &&
					(kind !== "element" ||
						REQUIRABLE.has((children as React.ReactElement).type as string)) && {
						required: (children as React.ReactElement<FieldControlProps>).props.required ?? true,
					}),
				// A widget that isn't a native labelable element is named through aria-labelledby.
				...(kind === true &&
					label && {
						"aria-labelledby": [
							(children as React.ReactElement<FieldControlProps>).props["aria-labelledby"],
							labelId,
						]
							.filter(Boolean)
							.join(" "),
					}),
			})
		: children;
	return (
		<div className={["q-form-field", className].filter(Boolean).join(" ")} style={style}>
			{label && (
				<Label id={labelId} htmlFor={fid} required={required} subText={subText} size={size}>
					{label}
				</Label>
			)}
			{child}
			<FormHint id={hintId} variant={error ? "error" : "default"}>
				{error || helperText}
			</FormHint>
		</div>
	);
}
