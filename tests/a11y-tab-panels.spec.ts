import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

const story = (id: string) => `/iframe.html?id=navigation-tab-panels--${id}&viewMode=story`;

async function load(page: Page, id: string) {
	await page.goto(story(id));
	await page.getByRole("tablist").waitFor();
}

async function expectLinked(page: Page) {
	const tabs = page.getByRole("tab");
	for (let i = 0; i < (await tabs.count()); i++) {
		const tab = tabs.nth(i);
		const panelId = await tab.getAttribute("aria-controls");
		expect(panelId).toBeTruthy();
		const panel = page.locator(`[id="${panelId}"]`);
		await expect(panel).toHaveAttribute("role", "tabpanel");
		await expect(panel).toHaveAttribute("aria-labelledby", (await tab.getAttribute("id")) ?? "");
		const selected = (await tab.getAttribute("aria-selected")) === "true";
		if (selected) await expect(panel).toBeVisible();
		else await expect(panel).toBeHidden();
	}
}

test("panels record: every tab controls a labelled tabpanel; only the selected one shows", async ({
	page,
}) => {
	await load(page, "panels-record");
	await expect(page.getByRole("tab")).toHaveCount(4);
	await expect(page.getByRole("tabpanel", { includeHidden: true })).toHaveCount(4);
	await expectLinked(page);
	await expect(page.getByRole("tabpanel", { name: "General" })).toContainText("Name, email");
});

test("arrow keys rove and select, skipping disabled tabs; Tab moves into the panel", async ({
	page,
}) => {
	await load(page, "panels-record");
	await page.getByRole("tab", { name: "General" }).focus();
	await page.keyboard.press("ArrowRight");
	const team = page.getByRole("tab", { name: /Team/ });
	await expect(team).toBeFocused();
	await expect(team).toHaveAttribute("aria-selected", "true");
	await expect(page.getByRole("tabpanel", { name: /Team/ })).toContainText("Four people");
	await expectLinked(page);
	await page.keyboard.press("End");
	await expect(page.getByRole("tab", { name: "Billing" })).toBeFocused();
	await page.keyboard.press("ArrowRight");
	await expect(page.getByRole("tab", { name: "General" })).toBeFocused();
	await expect(page.getByRole("tab", { name: "General" })).toHaveAttribute("tabindex", "0");
	await expect(page.getByRole("tab", { name: "Billing" })).toHaveAttribute("tabindex", "-1");
	await page.keyboard.press("Tab");
	await expect(page.getByRole("tabpanel", { name: "General" })).toBeFocused();
});

test("render function: unselected panels are unmounted but still exist for aria-controls", async ({
	page,
}) => {
	await load(page, "panels-render-function");
	await expect(page.getByRole("tabpanel", { name: "Connected" })).toBeVisible();
	await expect(page.getByRole("tabpanel", { name: "Connected" })).toHaveText(
		"Connected integrations.",
	);
	await expect(page.getByText("Requests integrations.")).toHaveCount(0);
	await expectLinked(page);
	await page.getByRole("tab", { name: "Requests" }).click();
	await expect(page.getByRole("tabpanel", { name: "Requests" })).toHaveText(
		"Requests integrations.",
	);
	await expect(page.getByText("Connected integrations.")).toHaveCount(0);
});

test("standalone TabPanel links to the ids given to Tabs", async ({ page }) => {
	await load(page, "standalone-tab-panel");
	await expectLinked(page);
	await page.getByRole("tab", { name: "Payload" }).click();
	await expect(page.getByRole("tabpanel", { name: "Payload" })).toContainText("2 KB");
	await expectLinked(page);
});

for (const id of ["panels-record", "panels-render-function", "standalone-tab-panel"]) {
	test(`no axe violations (${id})`, async ({ page }) => {
		await load(page, id);
		const { violations } = await new AxeBuilder({ page }).include("#storybook-root").analyze();
		expect(violations.map((v) => v.id)).toEqual([]);
	});
}
