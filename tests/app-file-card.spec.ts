import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// App/FileCard — axe in both themes, plus the friendly kind (raw MIME only in the tooltip), sizes,
// the download link's name and attributes, Preview, and the "can't be previewed" note.
// Colour exceptions are the same accepted reference colours as tests/a11y.spec.ts.
const STORY = (theme = "foundry") =>
	`/iframe.html?id=app-filecard--all&viewMode=story&globals=theme:${theme}`;
const ACCEPTED_LOW_CONTRAST: Record<string, string[]> = {
	foundry: ["#95959c", "#e0531a"],
	"foundry-dark": ["#75757b", "#ff7a3d"],
};
const XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

async function open(page: Page, theme?: string) {
	await page.goto(STORY(theme));
	await page.locator("#narrow").waitFor();
}

for (const theme of ["foundry", "foundry-dark"]) {
	test(`no axe violations beyond the accepted colours (${theme})`, async ({ page }) => {
		await open(page, theme);
		await page.addStyleTag({ content: "*{animation:none!important;transition:none!important}" });
		const { violations } = await new AxeBuilder({ page }).include("#storybook-root").analyze();
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

test.describe("behaviour", () => {
	test.beforeEach(async ({ page }) => open(page));

	test("names the kind, not the MIME type; the MIME type is in a keyboard tooltip", async ({
		page,
	}) => {
		const card = page.locator("#artifact").getByRole("group", { name: "q3-pipeline.xlsx" });
		await expect(card).toBeVisible();
		await expect(card.locator(".q-file-card__tile")).toHaveText("XLSX");
		await expect(card.locator(".q-file-card__tile")).toHaveAttribute("aria-hidden", "true");
		await expect(card.locator(".q-file-card__meta")).toContainText("Spreadsheet");
		await expect(card.locator(".q-file-card__meta")).toContainText("2.5 KB");
		await expect(card.locator(".q-file-card__meta")).toContainText("v1 · 6 hours ago");

		const kind = card.locator(".q-file-card__kind");
		const tip = card.getByRole("tooltip", { includeHidden: true });
		await expect(tip).toHaveText(XLSX);
		// The raw MIME type is only the closed tooltip's text, never shown at rest.
		await expect(tip).toHaveAttribute("data-state", "closed");
		await kind.focus();
		await expect(kind).toBeFocused();
		await expect(tip).toHaveAttribute("data-state", "open");
		await expect(kind).toHaveAttribute("aria-describedby", (await tip.getAttribute("id")) ?? "");
		await page.keyboard.press("Escape");
		await expect(tip).toHaveAttribute("data-state", "closed");
	});

	test("derives kinds from MIME and extension", async ({ page }) => {
		const kinds = page.locator("#kinds .q-file-card");
		const expected: [tile: string, label: string, size: string][] = [
			["CSV", "CSV", "18 KB"],
			["PNG", "Image", "334 KB"],
			["JSON", "JSON", "51 KB"],
			["MD", "Text", "4.0 KB"],
			["ZIP", "Archive", "70 MB"],
			["BIN", "BIN", "1.0 MB"],
		];
		await expect(kinds).toHaveCount(expected.length);
		for (const [i, [tile, label, size]] of expected.entries()) {
			await expect(kinds.nth(i).locator(".q-file-card__tile")).toHaveText(tile);
			await expect(kinds.nth(i).locator(".q-file-card__kind")).toHaveText(label);
			await expect(kinds.nth(i).locator(".q-file-card__meta")).toContainText(size);
		}
		// No actions without href / onPreview.
		await expect(page.locator("#kinds .q-file-card__actions")).toHaveCount(0);
	});

	test("download is a native link named with the file, styled as a button", async ({ page }) => {
		const link = page.locator("#artifact").getByRole("link", { name: "Download q3-pipeline.xlsx" });
		await expect(link).toHaveAttribute("href", "/artifacts/a1/v1/download");
		await expect(link).toHaveAttribute("download", "q3-pipeline.xlsx");
		await expect(link).toHaveClass(/q-button--secondary/);
		await link.focus();
		await expect(link).toBeFocused();
		const unknown = page.locator("#unknown").getByRole("link", { name: /^Download/ });
		await expect(unknown).toHaveAttribute("download", "");
	});

	test("preview opens by keyboard; unpreviewable files say so", async ({ page }) => {
		const s = page.locator("#preview");
		await expect(s.locator(".q-file-card__preview")).toBeVisible();
		const btn = s.getByRole("button", { name: "Preview onboarding-flow-review.pdf" });
		await btn.focus();
		await expect(btn).toBeFocused();
		await page.keyboard.press("Enter");
		await expect(s.getByText("Opened the preview of onboarding-flow-review.pdf")).toBeVisible();
		await expect(page.locator("#unknown .q-file-card__note")).toHaveText(
			"This file type can’t be previewed",
		);
		await expect(page.locator("#unknown .q-file-card__preview")).toHaveCount(0);
	});

	test("version list: three cards, the current one badged and on the surface ground", async ({
		page,
	}) => {
		const list = page.getByRole("list", { name: "Versions of q3-pipeline.xlsx" });
		const cards = list.locator(".q-file-card");
		await expect(cards).toHaveCount(3);
		await expect(cards.nth(0)).toContainText("Current");
		await expect(cards.nth(0)).toHaveClass(/q-file-card--surface/);
		await expect(cards.nth(1)).not.toContainText("Current");
		await expect(cards.nth(1)).toHaveClass(/q-file-card--outlined/);
		await expect(list.getByRole("link", { name: /^Download/ })).toHaveCount(3);
	});

	test("row: the whole row opens the file; download is an icon that shows on hover or focus", async ({
		page,
	}) => {
		const row = page.locator("#rows .q-file-card").first();
		const link = row.locator(".q-file-card__link");
		await expect(link).toHaveAttribute("href", "/artifacts/0");
		// The name's link is stretched over the row, so a click anywhere on it lands on the link.
		await row.scrollIntoViewIfNeeded();
		const box = await row.boundingBox();
		if (!box) throw new Error("row not laid out");
		const hit = await page.evaluate(
			({ x, y }) => document.elementFromPoint(x, y)?.closest(".q-file-card__link") != null,
			{ x: box.x + box.width - 80, y: box.y + box.height / 2 },
		);
		expect(hit).toBe(true);
		const download = row.getByRole("link", { name: /Download/ });
		const actions = row.locator(".q-file-card__actions");
		await expect(actions).toHaveCSS("opacity", "0");
		await link.focus();
		await expect(actions).toHaveCSS("opacity", "1");
		await expect(download).toHaveAttribute("download", "");
	});

	test("narrow: actions wrap below the name instead of squeezing it", async ({ page }) => {
		const card = page.locator("#narrow .q-file-card");
		const name = await card.locator(".q-file-card__name").boundingBox();
		const actions = await card.locator(".q-file-card__actions").boundingBox();
		if (!name || !actions) throw new Error("card not laid out");
		expect(actions.y).toBeGreaterThanOrEqual(name.y + name.height);
	});
});
