import type { Meta, StoryObj } from "@storybook/react-vite";
import { type SubmitEvent, useEffect, useRef, useState } from "react";
import { Button, FileUpload, type FileUploadItem } from "../../index";
import "./FileUpload.scss";

// Additions on top of the Claude Design catalog: a controlled FileUpload the app owns (progress
// and errors from its own uploader), and native form participation (name, required).
const meta: Meta = { title: "Extensions/FileUpload", parameters: { layout: "padded" } };
export default meta;

/** Stand-in for a real uploader: ticks progress, and fails any file named like "*broken*". */
function useFakeUploader(setFiles: (fn: (prev: FileUploadItem[]) => FileUploadItem[]) => void) {
	const timers = useRef(new Map<FileUploadItem["id"], ReturnType<typeof setInterval>>());
	useEffect(() => {
		const all = timers.current;
		return () => {
			for (const t of all.values()) clearInterval(t);
		};
	}, []);
	const patch = (id: FileUploadItem["id"], next: Partial<FileUploadItem>) =>
		setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...next } : f)));
	const stop = (id: FileUploadItem["id"]) => {
		clearInterval(timers.current.get(id));
		timers.current.delete(id);
	};
	const start = (item: FileUploadItem) => {
		let pct = 0;
		const fails = /broken/i.test(item.name);
		const t = setInterval(() => {
			pct = Math.min(100, pct + 7 + Math.random() * 10);
			if (fails && pct > 45) {
				stop(item.id);
				patch(item.id, { progress: undefined, error: "Upload failed: server said 500" });
				return;
			}
			if (pct >= 100) stop(item.id);
			patch(item.id, { progress: pct });
		}, 240);
		timers.current.set(item.id, t);
	};
	return { start, stop };
}

function ControlledDemo() {
	// The app owns the list: rows already on the server, plus whatever the user adds.
	const [files, setFiles] = useState<FileUploadItem[]>([
		{ id: 101, name: "brief-v3.pdf", size: 482_000 },
	]);
	const uploader = useFakeUploader(setFiles);
	const onChange = (next: FileUploadItem[]) => {
		const known = new Set(files.map((f) => f.id));
		for (const f of files) if (!next.some((n) => n.id === f.id)) uploader.stop(f.id);
		const added = next.filter((f) => !known.has(f.id) && f.file && !f.error);
		setFiles(next.map((f) => (added.includes(f) ? { ...f, progress: 0 } : f)));
		for (const f of added) uploader.start(f);
	};
	// Storybook can't pick files for you; this feeds the same onChange path a pick would.
	const pickSamples = () =>
		onChange([
			...files,
			...["moodboard.png", "broken-export.zip", "notes.md"].map((name, i) => ({
				id: `sample-${Date.now()}-${i}`,
				name,
				size: 120_000 * (i + 1),
				file: new File(["x".repeat(64)], name),
			})),
		]);
	return (
		<div id="controlled" className="q-sb-file-upload">
			<FileUpload
				label="Attachments"
				hint="Any file · names with “broken” fail"
				files={files}
				onChange={onChange}
			/>
			<div className="q-sb-file-upload__row">
				<Button variant="secondary" onClick={pickSamples}>
					Add sample files
				</Button>
				<Button variant="ghost" onClick={() => setFiles([])}>
					Clear
				</Button>
			</div>
			<output aria-label="App state" className="q-sb-file-upload__output">
				{files
					.map(
						(f) =>
							`${f.id}  ${f.name}  ${f.error ? `error: ${f.error}` : f.progress != null ? `${Math.round(f.progress)}%` : "done"}`,
					)
					.join("\n") || "No files."}
			</output>
		</div>
	);
}

export const Controlled: StoryObj = { render: () => <ControlledDemo /> };

function NativeFormDemo() {
	const [sent, setSent] = useState<string | null>(null);
	const submit = (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		setSent(
			data
				.getAll("attachments")
				.map((v) => (v instanceof File ? `attachments=${v.name} (${v.size} B)` : String(v)))
				.join("\n") || "attachments: nothing",
		);
	};
	return (
		<form
			id="file-form"
			aria-label="Send files"
			encType="multipart/form-data"
			onSubmit={submit}
			className="q-sb-file-upload"
		>
			<FileUpload
				label="Attachments (required)"
				name="attachments"
				required
				accept=".pdf,.png"
				maxSize={5 * 1048576}
			/>
			<div className="q-sb-file-upload__row">
				<Button type="submit">Submit</Button>
			</div>
			<output aria-label="Submitted data" className="q-sb-file-upload__output">
				{sent ?? "Nothing submitted yet."}
			</output>
		</form>
	);
}

export const NativeForm: StoryObj = { render: () => <NativeFormDemo /> };
