import { ChatMessage, ClaudeMark } from "@optimusfoundry/quiet";

export const InMessage = () => (
	<div style={{ width: 520 }}>
		<ChatMessage>
			<p>The approval for release-notes.pdf is waiting on Ada Park. I’ll post to #launches once she signs off.</p>
		</ChatMessage>
	</div>
);

export const Sizes = () => (
	<div style={{ display: "flex", gap: "var(--q-space-stack)", alignItems: "center" }}>
		<ClaudeMark />
		<ClaudeMark size="sm" />
	</div>
);
