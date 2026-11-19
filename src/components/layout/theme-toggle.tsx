"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { messages } from "@/config/messages";
import { THEME_CONFIG } from "@/config/theme";

// Permite identificar se estamos no cliente,
// sem chamar setState dentro de useEffect.
const subscribe = () => () => {};

function getClientSnapshot() {
	return true;
}

function getServerSnapshot() {
	return false;
}

function useMounted() {
	return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const mounted = useMounted();

	const t = messages.theme;

	const options = [
		{
			value: THEME_CONFIG.themes.light,
			label: t.light,
			Icon: Sun,
		},
		{
			value: THEME_CONFIG.themes.dark,
			label: t.dark,
			Icon: Moon,
		},
		{
			value: THEME_CONFIG.themes.system,
			label: t.system,
			Icon: Monitor,
		},
	];

	return (
		<div
			role="group"
			aria-label={t.label}
			className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1"
		>
			{options.map(({ value, label, Icon }) => {
				const selected = mounted && theme === value;

				return (
					<button
						key={value}
						type="button"
						disabled={!mounted}
						title={label}
						aria-label={label}
						aria-pressed={selected}
						onClick={() => setTheme(value)}
						className={
							"rounded-md p-2 transition-colors " +
							(selected
								? "bg-[var(--accent)] text-white"
								: "radar-muted hover:bg-[var(--surface-secondary)]")
						}
					>
						<Icon size={17} />
					</button>
				);
			})}
		</div>
	);
}
