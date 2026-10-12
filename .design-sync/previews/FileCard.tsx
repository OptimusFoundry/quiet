import { Badge, FileCard, Panel } from "@optimusfoundry/quiet";

const XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export const Artifact = () => (
	<div style={{ width: 480 }}>
		<FileCard
			name="q3-pipeline.xlsx"
			mimeType={XLSX}
			bytes={2_560}
			meta="v1 · 6 hours ago"
			href="/artifacts/a1/v1/download"
			download="q3-pipeline.xlsx"
			onPreview={() => {}}
		/>
	</div>
);

export const WithPreview = () => (
	<div style={{ width: 480 }}>
		<FileCard
			name="onboarding-flow-review.pdf"
			mimeType="application/pdf"
			bytes={482_133}
			meta="v2 · yesterday"
			preview={
				<div style={{ display: "grid", gap: "var(--q-space-1)", padding: "var(--q-space-3)", fontSize: "var(--q-text-sm)", color: "var(--q-fg-muted)" }}>
					<strong style={{ color: "var(--q-fg)" }}>Onboarding flow review</strong>
					<span>Run 9be01a4d · Meerkat onboarding and activation</span>
					<span>Drop-off is highest at the workspace invite step (38%).</span>
				</div>
			}
			onPreview={() => {}}
			href="/artifacts/a2/v2/download"
			download
		/>
	</div>
);

const VERSIONS = [
	{ v: 3, when: "6 hours ago", run: "233f76c2", bytes: 2_560 },
	{ v: 2, when: "yesterday", run: "1f0c9a77", bytes: 2_412 },
	{ v: 1, when: "3 days ago", run: "c4d7e210", bytes: 1_980 },
];

export const Versions = () => (
	<ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "var(--q-space-1)", width: 480 }} aria-label="Versions of q3-pipeline.xlsx">
		{VERSIONS.map((ver, i) => (
			<li key={ver.v}>
				<FileCard
					name="q3-pipeline.xlsx"
					mimeType={XLSX}
					bytes={ver.bytes}
					meta={`v${ver.v} · ${ver.when} · run ${ver.run}`}
					badge={i === 0 ? <Badge variant="primary" size="sm">Current</Badge> : undefined}
					href={`/artifacts/a1/v${ver.v}/download`}
					download
					variant={i === 0 ? "surface" : "outlined"}
					size="sm"
				/>
			</li>
		))}
	</ol>
);

const FILES = [
	{ name: "runs-export.csv", mimeType: "text/csv", bytes: 18_204, at: "6 hours ago" },
	{ name: "screenshot-orca.png", mimeType: "image/png", bytes: 341_877, at: "Yesterday" },
	{ name: "transcript.json", mimeType: "application/json", bytes: 52_310, at: "Oct 9" },
];

export const RowsInPanel = () => (
	<div style={{ width: 360 }}>
		<Panel title="Artifacts" count={FILES.length}>
			<ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
				{FILES.map((f, i) => (
					<li key={f.name}>
						<FileCard
							name={f.name}
							mimeType={f.mimeType}
							bytes={f.bytes}
							size="sm"
							variant="row"
							to={`/artifacts/${i}`}
							trailing={f.at}
							href={`/artifacts/${i}/download`}
							download
						/>
					</li>
				))}
			</ul>
		</Panel>
	</div>
);

export const NotPreviewable = () => (
	<div style={{ width: 480 }}>
		<FileCard
			name="orca-session.dump"
			mimeType="application/octet-stream"
			bytes={12_884_901}
			meta="v1 · Headless runner · 2 days ago"
			previewable={false}
			variant="outlined"
			href="/artifacts/a7/v1/download"
			download
		/>
	</div>
);
