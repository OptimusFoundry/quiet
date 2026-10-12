import { Card, PageHero, PageShell, Text } from "@optimusfoundry/quiet";

const block = (h: number) =>
	({
		minHeight: h,
		padding: "var(--q-space-3)",
		background: "var(--q-bg-subtle)",
		border: "1px solid var(--q-border)",
		borderRadius: "var(--q-radius-sm)",
	}) as const;

const Shells = ({ layouts }: { layouts: ("single" | "half" | "third" | "sidebar" | "sidebar-right")[] }) => (
	<div style={{ display: "grid", gap: "var(--q-space-2)", width: 820 }}>
		{layouts.map((l) => {
			const n = l === "third" ? 3 : l === "single" ? 1 : 2;
			return (
				<PageShell
					key={l}
					layout={l}
					gap={16}
					style={{ paddingBottom: 0 }}
					header={
						<Text mono size="sm" color="muted" style={{ marginBottom: "var(--q-space-2)" }}>
							layout="{l}"
						</Text>
					}
				>
					{Array.from({ length: n }, (_, i) => (
						<div key={i} style={block(56)} />
					))}
				</PageShell>
			);
		})}
	</div>
);

export const Columns = () => <Shells layouts={["half", "third"]} />;

export const Sidebars = () => <Shells layouts={["sidebar", "sidebar-right"]} />;

export const WithHero = () => (
	<div style={{ width: 820 }}>
		<PageShell
			layout="sidebar"
			header={
				<PageHero
					size="md"
					title="Run #4182"
					description="Triggered by web-message · Orca runner · $0.902049"
				/>
			}
		>
			<div style={{ display: "grid", gap: "var(--q-space-3)" }}>
				<Card eyebrow="Step 1" title="Read inbound message" meta="0.8s" />
				<Card eyebrow="Step 2" title="Draft reply to Ada Park" meta="4.1s" />
			</div>
			<div style={block(160)}>
				<Text size="sm" color="muted">
					Artifacts · reply-draft.md, summary.json
				</Text>
			</div>
		</PageShell>
	</div>
);

export const Narrow = () => (
	<div style={{ width: 820, background: "var(--q-bg-subtle)" }}>
		<PageShell
			narrow
			header={<PageHero size="md" title="Workspace settings" ruled={false} />}
		>
			<div style={{ ...block(120), background: "var(--q-bg)" }}>
				<Text size="sm" color="muted">
					880px max column — forms and settings
				</Text>
			</div>
		</PageShell>
	</div>
);
