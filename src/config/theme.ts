export const THEME_CONFIG = {
	defaultTheme: "system",
	storageKey: "radar-theme",
	enableSystem: true,

	themes: {
		light: "light",
		dark: "dark",
		system: "system",
	},
} as const;

export type ThemeMode = keyof typeof THEME_CONFIG.themes;
