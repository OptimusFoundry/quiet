import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../../components/core/Button";
import { FileUpload, type FileUploadItem } from "../../../components/forms/FileUpload";
import { Column, Row } from "../Story";
import { FormDemo } from "./FormDemo";
import "./FileUpload.scss";

const meta = {
	title: "Components/Forms/FileUpload",
	component: FileUpload,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		label: "Artifacts",
		multiple: true,
		accept: ".pdf,.csv,.json",
		maxSize: 10 * 1048576,
		variant: "dropzone",
	},
	argTypes: {
		label: { control: "text" },
		hint: { control: "text" },
		files: { control: false },
		defaultFiles: { control: false },
		onChange: { control: false },
		ref: { table: { disable: true } },
	},
	decorators: [
		(Story) => (
			<Column>
				<Story />
			</Column>
		),
	],
} satisfies Meta<typeof FileUpload>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	parameters: {
		docs: {
			description: {
				story: "The hint is written from `accept`, `maxSize` and `maxFiles` unless you pass one.",
			},
		},
	},
};

export const WithFiles: Story = {
	parameters: {
		docs: {
			description: {
				story: "Rows show size, progress while below 100, or an error in place of the status.",
			},
		},
	},
	args: {
		defaultFiles: [
			{ id: 1, name: "eval-results-2026-10-11.csv", size: 482_000 },
			{ id: 2, name: "run-7f3a-trace.json", size: 2_400_000, progress: 62 },
			{ id: 3, name: "invoice-INV-2041.pdf", size: 14_200_000, error: "Larger than 10 MB" },
		],
	},
};

export const ButtonVariant: Story = {
	parameters: {
		docs: {
			description: { story: "A compact button instead of the drop zone, for a single file." },
		},
	},
	args: {
		variant: "button",
		label: "Workspace logo",
		multiple: false,
		accept: "image/*",
		hint: "PNG or SVG, square",
		buttonLabel: "Choose image",
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		defaultFiles: [{ id: 1, name: "eval-results-2026-10-11.csv", size: 482_000 }],
	},
};

export const SimulatedUpload: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"`simulateUpload` animates progress for new files. For demos only; real progress comes from your uploader (see Controlled).",
			},
		},
	},
	args: { simulateUpload: true },
};

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
		{ id: 101, name: "run-brief-v3.pdf", size: 482_000 },
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
			...["eval-results.csv", "broken-export.zip", "notes.md"].map((name, i) => ({
				id: `sample-${Date.now()}-${i}`,
				name,
				size: 120_000 * (i + 1),
				file: new File(["x".repeat(64)], name),
			})),
		]);
	return (
		<>
			<FileUpload
				label="Artifacts"
				hint="Any file · names with “broken” fail"
				files={files}
				onChange={onChange}
			/>
			<Row>
				<Button variant="secondary" onClick={pickSamples}>
					Add sample files
				</Button>
				<Button variant="ghost" onClick={() => setFiles([])}>
					Clear
				</Button>
			</Row>
			<output aria-label="App state" className="q-sb-file-upload__state">
				{files
					.map(
						(f) =>
							`${f.id}  ${f.name}  ${f.error ? `error: ${f.error}` : f.progress != null ? `${Math.round(f.progress)}%` : "done"}`,
					)
					.join("\n") || "No files."}
			</output>
		</>
	);
}

export const Controlled: Story = {
	parameters: {
		docs: {
			description: {
				story: "The app owns `files` and writes `progress` and `error` from its own uploader.",
			},
		},
	},
	render: () => <ControlledDemo />,
};

export const InANativeForm: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"With `name`, each picked file without an error is submitted (the form needs `multipart/form-data`). `required` blocks submit while none is.",
			},
		},
	},
	render: () => (
		<FormDemo label="Attach artifacts" submit="Attach" multipart>
			<FileUpload
				label="Artifacts"
				name="artifacts"
				required
				multiple
				accept=".pdf,.png"
				maxSize={5 * 1048576}
			/>
		</FormDemo>
	),
};
