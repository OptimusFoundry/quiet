import React from "react";
import { useLinkElement } from "../../lib/link";
import { extension, formatBytes } from "../chat/chat-utils";
import { Button } from "../core/Button";
import { Icon } from "../core/Icon";
import { Tooltip } from "../feedback/Tooltip";
import "../core/Button.scss";
import "./FileCard.scss";

/** A file's friendly kind ("Spreadsheet") and its short type label for the tile ("XLSX"). */
export interface FileKind {
	label: string;
	ext: string;
}

// MIME types whose extension can't be read off the subtype.
const MIME_EXT: Record<string, string> = {
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
	"application/vnd.ms-excel": "xls",
	"application/vnd.oasis.opendocument.spreadsheet": "ods",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
	"application/msword": "doc",
	"application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
	"application/vnd.ms-powerpoint": "ppt",
	"text/plain": "txt",
	"text/markdown": "md",
	"image/jpeg": "jpg",
	"image/svg+xml": "svg",
	"application/gzip": "gz",
	"application/x-gzip": "gz",
	"application/x-7z-compressed": "7z",
	"application/x-tar": "tar",
	"application/octet-stream": "",
};

const KINDS: [label: string, exts: string[]][] = [
	["Spreadsheet", ["xlsx", "xls", "ods", "numbers"]],
	["CSV", ["csv", "tsv"]],
	["PDF", ["pdf"]],
	["Document", ["docx", "doc", "odt", "rtf", "pages"]],
	["Presentation", ["pptx", "ppt", "odp", "key"]],
	["JSON", ["json", "jsonl", "ndjson"]],
	["Image", ["png", "jpg", "jpeg", "gif", "webp", "svg", "avif", "heic"]],
	["Archive", ["zip", "gz", "tgz", "tar", "7z", "rar", "bz2", "xz"]],
	["Text", ["txt", "md", "log"]],
];

function extFromMime(mime: string) {
	if (mime in MIME_EXT) return MIME_EXT[mime]!;
	if (/spreadsheet|excel/.test(mime)) return "xlsx";
	const sub = mime.split("/")[1] ?? "";
	return sub
		.replace(/^(x-|vnd\.)/, "")
		.replace(/\+.*$/, "")
		.replace(/[^a-z0-9]/g, "")
		.slice(0, 5);
}

/**
 * A file's friendly kind from its MIME type and/or name: the sheet MIME gives
 * `{ label: "Spreadsheet", ext: "XLSX" }`; PDF, Image, Text, JSON, CSV and Archive are named; anything
 * else is its extension upper-cased (`"BIN"`), or `"File"` when there is none.
 */
export function fileKind(mimeType = "", name = ""): FileKind {
	const mime = mimeType.toLowerCase().split(";")[0]!.trim();
	const ext = extension(name) || (mime ? extFromMime(mime) : "");
	const byExt = KINDS.find(([, exts]) => exts.includes(ext))?.[0];
	const byMime = mime.startsWith("image/")
		? "Image"
		: mime.startsWith("text/") && !byExt
			? "Text"
			: /zip|compressed|tar|gzip/.test(mime) && !byExt
				? "Archive"
				: undefined;
	const tile = ext === "jpeg" ? "JPG" : ext.toUpperCase();
	return { label: byExt ?? byMime ?? (tile || "File"), ext: tile || "FILE" };
}

type FileCardHostAttributes = Omit<React.HTMLAttributes<HTMLDivElement>, "children">;

/**
 * One file or artifact version: a type tile, the name with its kind, size and meta, and its
 * Download / Preview actions. The raw MIME type stays available in a tooltip on the kind.
 * @startingPoint section="App" subtitle="A file with its kind, size and download" viewport="700x200"
 */
