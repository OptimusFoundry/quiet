import { expect, test } from "@playwright/test";
import {
	auditUrl,
	counts,
	group,
	updatingBaseline,
	writeBaseline,
} from "../scripts/quiet-audit-core.mjs";
import recorded from "./audit.baseline.json" with { type: "json" };

// Measured audit of the Patterns screens (scripts/quiet-audit-core.mjs). Structure and sideways
// scroll must be clean. Off-scale spacing, type, radius and colour may not grow past the counts in
// tests/audit.baseline.json; lower them there when you fix something. Rewrite the file with
// UPDATE_AUDIT_BASELINE=1 npx playwright test tests/audit.spec.ts --workers=1
const STORIES = ["app-shell", "dashboard", "records", "settings", "billing", "assistant", "states"];
const WIDTHS = [1280, 390];
const BASELINE = "tests/audit.baseline.json";
const update = updatingBaseline();
const baseline: Record<string, Record<string, number>> = update ? {} : recorded;
const seen: typeof baseline = {};

for (const story of STORIES) {
	for (const width of WIDTHS) {
		const key = `patterns-${story}@${width}`;
		test(`audit: ${key}`, async ({ page }) => {
			const { findings } = await auditUrl(
				page,
				`/iframe.html?id=patterns-${story}--default&viewMode=story`,
				{
					width,
					theme: "foundry",
					requireH1: true,
				},
			);
			const g = group(findings);
			expect(g.structure ?? [], "headings, landmarks, card-in-card").toEqual([]);
			expect(g.overflow ?? [], "sideways scroll").toEqual([]);
			const c = counts(findings);
			seen[key] = {
				spacing: c.spacing,
				type: c.type,
				radius: c.radius,
				colour: c.colour,
				derived: c.derived,
			};
			if (update) return;
			for (const [rule, n] of Object.entries(seen[key])) {
				expect(
					n,
					`${rule} findings on ${key}: ${JSON.stringify(g[rule as keyof typeof g] ?? [])}`,
				).toBeLessThanOrEqual(baseline[key]?.[rule] ?? 0);
			}
		});
	}
}

test.afterAll(async () => {
	if (update) await writeBaseline(BASELINE, seen);
});
