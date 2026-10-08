import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	Alert,
	Badge,
	Banner,
	Button,
	Icon,
	Progress,
	QuietRoot,
	Stack,
	Tag,
	ThemeProvider,
	Toast,
	useTheme,
} from "../index";
// Registers acme and acme-dark at runtime and loads their CSS, as a product would at startup.
import "./external-theme/acme";

const meta: Meta = { title: "Theming", parameters: { layout: "padded" } };
export default meta;

function StatusSampler() {
	return (
		<Stack gap="md">
			<Alert variant="info" title="Info">
				Heads up.
			</Alert>
			<Alert variant="success" title="Success">
				Saved.
			</Alert>
			<Alert variant="warning" title="Warning">
				Check this.
			</Alert>
			<Alert variant="error" title="Error">
				It failed.
			</Alert>
			<Banner status="success" title="Deployed" dismissible={false} />
			<Banner status="error" title="Outage" dismissible={false} />
			<Toast variant="success" title="Copied" />
			<Toast variant="error" title="Not sent" />
			<Stack direction="row" gap="sm">
				<Badge variant="success">Live</Badge>
				<Badge variant="warning">Pending</Badge>
				<Badge variant="error">Failed</Badge>
			</Stack>
			<Stack direction="row" gap="sm">
				<Tag status="info">Info</Tag>
				<Tag status="success">Passing</Tag>
				<Tag status="warning">Flaky</Tag>
				<Tag status="error">Broken</Tag>
			</Stack>
			<Progress variant="success" value={100} aria-label="Success progress" />
			<Progress variant="error" value={40} aria-label="Error progress" showValue />
			<Stack direction="row" gap="sm">
				<Icon name="check" color="success" label="Success icon" />
				<Icon name="warning" color="warning" label="Warning icon" />
				<Icon name="close" color="error" label="Error icon" />
			</Stack>
		</Stack>
	);
}

/** A theme registered with defineThemes() and styled from outside the package. */
export const ExternalTheme: StoryObj = {
	render: () => (
		<Stack direction="row" gap="lg" align="flex-start">
			<QuietRoot theme="acme" density="app" data-testid="acme">
				<StatusSampler />
			</QuietRoot>
			<QuietRoot theme="acme-dark" density="app" data-testid="acme-dark">
				<StatusSampler />
			</QuietRoot>
		</Stack>
	),
};

/** An unregistered name falls back to the default theme (and warns once in dev). */
export const UnregisteredTheme: StoryObj = {
	render: () => (
		<Stack gap="md">
			<QuietRoot theme="not-registered" data-testid="unregistered-1">
				<Alert variant="success" title="Fell back to foundry" />
			</QuietRoot>
			<QuietRoot theme="not-registered" data-testid="unregistered-2">
				<Alert variant="error" title="Still foundry" />
			</QuietRoot>
		</Stack>
	),
};

function ThemeSwitch() {
	const { theme, setTheme } = useTheme();
	return (
		<Stack gap="md">
			<output data-testid="current-theme">{theme}</output>
			<Stack direction="row" gap="sm">
				<Button onClick={() => setTheme("acme")}>Acme</Button>
				<Button onClick={() => setTheme("acme-dark")}>Acme dark</Button>
				<Button onClick={() => setTheme("not-registered")}>Unregistered</Button>
			</Stack>
		</Stack>
	);
}

/** ThemeProvider and useTheme with registered external themes, applied to <html>. */
export const WithThemeProvider: StoryObj = {
	render: () => (
		<ThemeProvider defaultValue="acme">
			<ThemeSwitch />
		</ThemeProvider>
	),
};
