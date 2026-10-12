import React from "react";
import { FormValue } from "../../a11y/form";
import { useMergedRef } from "../../a11y/hooks";
import "./FileUpload.scss";

/** One row of the file list. The app may own these (controlled `files`) and update `progress`/`error` over time. */
export interface FileUploadItem {
	/** Stable identity: rows are keyed by it, so keep it across updates */
	id: string | number;
	name: string;
	/** Bytes */
	size?: number;
	/** The picked File; set on rows added through the picker or drop */
	file?: File;
	/** 0–100; a bar shows while below 100 and there is no error */
	progress?: number;
	/** Shown in place of the status; the row reads as failed */
	error?: string | null;
}

/**
 * Dashed drop zone or button with a hairline file list. Type, size and count validation; optional simulated progress.
 *
 * Controlled: pass `files` and update it from `onChange` (and from your uploader: `progress`,
 * `error`). Rows the picker adds arrive in `onChange` with a generated string `id` and their `file`.
 *
 * Native forms: with `name`, the `file` of every row that has one and no `error` is submitted
 * as that field (the form needs `encType="multipart/form-data"` to send the bytes). Rows without
 * a `file` (preloaded, or already on your server) are not submitted; send their ids yourself.
 * `required` blocks submit while no row is free of errors, and focuses the picker.
 * @startingPoint section="Forms" subtitle="Drop zone + file list" viewport="700x440"
 */
export interface FileUploadProps
	extends Omit<
		React.HTMLAttributes<HTMLElement>,
		"onChange" | "defaultValue" | "className" | "style" | "children" | "role" | "tabIndex"
	> {
	label?: React.ReactNode;
	/** Mono hint; auto-generated from accept/maxSize/maxFiles when omitted */
	hint?: React.ReactNode;
	/** e.g. "image/*" or ".pdf,.docx" */
	accept?: string;
	multiple?: boolean;
	/** Bytes */
	maxSize?: number;
	maxFiles?: number;
	disabled?: boolean;
	variant?: "dropzone" | "button";
	/** Controlled rows. The component renders these and only reports changes through onChange. */
	files?: FileUploadItem[];
	/** Uncontrolled initial rows: { id?, name, size?, progress?, error? } */
	defaultFiles?: Array<Omit<FileUploadItem, "id"> & { id?: string | number }>;
	/** The whole next list, after an add or a remove (and each simulated progress step) */
	onChange?: (files: FileUploadItem[]) => void;
	/** Demo only — animates progress for new files. Ignored when `files` is controlled. */
	simulateUpload?: boolean;
	buttonLabel?: string;
	/** Form field name; see "Native forms" above for what is submitted */
	name?: string;
	/** Id of the <form> to join when the component sits outside it */
	form?: string;
	required?: boolean;
	className?: string;
	style?: React.CSSProperties;
	/** Reaches the focusable control: the drop zone, or the button in the button variant */
	ref?: React.Ref<HTMLElement>;
}

const fmtSize = (b: number) =>
	b < 1024
		? `${b} B`
		: b < 1048576
			? `${(b / 1024).toFixed(0)} KB`
			: `${(b / 1048576).toFixed(1)} MB`;
const matches = (f: File, accept: string | undefined) =>
	!accept ||
	accept
		.split(",")
		.map((s) => s.trim())
		.some((a) =>
			a.startsWith(".")
				? f.name.toLowerCase().endsWith(a.toLowerCase())
				: a.endsWith("/*")
					? (f.type || "").startsWith(a.slice(0, -1))
					: f.type === a,
		);
let ofFileId = 0;
// Ids for rows the component creates; strings, so they never collide with an app's numeric ids.
const nextFileId = () => `q-file-${++ofFileId}`;

type FileItem = FileUploadItem;

function FileRow({
	f,
	onRemove,
	disabled,
	fresh,
}: {
	f: FileItem;
	onRemove: () => void;
	disabled: boolean;
	fresh: boolean;
}) {
	const pct = f.progress;
	const busy = pct != null && pct < 100 && !f.error;
	return (
		<div
			role="listitem"
			className={`q-file-upload__row${fresh ? " q-anim-rise" : ""}`}
			data-state={fresh ? "open" : undefined}
		>
			<div className="q-file-upload__row-main">
				<span className="q-file-upload__file">
					<span className="q-file-upload__name">{f.name}</span>
					<span className={`q-file-upload__meta${f.error ? " q-file-upload__meta--error" : ""}`}>
						{f.size != null ? fmtSize(f.size) : ""}
						{" \u00b7 "}
						{f.error || (busy ? `Uploading ${Math.round(pct)}%` : "Ready")}
					</span>
				</span>
				{!busy && !f.error && (
					<span aria-hidden="true" className="q-file-upload__done">
						{"\u2713"}
					</span>
				)}
				<button
					type="button"
					aria-label={`Remove ${f.name}`}
					disabled={disabled}
					onClick={onRemove}
					className="q-file-upload__remove"
				>
					{"\u00d7"}
				</button>
			</div>
			{busy && (
				<span
					role="progressbar"
					aria-label={`Uploading ${f.name}`}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-valuenow={Math.round(pct)}
					className="q-file-upload__progress"
					style={{ "--_progress": `${pct}%` } as React.CSSProperties}
				>
					<span className="q-file-upload__progress-fill" />
				</span>
			)}
		</div>
	);
}

