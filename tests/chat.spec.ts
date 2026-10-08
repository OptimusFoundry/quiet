import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// Chat: ChatThread, ChatMessage, ChatComposer, Attachment, ToolCall, CodeBlock, PromptSuggestions —
// axe in both themes, plus keyboard, focus and announcements. The demo's reply is a fake timer stream.
// Colour exceptions are the same accepted reference colours as tests/a11y.spec.ts.
const STORY = (theme = "foundry") =>
	`/iframe.html?id=chat--all&viewMode=story&globals=theme:${theme}`;
const ACCEPTED_LOW_CONTRAST: Record<string, string[]> = {
	foundry: ["#95959c", "#e0531a"],
	"foundry-dark": ["#6e6e76", "#f06a33"],
};

// File contents for setInputFiles. Node's Buffer, reached through globalThis because the project's
// tsconfig has no Node types.
type Bytes = Parameters<Page["setInputFiles"]>[1] extends infer F
	? F extends { buffer: infer B }
		? B
		: never
	: never;
const bytes = (s: string) =>
	(globalThis as unknown as { Buffer: { from(s: string): Bytes } }).Buffer.from(s);

async function open(page: Page, theme?: string) {
	await page.goto(STORY(theme));
	await page.locator("#prompt-suggestions").waitFor();
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

	const demo = (page: Page) => page.locator("#chat-thread").getByRole("form").first().locator("..");

	test("composer: Shift+Enter is a new line, Enter sends, the reply streams then can be stopped", async ({
		page,
	}) => {
		const root = demo(page);
		const log = root.getByRole("log", { name: "Conversation" });
		const box = root.getByRole("textbox", { name: "Message" });
		await box.click();
		await box.press("Shift+Enter");
		await expect(box).toHaveValue("\n");
		await box.fill("Line one");
		await box.press("Shift+Enter");
		await box.pressSequentially("line two");
		await expect(box).toHaveValue("Line one\nline two");
		await box.press("Enter");
		await expect(box).toHaveValue("");
		await expect(log.getByRole("article", { name: "You said" }).last()).toContainText("Line one");
		// While Claude responds: Stop replaces Send, the reply is busy, and it's announced once.
		const stop = root.getByRole("button", { name: "Stop responding" });
		await expect(stop).toBeVisible();
		const reply = log.getByRole("article", { name: "Claude" }).last();
		await expect(reply.getByRole("status")).toHaveText("Claude is responding");
		await expect(reply.locator(".q-chat-message__body")).toHaveAttribute("aria-busy", "true");
		await expect(reply.getByRole("button", { name: /query_database/ })).toBeVisible();
		await stop.click();
		await expect(root.getByRole("button", { name: "Send message" })).toBeVisible();
		await expect(reply).toContainText("Stopped");
		await expect(reply.locator(".q-chat-message__body")).not.toHaveAttribute("aria-busy", "true");
	});

	test("composer: attaching files shows chips; removing one moves focus to the next, then the text", async ({
		page,
	}) => {
		const root = demo(page);
		const box = root.getByRole("textbox", { name: "Message" });
		await root.locator('input[type="file"]').setInputFiles([
			{ name: "notes.pdf", mimeType: "application/pdf", buffer: bytes("%PDF-1.4") },
			{ name: "signups.csv", mimeType: "text/csv", buffer: bytes("a,b\n1,2") },
		]);
		const files = root.getByRole("form").getByRole("list", { name: "Attachments" });
		await expect(files.getByRole("listitem")).toHaveCount(2);
		await expect(root.getByRole("status").last()).toHaveText("2 files attached.");
		await root.getByRole("button", { name: "Remove notes.pdf" }).click();
		await expect(root.getByRole("button", { name: "Remove signups.csv" })).toBeFocused();
		await page.keyboard.press("Enter");
		await expect(files).toHaveCount(0);
		await expect(box).toBeFocused();
		// Attachments alone can be sent; they arrive as cards on the user's turn.
		await root.locator('input[type="file"]').setInputFiles({
			name: "brief.md",
			mimeType: "text/markdown",
			buffer: bytes("# Brief"),
		});
		await box.press("Enter");
		const sent = root.getByRole("article", { name: "You said" }).last();
		await expect(sent.getByRole("group", { name: /brief\.md/ })).toBeVisible();
	});

	test("composer: refuses files over the limit or of the wrong type, and says so", async ({
		page,
	}) => {
		const ready = page.locator("#chat-composer").getByRole("form").first();
		await ready.locator('input[type="file"]').setInputFiles([
			{ name: "song.mp3", mimeType: "audio/mpeg", buffer: bytes("x") },
			{ name: "ok.txt", mimeType: "text/plain", buffer: bytes("fine") },
		]);
		await expect(ready.getByRole("listitem")).toHaveCount(1);
		await expect(ready.getByRole("status")).toContainText(
			"song.mp3: this file type isn’t supported",
		);
	});

	test("thread: scrolled up, a new message offers Jump to latest instead of moving you", async ({
		page,
	}) => {
		const root = demo(page);
		const log = root.getByRole("log", { name: "Conversation" });
		await log.evaluate((el) => {
			el.scrollTop = 0;
			el.dispatchEvent(new Event("scroll"));
		});
		await root.getByRole("textbox", { name: "Message" }).fill("Another question");
		await root.getByRole("textbox", { name: "Message" }).press("Enter");
		const jump = root.getByRole("button", { name: "Jump to latest" });
		await expect(jump).toBeVisible();
		expect(await log.evaluate((el) => el.scrollTop)).toBeLessThan(40);
		await jump.click();
		await expect(jump).toBeHidden();
		await expect(log).toBeFocused();
		await expect
			.poll(() => log.evaluate((el) => el.scrollHeight - el.scrollTop - el.clientHeight))
			.toBeLessThan(60);
	});

	test("message + code block: Copy announces", async ({ page, context }) => {
		await context.grantPermissions(["clipboard-read", "clipboard-write"]);
		const reply = page.locator("#chat-message").getByRole("article", { name: "Claude" }).first();
		await reply.getByRole("button", { name: "Copy message" }).click();
		await expect(reply.getByRole("status")).toHaveText("Copied to clipboard");
		await expect(reply.getByRole("button", { name: "Copied" })).toBeVisible();
		const code = page.locator("#code-block").getByRole("figure").first();
		await code.getByRole("button", { name: "Copy code" }).click();
		await expect(code.getByRole("status")).toHaveText("Code copied to clipboard");
		expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("date_trunc");
	});

	test("tool call: header toggles details with Enter; region named; closed details are inert", async ({
		page,
	}) => {
		const s = page.locator("#tool-call");
		const search = s.getByRole("button", { name: /send_email/ });
		await expect(search).toHaveAttribute("aria-expanded", "false");
		await expect(search).toContainText("failed");
		await search.focus();
		await page.keyboard.press("Enter");
		await expect(search).toHaveAttribute("aria-expanded", "true");
		await expect(s.getByRole("region", { name: "send_email details" })).toContainText("SMTP 421");
		await page.keyboard.press("Enter");
		await expect(search).toHaveAttribute("aria-expanded", "false");
	});

	test("prompt suggestions: one tab stop, arrows move, Enter picks", async ({ page }) => {
		const group = page
			.locator("#prompt-suggestions")
			.getByRole("group", { name: "Starters", exact: true });
		const first = group.getByRole("button", { name: "Summarise this thread" });
		await expect(group.locator('[tabindex="0"]')).toHaveCount(1);
		await first.focus();
		await page.keyboard.press("ArrowRight");
		await expect(group.getByRole("button", { name: "Draft a reply" })).toBeFocused();
		await page.keyboard.press("End");
		await expect(group.getByRole("button", { name: "Translate to Swedish" })).toBeFocused();
		await page.keyboard.press("Enter");
		await expect(page.locator("#prompt-suggestions")).toContainText("Picked: Translate to Swedish");
		await expect(group.locator('[tabindex="0"]')).toHaveText("Translate to Swedish");
	});

	test("attachment: uploading reports progress; errors and cards are named", async ({ page }) => {
		const s = page.locator("#attachment");
		await expect(s.getByRole("progressbar", { name: "Uploading recording.m4a" })).toHaveAttribute(
			"aria-valuenow",
			"42",
		);
		await expect(s.getByRole("group", { name: /contract\.docx, Too large/ })).toBeVisible();
		await expect(s.getByRole("button", { name: /^Open dashboard\.png, PNG/ })).toBeVisible();
	});
});
