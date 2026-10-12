import { type ReactNode, type SubmitEvent, useState } from "react";
import { Button } from "../../../components/core/Button";
import "./FormDemo.scss";

// A native <form> for the Forms stories: submit it and the FormData it sent prints below.
// Shows that a field joins a plain form through `name`, and that `required` blocks submission.

/** Every entry FormData holds, one `name=value` per line (files print their name and size). */
function describe(form: HTMLFormElement): string {
	const lines = [...new FormData(form).entries()].map(
		([k, v]) =>
			`${k}=${v instanceof File ? (v.name ? `${v.name} (${v.size} B)` : "(no file)") : v}`,
	);
	return lines.join("\n") || "Nothing submitted (no named field had a value).";
}

export function FormDemo({
	children,
	label,
	submit = "Submit",
	multipart,
}: {
	children: ReactNode;
	/** The form's accessible name */
	label: string;
	submit?: string;
	/** Sets encType="multipart/form-data", as a form with files needs */
	multipart?: boolean;
}) {
	const [sent, setSent] = useState<string | null>(null);
	const onSubmit = (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSent(describe(e.currentTarget));
	};
	return (
		<form
			aria-label={label}
			encType={multipart ? "multipart/form-data" : undefined}
			onSubmit={onSubmit}
			className="q-sb-form-demo"
		>
			{children}
			<div className="q-sb-form-demo__actions">
				<Button type="submit">{submit}</Button>
			</div>
			<output aria-label="Submitted data" className="q-sb-form-demo__output">
				{sent ?? "Submit to see what the form sends."}
			</output>
		</form>
	);
}
