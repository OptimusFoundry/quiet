import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { FileCard } from "../../../components/app/FileCard";
import { Badge } from "../../../components/core/Badge";
import { Column, Note } from "../Story";
import "./FileCard.scss";

const XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

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

const meta = {
	title: "Components/App/FileCard",
	component: FileCard,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	args: {
		name: "q3-pipeline.xlsx",
		mimeType: XLSX,
		bytes: 2_560,
		meta: "v1 · 6 hours ago",
		href: "/artifacts/a1/v1/download",
		download: "q3-pipeline.xlsx",
		variant: "surface",
		size: "md",
	},
	argTypes: {
		name: { control: "text" },
		meta: { control: "text" },
		trailing: { control: "text" },
		badge: { control: false },
		preview: { control: false },
		onPreview: { control: false },
	},
	decorators: [
		(Story) => (
			<Column wide>
				<Story />
			</Column>
		),
	],
} satisfies Meta<typeof FileCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"The kind (“Spreadsheet”) is read off the MIME type or name; the raw MIME type is in a tooltip on it.",
			},
		},
	},
};

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
			<Note>
				<span aria-live="polite">
					{previewing ? "Opened the preview of onboarding-flow-review.pdf" : "Try Preview."}
				</span>
			</Note>
		</>
	);
}

export const WithPreview: Story = {
	parameters: {
		docs: { description: { story: "A thumbnail above the row, and a Preview ghost button." } },
	},
	render: () => <PreviewDemo />,
};

export const NotPreviewable: Story = {
	parameters: {
		docs: {
			description: { story: "`previewable={false}` says so in place of a preview." },
		},
	},
	args: {
		name: "orca-session.dump",
		mimeType: "application/octet-stream",
		bytes: 12_884_901,
		meta: "v1 · Headless runner · 2 days ago",
		previewable: false,
		href: "/artifacts/a7/v1/download",
		download: true,
	},
};

export const Versions: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"An artifact's versions: the current one on the surface with a badge, older ones outlined.",
			},
		},
	},
	render: () => (
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
	),
};

export const Kinds: Story = {
	parameters: {
		docs: {
			description: {
				story: "Friendly kinds from MIME type and name; anything else is its extension.",
			},
		},
	},
	render: () => (
		<div className="q-sb-file-card__list">
			{KINDS.map((f) => (
				<FileCard key={f.name} {...f} size="sm" variant="outlined" />
			))}
		</div>
	),
};

export const Rows: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'`variant="row"`: one item in a list of files inside a Panel. The whole row opens `to`; download is an icon on hover.',
			},
		},
	},
	render: () => (
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
	),
};

export const NarrowLongName: Story = {
	parameters: { docs: { description: { story: "In a narrow column the actions wrap below." } } },
	render: () => (
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
	),
};
