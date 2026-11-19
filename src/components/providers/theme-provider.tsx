"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

import { THEME_CONFIG } from "@/config/theme";

type Props = {
	children: ReactNode;
};

export function ThemeProvider({ children }: Props) {
	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme={THEME_CONFIG.defaultTheme}
			enableSystem={THEME_CONFIG.enableSystem}
			storageKey={THEME_CONFIG.storageKey}
			disableTransitionOnChange
		>
			{children}
		</NextThemesProvider>
	);
}
