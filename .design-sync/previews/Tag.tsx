import { Avatar, Icon, Tag } from "@optimusfoundry/quiet";
import { useState } from "react";

const row = { display: "flex", flexWrap: "wrap", gap: "var(--q-space-2)", alignItems: "center" } as const;

export const Default = () => (
	<div style={row}>
		<Tag>web-message</Tag>
		<Tag>schedule</Tag>
		<Tag>Orca</Tag>
		<Tag>Headless</Tag>
	</div>
);

export const Sizes = () => (
	<div style={row}>
		<Tag size="md">Orca</Tag>
		<Tag size="sm">Orca</Tag>
		<Tag size="md" status="success">Succeeded</Tag>
		<Tag size="sm" status="success">Succeeded</Tag>
	</div>
);

export const Tones = () => (
	<div style={{ display: "grid", gap: "var(--q-space-3)" }}>
		<div style={row}>
			<Tag tone="default">TypeScript</Tag>
			<Tag tone="ink">Production</Tag>
		</div>
		<div style={row}>
			<Tag status="info">Queued</Tag>
			<Tag status="success">Succeeded</Tag>
			<Tag status="warning">Needs approval</Tag>
			<Tag status="error">Failed</Tag>
		</div>
	</div>
);

export const WithIconAndAvatar = () => (
	<div style={row}>
		<Tag icon={<Icon name="check" />}>Approved</Tag>
		<Tag avatar={<Avatar name="Ada Park" size="xs" />}>Ada Park</Tag>
		<Tag avatar={<Avatar name="Linus Okafor" size="xs" />} onRemove={() => {}}>
			Linus Okafor
		</Tag>
		<Tag onRemove={() => {}}>runner: Orca</Tag>
	</div>
);

export const Selectable = () => {
	const [sel, setSel] = useState<Record<string, boolean>>({ Running: true, Failed: true });
	return (
		<div style={row}>
			{["Running", "Succeeded", "Failed", "Cancelled"].map((s) => (
				<Tag key={s} selectable selected={!!sel[s]} onSelect={(v) => setSel({ ...sel, [s]: v })}>
					{s}
				</Tag>
			))}
			<Tag selectable disabled>
				Archived
			</Tag>
		</div>
	);
};