export function FileUpload({
	label,
	hint,
	accept,
	multiple = true,
	maxSize,
	maxFiles,
	disabled = false,
	variant = "dropzone",
	files: controlled,
	defaultFiles = [],
	onChange,
	simulateUpload = false,
	buttonLabel = "Choose files",
	name,
	form,
	required,
	className,
	style,
	ref,
	...rest
}: FileUploadProps) {
	const [inner, setInner] = React.useState<FileItem[]>(() =>
		defaultFiles.map((f) => ({ ...f, id: f.id ?? nextFileId() })),
	);
	const isControlled = controlled !== undefined;
	const files = controlled ?? inner;
	// Latest list, so updates in the same tick (and simulated progress timers) compose.
	const latest = React.useRef(files);
	latest.current = files;
	// Rows present at mount stay still; rows that arrive later (picked, or added by the app) rise in.
	const [initial] = React.useState(() => new Set(files.map((f) => f.id)));
	const [drag, setDrag] = React.useState(false);
	const [note, setNote] = React.useState<string | null>(null);
	const [said, setSaid] = React.useState(""); // polite announcement of adds, removals and errors
	const input = React.useRef<HTMLInputElement>(null);
	const submit = React.useRef<HTMLInputElement>(null);
	const zone = React.useRef<HTMLElement>(null);
	const zoneRef = useMergedRef(zone, ref);
	const list = React.useRef<HTMLDivElement>(null);
	const timers = React.useRef<ReturnType<typeof setInterval>[]>([]);
	const uid = React.useId();
	const labelId = `${uid}label`,
		hintId = `${uid}hint`;
	React.useEffect(() => () => timers.current.forEach(clearInterval), []);
	const update = (fn: (prev: FileItem[]) => FileItem[]) => {
		const next = fn(latest.current);
		latest.current = next;
		if (!isControlled) setInner(next);
		onChange?.(next);
	};
	const simulate = simulateUpload && !isControlled;
	// Mirror the submittable Files onto the named file input, so a native <form> sends them.
	const sendable = files.filter((f) => f.file && !f.error);
	const sendKey = sendable.map((f) => f.id).join("\u0000");
	// biome-ignore lint/correctness/useExhaustiveDependencies: sendKey is the list of rows to send; re-sync when it changes
	React.useEffect(() => {
		const el = submit.current;
		if (!el || typeof DataTransfer === "undefined") return;
		try {
			const dt = new DataTransfer();
			for (const f of latest.current) if (f.file && !f.error) dt.items.add(f.file);
			el.files = dt.files;
		} catch {
			// Older engines can't build a FileList; the app reads files from onChange instead.
		}
	}, [sendKey, name]);
	const add = (picked: FileList | null) => {
		if (disabled || !picked) return;
		let incoming = Array.from(picked);
		if (!multiple) incoming = incoming.slice(0, 1);
		const room = maxFiles
			? Math.max(0, maxFiles - (multiple ? latest.current.length : 0))
			: Infinity;
		const limit =
			incoming.length > room
				? `Limit is ${maxFiles}${maxFiles === 1 ? " file." : " files."}`
				: null;
		setNote(limit);
		const items: FileItem[] = incoming.slice(0, room).map((f) => ({
			id: nextFileId(),
			name: f.name,
			size: f.size,
			file: f,
			error: !matches(f, accept)
				? "Type not accepted"
				: maxSize && f.size > maxSize
					? `Over ${fmtSize(maxSize)} limit`
					: null,
			progress: simulate ? 0 : undefined,
		}));
		setSaid(
			[
				items.length
					? `Added ${items.map((i) => i.name + (i.error ? ` (${i.error})` : "")).join(", ")}.`
					: "",
				limit || "",
			]
				.filter(Boolean)
				.join(" "),
		);
		update((prev) => (multiple ? [...prev, ...items] : items));
		if (simulate)
			items
				.filter((i) => !i.error)
				.forEach((it) => {
					const t = setInterval(
						() =>
							update((prev) =>
								prev.map((p) => {
									if (p.id !== it.id) return p;
									const n = Math.min(100, (p.progress || 0) + 8 + Math.random() * 12);
									if (n >= 100) clearInterval(t);
									return { ...p, progress: n };
								}),
							),
						220,
					);
					timers.current.push(t);
				});
	};
	const remove = (f: FileItem, i: number) => {
		update((prev) => prev.filter((p) => p.id !== f.id));
		setSaid(`Removed ${f.name}.`);
		// Keep keyboard focus in place: next row's remove button, else the previous one, else the picker.
		requestAnimationFrame(() => {
			const b = list.current
				? list.current.querySelectorAll<HTMLElement>('button[aria-label^="Remove"]')
				: [];
			(b[i] || b[i - 1] || zone.current) && (b[i] || b[i - 1] || zone.current)!.focus();
		});
	};
	const hintText =
		hint ??
		[
			accept
				?.split(",")
				.map((s) => s.trim().replace(/^\./, "").replace("/*", ""))
				.join(", "),
			maxSize && `up to ${fmtSize(maxSize)}`,
			maxFiles && `max ${maxFiles}`,
		]
			.filter(Boolean)
			.join(" · ");
	const pick = () => !disabled && input.current!.click();
	// Caller attributes land on the focusable control; aria-describedby joins the hint's id.
	const describedBy =
		[rest["aria-describedby"], hintText ? hintId : null].filter(Boolean).join(" ") || undefined;
	const hidden = (
		<input
			ref={input}
			type="file"
			accept={accept}
			multiple={multiple}
			disabled={disabled}
			onChange={(e) => {
				add(e.target.files);
				e.target.value = "";
			}}
			className="q-file-upload__input"
		/>
	);
	const formFields = (
		<>
			{name && (
				<input
					ref={submit}
					type="file"
					name={name}
					form={form}
					multiple
					disabled={disabled}
					hidden
					aria-hidden="true"
					tabIndex={-1}
				/>
			)}
			{required && !files.some((f) => !f.error) && (
				<FormValue required disabled={disabled} form={form} focusTarget={() => zone.current} />
			)}
		</>
	);
	const cls = ["q-file-upload", disabled && "q-file-upload--disabled", className]
		.filter(Boolean)
		.join(" ");
	return (
		<div role="group" aria-labelledby={label ? labelId : undefined} className={cls} style={style}>
			{label && (
				<span id={labelId} className="q-file-upload__label">
					{label}
				</span>
			)}
			<span className="q-sr-only" aria-live="polite">
				{said}
			</span>
			{formFields}
			{variant === "button" ? (
				<div className="q-file-upload__bar">
					{hidden}
					<button
						{...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
						ref={zoneRef}
						type="button"
						disabled={disabled}
						aria-describedby={describedBy}
						onClick={(e) => {
							rest.onClick?.(e);
							if (!e.defaultPrevented) pick();
						}}
						className="q-file-upload__button"
					>
						<span aria-hidden="true">{"↑"}</span>
						{buttonLabel}
					</button>
					{hintText && (
						<span id={hintId} className="q-file-upload__hint">
							{hintText}
						</span>
					)}
				</div>
			) : (
				<div
					{...(rest as React.HTMLAttributes<HTMLDivElement>)}
					ref={zoneRef}
					role="button"
					tabIndex={disabled ? -1 : 0}
					aria-disabled={disabled || undefined}
					aria-label={
						rest["aria-label"] ??
						"Choose " +
							(multiple ? "files" : "a file") +
							" or drop " +
							(multiple ? "them" : "it") +
							" here"
					}
					aria-describedby={describedBy}
					onClick={(e) => {
						rest.onClick?.(e);
						if (!e.defaultPrevented) pick();
					}}
					onKeyDown={(e) => {
						rest.onKeyDown?.(e);
						if (!e.defaultPrevented && (e.key === "Enter" || e.key === " ")) {
							e.preventDefault();
							pick();
						}
					}}
					onDragOver={(e) => {
						rest.onDragOver?.(e);
						e.preventDefault();
						!disabled && setDrag(true);
					}}
					onDragLeave={(e) => {
						rest.onDragLeave?.(e);
						setDrag(false);
					}}
					onDrop={(e) => {
						rest.onDrop?.(e);
						e.preventDefault();
						setDrag(false);
						add(e.dataTransfer.files);
					}}
					className="q-file-upload__zone"
					data-dragging={drag || undefined}
				>
					{hidden}
					<span aria-hidden="true" className="q-file-upload__zone-icon">
						{"↑"}
					</span>
					<span className="q-file-upload__zone-text">
						{drag ? (
							"Release to add"
						) : (
							<>
								Drop {multiple ? "files" : "a file"} here or{" "}
								<span className="q-file-upload__browse">browse</span>
							</>
						)}
					</span>
					{hintText && (
						<span id={hintId} className="q-file-upload__hint">
							{hintText}
						</span>
					)}
				</div>
			)}
			{note && <span className="q-file-upload__note">{note}</span>}
			{files.length > 0 && (
				<div ref={list} role="list" aria-label="Files" className="q-file-upload__list">
					{files.map((f, i) => (
						<FileRow
							key={f.id}
							f={f}
							disabled={disabled}
							fresh={!initial.has(f.id)}
							onRemove={() => remove(f, i)}
						/>
					))}
				</div>
			)}
		</div>
	);
}
