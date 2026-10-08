// Theme registry. A theme is a [data-theme] block in themes/_<name>.scss that sets the tier-1
// palette (and may override tier-2/3 tokens); this file lists them for pickers and providers.
export const themes = {
	foundry: { label: "Foundry", colorScheme: "light" },
	"foundry-dark": { label: "Foundry dark", colorScheme: "dark" },
} as const;

export type ThemeName = keyof typeof themes;
export const defaultTheme: ThemeName = "foundry";
export const themeNames = Object.keys(themes) as ThemeName[];

/** Applies a theme to an element (default: the document root). */
export function applyTheme(theme: ThemeName, el: HTMLElement = document.documentElement) {
	el.setAttribute("data-theme", theme);
	el.style.colorScheme = themes[theme].colorScheme;
}
