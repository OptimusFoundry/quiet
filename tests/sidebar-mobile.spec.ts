import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// Sidebar off-canvas drawer (SidebarProvider + SidebarTrigger + useSidebar), on the
// Navigation/Sidebar story's app shell.
const STORY = (theme = "foundry") =>
	`/iframe.html?id=navigation-sidebar--mobile-drawer&viewMode=story&globals=theme:${theme}`;
const PHONE = { width: 390, height: 844 };

const ACCEPTED_LOW_CONTRAST: Record<string, string[]> = {
	foundry: ["#95959c", "#e0531a"],
	"foundry-dark": ["#6e6e76", "#f06a33"],
};

async function open(page: Page, theme?: string) {
	await page.goto(STORY(theme));
	await page.getByTestId("sidebar-state").waitFor();
}

const trigger = (page: Page) => page.getByRole("button", { name: "Open navigation" });
const drawer = (page: Page) => page.getByRole("dialog", { name: "Primary" });
const state = (page: Page) => page.getByTestId("sidebar-state");

// A click on the scrim that lands right after the modal is committed, before any later task runs:
// what happens on a loaded machine, where the first click can beat React's passive effects. The
// blur stands in for the scrim mousedown's default action (focus moves to <body>).
const clickScrimOnCommit = (page: Page, scrim: string) =>
	page.evaluate((sel) => {
		new MutationObserver((records, obs) => {
			const el = records
				.flatMap((r) => [...r.addedNodes])
				.find((n): n is HTMLElement => n instanceof HTMLElement && n.matches(sel));
			if (!el) return;
			obs.disconnect();
			(document.activeElement as HTMLElement | null)?.blur();
			(el.querySelector(".q-sidebar-drawer__scrim") ?? el).dispatchEvent(
				new MouseEvent("click", { bubbles: true }),
			);
		}).observe(document.body, { subtree: true, childList: true });
	}, scrim);

