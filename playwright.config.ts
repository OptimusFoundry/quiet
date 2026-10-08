import { defineConfig } from "@playwright/test";

// Component behaviour + accessibility tests run against the Storybook dev server.
export default defineConfig({
	testDir: "tests",
	use: { baseURL: "http://localhost:6020" },
	webServer: {
		command: "npm run dev -- --ci --no-open",
		url: "http://localhost:6020",
		reuseExistingServer: true,
	},
});
