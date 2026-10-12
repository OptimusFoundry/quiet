import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useState } from "react";
import { FileCard } from "../../components/app/FileCard";
import { Badge } from "../../components/core/Badge";
import "./FileCard.scss";

// App/FileCard — artifacts and their versions as agentworks shows them: friendly kind instead of the
// raw MIME type, size, version meta, and a Download that reads as an action.

const meta = {
	title: "App/FileCard",
	parameters: { density: "app", layout: "fullscreen" },
} satisfies Meta;
export default meta;

const XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
	return (
		<section id={id} className="q-sb-file-card__section" aria-labelledby={`${id}-title`}>
			<h2 id={`${id}-title`} className="q-sb-file-card__title">
				{title}
			</h2>
			{children}
		</section>
	);
}

function PdfThumb() {
	return (
		<div className="q-sb-file-card__thumb">
			<span className="q-sb-file-card__thumb-title">Onboarding flow review</span>
			<span>Run 9be01a4d · Meerkat onboarding and activation</span>
			<span>Drop-off is highest at the workspace invite step (38%).</span>
		</div>
	);
}

function PreviewDemo() {
	const [previewing, setPreviewing] = useState(false);
	return (
		<>
			<FileCard
				name="onboarding-flow-review.pdf"
				mimeType="application/pdf"
				bytes={482_133}
				meta="v2 · yesterday"
				preview={<PdfThumb />}
				onPreview={() => setPreviewing(true)}
				href="/artifacts/a2/v2/download"
				download
			/>
			<p className="q-sb-file-card__meta" aria-live="polite">
				{previewing ? "Opened the preview of onboarding-flow-review.pdf" : ""}
			</p>
		</>
	);
}

const VERSIONS = [
	{ v: 3, when: "6 hours ago", run: "233f76c2", bytes: 2_560 },
	{ v: 2, when: "yesterday", run: "1f0c9a77", bytes: 2_412 },
	{ v: 1, when: "3 days ago", run: "c4d7e210", bytes: 1_980 },
];

const KINDS = [
	{ name: "runs-export.csv", mimeType: "text/csv", bytes: 18_204 },
	{ name: "screenshot-orca.png", mimeType: "image/png", bytes: 341_877 },
	{ name: "transcript.json", mimeType: "application/json", bytes: 52_310 },
	{ name: "weekly-digest.md", mimeType: "text/markdown", bytes: 4_096 },
	{ name: "workspace-backup.zip", mimeType: "application/zip", bytes: 73_400_320 },
	{ name: "headless-trace.bin", mimeType: "application/octet-stream", bytes: 1_048_576 },
];

export const All: StoryObj = {
	render: () => (
		<div className="q-sb-file-card">
			<Section id="artifact" title="Artifact with download">
				<FileCard
					name="q3-pipeline.xlsx"
					mimeType={XLSX}
					bytes={2_560}
					meta="v1 · 6 hours ago"
					href="/artifacts/a1/v1/download"
					download="q3-pipeline.xlsx"
				/>
			</Section>
			<Section id="preview" title="With a preview">
				<PreviewDemo />
			</Section>
			<Section id="unknown" title="Unknown binary">
				<FileCard
					name="orca-session.dump"
					mimeType="application/octet-stream"
					bytes={12_884_901}
					meta="v1 · Headless runner · 2 days ago"
					previewable={false}
					href="/artifacts/a7/v1/download"
					download
				/>
			</Section>
			<Section id="versions" title="Versions">
				<ol className="q-sb-file-card__list" aria-label="Versions of q3-pipeline.xlsx">
					{VERSIONS.map((ver, i) => (
						<li key={ver.v}>
							<FileCard
								name="q3-pipeline.xlsx"
								mimeType={XLSX}
								bytes={ver.bytes}
								meta={`v${ver.v} · ${ver.when} · run ${ver.run}`}
								badge={
									i === 0 ? (
										<Badge variant="primary" size="sm">
											Current
										</Badge>
									) : undefined
								}
								href={`/artifacts/a1/v${ver.v}/download`}
								download
								variant={i === 0 ? "surface" : "outlined"}
								size="sm"
							/>
						</li>
					))}
				</ol>
			</Section>
			<Section id="kinds" title="Kinds, small and outlined">
				<div className="q-sb-file-card__list">
					{KINDS.map((f) => (
						<FileCard key={f.name} {...f} size="sm" variant="outlined" />
					))}
				</div>
			</Section>
			<Section id="rows" title="Rows: a list of files in a Panel">
				<ul className="q-sb-file-card__rows">
					{KINDS.slice(0, 3).map((f, i) => (
						<li key={f.name}>
							<FileCard
								{...f}
								size="sm"
								variant="row"
								to={`/artifacts/${i}`}
								trailing={["6 hours ago", "Yesterday", "Oct 9"][i]}
								href={`/artifacts/${i}/download`}
								download
							/>
						</li>
					))}
				</ul>
			</Section>
			<Section id="narrow" title="Narrow: actions wrap below">
				<div className="q-sb-file-card__narrow">
					<FileCard
						name="agentworks-cost-report-september-2026-final.xlsx"
						mimeType={XLSX}
						bytes={88_412}
						meta="v4 · $0.902049 · web-message"
						onPreview={() => {}}
						href="/artifacts/a9/v4/download"
						download
					/>
				</div>
			</Section>
		</div>
	),
};
