import { Attachment } from "@optimusfoundry/quiet";

const IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" width="480" height="300" viewBox="0 0 480 300"><rect width="480" height="300" fill="#f4f4f5"/><rect x="40" y="40" width="240" height="18" rx="9" fill="#18181b"/><rect x="40" y="76" width="380" height="10" rx="5" fill="#d4d4d8"/><rect x="40" y="98" width="320" height="10" rx="5" fill="#d4d4d8"/><rect x="40" y="150" width="120" height="100" rx="14" fill="#e4e4e7"/><rect x="180" y="150" width="120" height="100" rx="14" fill="#e4e4e7"/><rect x="320" y="150" width="120" height="100" rx="14" fill="#e0531a"/></svg>',
)}`;

const row = { display: "flex", flexWrap: "wrap", gap: "var(--q-space-stack)", alignItems: "flex-start", width: 520 } as const;

export const Chips = () => (
	<div style={row}>
		<Attachment name="run-233f76c2-transcript.pdf" size={1_240_000} type="application/pdf" onRemove={() => {}} />
		<Attachment name="costs-october.csv" size={82_000} type="text/csv" onRemove={() => {}} />
		<Attachment name="artifact-preview.png" size={284_000} type="image/png" src={IMAGE} onRemove={() => {}} />
	</div>
);

export const UploadStates = () => (
	<div style={row}>
		<Attachment name="orca-session.txt" size={18_000_000} type="text/plain" status="uploading" progress={0.42} onRemove={() => {}} />
		<Attachment name="headless-traces.zip" size={60_000_000} type="application/zip" status="uploading" onRemove={() => {}} />
		<Attachment name="approvals-export.docx" size={210_000} status="error" error="Over 20 MB" onRemove={() => {}} />
	</div>
);

export const Cards = () => (
	<div style={row}>
		<Attachment variant="card" name="artifact-preview.png" size={640_000} type="image/png" src={IMAGE} onOpen={() => {}} />
		<Attachment variant="card" name="run-costs-q3.xlsx" size={96_000} onOpen={() => {}} />
		<Attachment variant="card" name="release-notes.pdf" size={1_240_000} type="application/pdf" href="#" />
	</div>
);