async function axe(page: Page, theme: string) {
	const { violations } = await new AxeBuilder({ page }).include("#storybook-root").analyze();
	const accepted = ACCEPTED_LOW_CONTRAST[theme] ?? [];
	return violations
		.map((v) => ({
			id: v.id,
			nodes: v.nodes.filter(
				(n) =>
					v.id !== "color-contrast" ||
					!accepted.includes(String(n.any[0]?.data?.fgColor ?? "").toLowerCase()),
			),
		}))
		.filter((v) => v.nodes.length > 0)
		.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`);
}

test.describe("mobile viewport", () => {
	test.use({ viewport: PHONE });

	for (const theme of ["foundry", "foundry-dark"]) {
		test(`no axe violations, closed and open (${theme})`, async ({ page }) => {
			await open(page, theme);
			await page.addStyleTag({ content: "*{animation:none!important;transition:none!important}" });
			expect(await axe(page, theme)).toEqual([]);
			await trigger(page).click();
			await expect(drawer(page)).toBeVisible();
			expect(await axe(page, theme)).toEqual([]);
		});
	}

	test("closed: the nav is off-canvas and the trigger is collapsed", async ({ page }) => {
		await open(page);
		await expect(page.getByRole("navigation", { name: "Primary" })).toHaveCount(0);
		await expect(trigger(page)).toHaveAttribute("aria-expanded", "false");
		await expect(trigger(page)).not.toHaveAttribute("aria-controls", /.*/);
		await expect(state(page)).toHaveText("isMobile: true · open: false · collapsed: false");
	});

	test("opens as a labelled modal, traps focus, Escape closes and restores focus", async ({
		page,
	}) => {
		await open(page);
		await trigger(page).focus();
		await page.keyboard.press("Enter");
		const dialog = drawer(page);
		await expect(dialog).toBeVisible();
		await expect(dialog).toHaveAttribute("aria-modal", "true");
		await expect(trigger(page)).toHaveAttribute("aria-expanded", "true");
		await expect(trigger(page)).toHaveAttribute(
			"aria-controls",
			(await dialog.getAttribute("id")) ?? "",
		);
		await expect(state(page)).toHaveText("isMobile: true · open: true · collapsed: false");
		// Full labels, not the rail, inside the drawer.
		const nav = dialog.getByRole("navigation", { name: "Primary" });
		await expect(nav.getByRole("list", { name: "Workspace" })).toBeVisible();
		await expect(nav.getByRole("button", { name: "Projects (14)" })).toBeVisible();

		const inside = () => page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'));
		expect(await inside()).toBe(true);
		for (let i = 0; i < 12; i++) {
			await page.keyboard.press("Tab");
			expect(await inside()).toBe(true);
		}
		await page.keyboard.press("Shift+Tab");
		expect(await inside()).toBe(true);
		// The page behind is inert while the drawer is open.
		expect(
			await page
				.getByRole("button", { name: "Content action" })
				.evaluate((el) => !!el.closest("[inert]")),
		).toBe(true);

		await page.keyboard.press("Escape");
		await expect(dialog).toHaveCount(0);
		await expect(trigger(page)).toBeFocused();
		await expect(trigger(page)).toHaveAttribute("aria-expanded", "false");
		expect(
			await page
				.getByRole("button", { name: "Content action" })
				.evaluate((el) => !!el.closest("[inert]")),
		).toBe(false);
	});

	test("scrim click closes", async ({ page }) => {
		await open(page);
		await trigger(page).click();
		await expect(drawer(page)).toBeVisible();
		await page.mouse.click(PHONE.width - 10, PHONE.height / 2);
		await expect(drawer(page)).toHaveCount(0);
		await expect(trigger(page)).toBeFocused();
	});

	test("a scrim click right after the drawer opens still returns focus to the trigger", async ({
		page,
	}) => {
		await open(page);
		await clickScrimOnCommit(page, ".q-sidebar-drawer");
		await trigger(page).click();
		await expect(drawer(page)).toHaveCount(0);
		await expect(trigger(page)).toBeFocused();
		await expect(trigger(page)).toHaveAttribute("aria-expanded", "false");
	});

	test("the close button closes", async ({ page }) => {
		await open(page);
		await trigger(page).click();
		await drawer(page).getByRole("button", { name: "Close navigation" }).click();
		await expect(drawer(page)).toHaveCount(0);
	});

	test("picking an item navigates and closes the drawer", async ({ page }) => {
		await open(page);
		await trigger(page).click();
		await drawer(page).getByRole("button", { name: "Builds" }).click();
		await expect(drawer(page)).toHaveCount(0);
		await expect(page.getByTestId("current-page")).toHaveText("Builds");
		await trigger(page).click();
		await expect(drawer(page).getByRole("button", { name: "Builds" })).toHaveAttribute(
			"aria-current",
			"page",
		);
		await drawer(page).getByRole("link", { name: "Docs" }).click();
		await expect(drawer(page)).toHaveCount(0);
	});

	test("slides in and out, and the body doesn't scroll while open", async ({ page }) => {
		await open(page);
		await trigger(page).click();
		const panel = page.locator(".q-sidebar-drawer__panel");
		await expect(panel).toHaveAttribute("data-state", "open");
		expect(await panel.evaluate((el) => getComputedStyle(el).animationName)).toBe(
			"q-slide-in-left",
		);
		expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
		await page.keyboard.press("Escape");
		await expect(panel).toHaveAttribute("data-state", "closing");
		await expect(panel).toHaveCount(0);
		expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
	});

	test("growing past the breakpoint closes the drawer and shows the desktop sidebar", async ({
		page,
	}) => {
		await open(page);
		await trigger(page).click();
		await expect(drawer(page)).toBeVisible();
		await page.setViewportSize({ width: 1200, height: 800 });
		await expect(drawer(page)).toHaveCount(0);
		await expect(trigger(page)).toHaveCount(0);
		await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
		await page.setViewportSize(PHONE);
		await expect(state(page)).toHaveText("isMobile: true · open: false · collapsed: false");
		await expect(drawer(page)).toHaveCount(0);
	});
});

test.describe("reduced motion", () => {
	test.use({ viewport: PHONE, reducedMotion: "reduce" });

	test("no slide or fade, and closing unmounts at once", async ({ page }) => {
		await open(page);
		await trigger(page).click();
		const panel = page.locator(".q-sidebar-drawer__panel");
		await expect(panel).toBeVisible();
		expect(await panel.evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
		expect(
			await page
				.locator(".q-sidebar-drawer__scrim")
				.evaluate((el) => getComputedStyle(el).animationName),
		).toBe("none");
		await page.keyboard.press("Escape");
		await expect(panel).toHaveCount(0, { timeout: 100 });
	});

	test("the desktop rail collapses without a width transition", async ({ page }) => {
		await page.setViewportSize({ width: 1200, height: 800 });
		await open(page);
		const nav = page.getByRole("navigation", { name: "Primary" });
		expect(await nav.evaluate((el) => getComputedStyle(el).transitionDuration)).toBe("0s");
	});
});

test.describe("desktop viewport", () => {
	test.use({ viewport: { width: 1200, height: 800 } });

	test("no trigger; the rail collapses and useSidebar reports it", async ({ page }) => {
		await open(page);
		await expect(trigger(page)).toHaveCount(0);
		await expect(page.getByRole("dialog")).toHaveCount(0);
		const nav = page.getByRole("navigation", { name: "Primary" });
		await expect(state(page)).toHaveText("isMobile: false · open: false · collapsed: false");
		await nav.getByRole("button", { name: "Collapse sidebar" }).click();
		await expect(nav.getByRole("button", { name: "Expand sidebar" })).toBeVisible();
		await expect(state(page)).toHaveText("isMobile: false · open: false · collapsed: true");
	});
});
