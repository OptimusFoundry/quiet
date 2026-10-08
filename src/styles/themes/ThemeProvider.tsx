import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { applyTheme, defaultTheme, type ThemeName, themes } from "./themes";

const STORAGE_KEY = "quiet-theme";

interface ThemeContextValue {
	theme: ThemeName;
	setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function stored(): ThemeName | null {
	try {
		const t = localStorage.getItem(STORAGE_KEY);
		return t && t in themes ? (t as ThemeName) : null;
	} catch {
		return null;
	}
}

/** App-level theme: applies data-theme to <html> and remembers the choice. */
export function ThemeProvider({
	defaultValue = defaultTheme,
	children,
}: {
	defaultValue?: ThemeName;
	children: ReactNode;
}) {
	const [theme, setThemeState] = useState<ThemeName>(() => stored() ?? defaultValue);
	useEffect(() => applyTheme(theme), [theme]);
	const setTheme = useCallback((next: ThemeName) => {
		setThemeState(next);
		try {
			localStorage.setItem(STORAGE_KEY, next);
		} catch {
			// Storage can be unavailable (private mode); the theme still applies for this session.
		}
	}, []);
	return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
	return ctx;
}
