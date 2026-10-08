import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const CATALOG = (theme: string) =>
	`/iframe.html?id=catalog--all-components&viewMode=story&globals=theme:${theme}`;

// Accepted on purpose (2026-10-08, "keep exact colours"): the reference's --muted-2 text and
// small --molten text. Any other contrast failure, and every other axe rule, still fails.
// landmark-unique is skipped for the catalog only: it shows several identical Pagination and
// Sidebar demos side by side; real pages name each nav with the components' `label` prop.
const ACCEPTED_LOW_CONTRAST: Record<string, string[]> = {
	foundry: ["#95959c", "#e0531a"],
	"foundry-dark": ["#6e6e76", "#f06a33"],
};

for (const theme of ["foundry", "foundry-dark"]) {
	test(`catalog has no axe violations beyond the accepted colours (${theme})`, async ({ page }) => {
		await page.goto(CATALOG(theme));
		await page.waitForFunction(() => document.querySelectorAll("section").length > 50);
		await page.addStyleTag({ content: "*{animation:none!important;transition:none!important}" });
		const { violations } = await new AxeBuilder({ page })
			.include("#storybook-root")
			.disableRules(["landmark-unique"])
			.analyze();
		const accepted = ACCEPTED_LOW_CONTRAST[theme] ?? [];
		const remaining = violations
			.map((v) => ({
				id: v.id,
				nodes: v.nodes.filter(
					(n) =>
						v.id !== "color-contrast" ||
						!accepted.includes(String(n.any[0]?.data?.fgColor ?? "").toLowerCase()),
				),
			}))
			.filter((v) => v.nodes.length > 0);
		expect(
			remaining.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`),
		).toEqual([]);
	});
}
