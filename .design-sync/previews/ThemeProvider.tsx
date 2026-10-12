import { Badge, Button, EntityLink, Panel, QuietRoot, Switch, Text, ThemeProvider, useTheme } from "@optimusfoundry/quiet";

function AppBar() {
	const { theme, setTheme } = useTheme();
	return (
		<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--q-space-stack)" }}>
			<Text weight="medium">agentworks</Text>
			<Switch
				size="sm"
				label="Dark mode"
				checked={theme === "foundry-dark"}
				onChange={(on) => setTheme(on ? "foundry-dark" : "foundry")}
			/>
		</div>
	);
}

function Approvals() {
	return (
		<Panel title="Approvals" count={1} actions={<Badge variant="warning">Awaiting you</Badge>}>
			<div style={{ display: "grid", gap: "var(--q-space-stack)" }}>
				<Text size="sm">
					<EntityLink href="/runs/51c0d7f3" kind="Run" id="51c0d7f3" mono /> wants to merge a pull request.
				</Text>
				<div style={{ display: "flex", gap: "var(--q-space-1)" }}>
					<Button size="sm" variant="secondary">Deny</Button>
					<Button size="sm" variant="primary">Approve</Button>
				</div>
			</div>
		</Panel>
	);
}

const shell = { padding: "var(--q-space-3)", display: "grid", gap: "var(--q-space-stack)", width: 440 } as const;

// The app's theme comes from ThemeProvider (on <html>, remembered); the toggle reads and sets it with useTheme().
export const AppWithThemeToggle = () => (
	<ThemeProvider defaultValue="foundry">
		<QuietRoot density="app" style={shell}>
			<AppBar />
			<Approvals />
		</QuietRoot>
	</ThemeProvider>
);

// A QuietRoot without `theme` follows the provider; one with `theme` scopes its own island.
export const ProviderWithDarkIsland = () => (
	<ThemeProvider defaultValue="foundry">
		<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--q-space-stack)", width: 760 }}>
			<QuietRoot density="app" style={{ ...shell, width: "auto" }}>
				<Text size="xs" color="muted">Follows ThemeProvider</Text>
				<Approvals />
			</QuietRoot>
			<QuietRoot density="app" theme="foundry-dark" style={{ ...shell, width: "auto", borderRadius: "var(--q-radius-lg)" }}>
				<Text size="xs" color="muted">{'theme="foundry-dark"'}</Text>
				<Approvals />
			</QuietRoot>
		</div>
	</ThemeProvider>
);
