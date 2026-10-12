import { FileUpload } from "@optimusfoundry/quiet";

const col = { display: "grid", gap: "var(--q-space-stack)", maxWidth: 440 } as const;

export const Dropzone = () => (
	<div style={col}>
		<FileUpload label="Knowledge files" accept=".pdf,.md,.csv" multiple maxSize={20 * 1024 * 1024} maxFiles={5} />
	</div>
);

export const WithFiles = () => (
	<div style={col}>
		<FileUpload
			label="Knowledge files"
			accept=".pdf,.md,.csv"
			multiple
			maxSize={20 * 1024 * 1024}
			defaultFiles={[
				{ name: "support-playbook.pdf", size: 2_412_000 },
				{ name: "pricing-2026.csv", size: 48_300, progress: 62 },
				{ name: "onboarding-recording.mov", size: 412_000_000, error: "Over 20 MB" },
			]}
		/>
	</div>
);

export const Button = () => (
	<div style={col}>
		<FileUpload
			variant="button"
			label="Run attachment"
			buttonLabel="Attach file"
			accept="image/*,.pdf"
			defaultFiles={[{ name: "invoice-233f76c2.pdf", size: 184_000 }]}
		/>
	</div>
);

export const Disabled = () => (
	<div style={col}>
		<FileUpload label="Artifacts" disabled hint="Uploads are paused while run 233f76c2 is in progress" />
	</div>
);
