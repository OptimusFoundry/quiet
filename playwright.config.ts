import { defineConfig } from "@playwright/test";

// Runs against Storybook (quiet) and a static server over the Claude Design mirror (reference).
export default defineConfig({
	testDir: "tests",
	timeout: 120_000,
	use: { baseURL: "http://localhost:6020" },
	webServer: [
		{
			command: "npm run dev -- --ci --no-open",
			url: "http://localhost:6020",
			reuseExistingServer: true,
		},
		{
			command: "python3 scripts/serve-reference.py 8791",
			url: "http://127.0.0.1:8791/components/index.html",
			reuseExistingServer: true,
		},
	],
});