export interface FileCardProps extends FileCardHostAttributes {
	/** File name, e.g. "q3-pipeline.xlsx" */
	name: React.ReactNode;
	/** Raw MIME type; shown in a tooltip on the kind, used to derive the kind */
	mimeType?: string;
	/** File size in bytes, shown as "2.5 KB" */
	bytes?: number;
	/** Extra meta after kind and size, e.g. "v1 · 6 hours ago" */
	meta?: React.ReactNode;
	/** Friendly kind ("Spreadsheet"); derived from mimeType / name with `fileKind` when omitted */
	kind?: string;
	/** Tile label ("XLSX"); derived when omitted */
	ext?: string;
	/** Download URL: renders a "Download" link styled as a secondary button */
	href?: string;
	/** Sets the anchor's download attribute (true, or a suggested file name); keeps it a native link */
	download?: boolean | string;
	/** Shows a "Preview" ghost button */
	onPreview?: () => void;
	/** Next to the name, e.g. <Badge variant="primary">Current</Badge> */
	badge?: React.ReactNode;
	/** Thumbnail shown above the row */
	preview?: React.ReactNode;
	/** false shows a muted "This file type can't be previewed" note in place of a preview */
	previewable?: boolean;
	/** surface: subtle ground (default); outlined: hairline on the page ground; row: one item in a list
	 * of files (inside a Panel): the whole row opens `to`, the name is ink, download is an icon on hover */
	variant?: "surface" | "outlined" | "row";
	/** Where the file's own page is; the name links there (in `row`, the whole row does) */
	to?: string;
	/** Right-aligned, muted: e.g. "6 hours ago" in a row */
	trailing?: React.ReactNode;
	size?: "sm" | "md";
}

export function FileCard({
	name,
	mimeType,
	bytes,
	meta,
	kind,
	ext,
	href,
	download,
	onPreview,
	badge,
	preview,
	previewable,
	variant = "surface",
	to,
	trailing,
	size = "md",
	className,
	...rest
}: FileCardProps) {
	const id = React.useId();
	const nameId = `${id}-name`;
	const downloadId = `${id}-download`;
	const previewId = `${id}-preview`;
	const derived = fileKind(mimeType, typeof name === "string" ? name : "");
	const kindLabel = kind ?? derived.label;
	const tile = ext ?? derived.ext;
	const saves = download != null && download !== false;
	const A = useLinkElement(href, saves);
	const To = useLinkElement(to);
	const row = variant === "row";
	const sizeText = formatBytes(bytes);
	const cls = [
		"q-file-card",
		`q-file-card--${variant === "outlined" || variant === "row" ? variant : "surface"}`,
		`q-file-card--${size === "sm" ? "sm" : "md"}`,
		className,
	]
		.filter(Boolean)
		.join(" ");
	const kindEl = <span className="q-file-card__kind">{kindLabel}</span>;
	return (
		<div role="group" aria-labelledby={nameId} className={cls} {...rest}>
			{preview != null ? (
				<div className="q-file-card__preview">{preview}</div>
			) : previewable === false ? (
				<p className="q-file-card__note">This file type can’t be previewed</p>
			) : null}
			<div className="q-file-card__row">
				<span className="q-file-card__tile" aria-hidden="true">
					{tile}
				</span>
				<div className="q-file-card__body">
					<div className="q-file-card__title">
						<span id={nameId} className="q-file-card__name">
							{to ? (
								<To href={to} className="q-file-card__link">
									{name}
								</To>
							) : (
								name
							)}
						</span>
						{badge}
					</div>
					<div className="q-file-card__meta">
						{mimeType ? (
							<Tooltip content={mimeType} placement="bottom">
								{kindEl}
							</Tooltip>
						) : (
							kindEl
						)}
						{sizeText && <span>{sizeText}</span>}
						{meta != null && <span>{meta}</span>}
					</div>
				</div>
				{trailing != null && <span className="q-file-card__trailing">{trailing}</span>}
				{(onPreview || href) && (
					<div className="q-file-card__actions">
						{onPreview && (
							<Button
								variant="ghost"
								size="sm"
								id={previewId}
								aria-labelledby={`${previewId} ${nameId}`}
								onClick={onPreview}
							>
								Preview
							</Button>
						)}
						{href && (
							<A
								href={href}
								id={downloadId}
								aria-labelledby={`${downloadId} ${nameId}`}
								download={saves ? download : undefined}
								className={
									row
										? "q-button q-button--ghost q-button--sm q-button--icon-only"
										: "q-button q-button--secondary q-button--sm"
								}
							>
								<Icon name="arrow-down" />
								{row ? <span className="q-sr-only">Download</span> : "Download"}
							</A>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
