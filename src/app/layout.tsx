import { ThemeProvider } from "@/components/providers/theme-provider";
import { APP_CONFIG } from "@/config/app";
import { messages } from "@/config/messages";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata = {
	title: `${APP_CONFIG.name} — ${APP_CONFIG.description}`,
	description: messages.home.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html lang="pt-BR" suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}
