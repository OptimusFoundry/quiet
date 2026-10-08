import { expect, test } from "@playwright/test";
import {
	defaultTheme,
	defineThemes,
	getTheme,
	resolveTheme,
	themeNames,
	themes,
} from "../src/styles/themes/themes";

// The registry itself, without a browser. Module state is shared, so each test uses its own names.
function captureWarnings(run: () => void): string[] {
	const seen: string[] = [];
	const original = console.warn;
	console.warn = (message: string) => seen.push(message);
	try {
		run();
	} finally {
		console.warn = original;
	}
	return seen;
}

test("built-in themes are registered and foundry is the default", () => {
	expect(defaultTheme).toBe("foundry");
	expect(themeNames.slice(0, 2)).toEqual(["foundry", "foundry-dark"]);
	expect(getTheme("foundry-dark")).toEqual({
		name: "foundry-dark",
		label: "Foundry dark",
		colorScheme: "dark",
	});
});

test("defineThemes adds product themes to the live registry", () => {
	defineThemes({ "unit-acme": { label: "Acme", colorScheme: "light" } });
	defineThemes({ "unit-acme": { label: "Acme 2", colorScheme: "dark" } });
	expect(themes["unit-acme"]).toEqual({ label: "Acme 2", colorScheme: "dark" });
	expect(themeNames.filter((n) => n === "unit-acme")).toHaveLength(1);
	expect(resolveTheme("unit-acme")).toBe("unit-acme");
	expect(getTheme("unit-acme").colorScheme).toBe("dark");
});

test("unknown names fall back to the default and warn once per name", () => {
	const warnings = captureWarnings(() => {
		expect(resolveTheme("unit-missing")).toBe(defaultTheme);
		expect(resolveTheme("unit-missing")).toBe(defaultTheme);
		expect(getTheme("unit-missing").name).toBe(defaultTheme);
		expect(resolveTheme("unit-missing-2")).toBe(defaultTheme);
	});
	expect(warnings).toHaveLength(2);
	expect(warnings[0]).toContain('"unit-missing"');
});

test("names that only exist on Object.prototype are not themes", () => {
	captureWarnings(() => {
		expect(resolveTheme("toString")).toBe(defaultTheme);
		expect(resolveTheme("__proto__")).toBe(defaultTheme);
	});
});

test("an absent theme resolves to the default without a warning", () => {
	const warnings = captureWarnings(() => {
		expect(resolveTheme(undefined)).toBe(defaultTheme);
		expect(resolveTheme(null)).toBe(defaultTheme);
	});
	expect(warnings).toEqual([]);
});
