import { CircleUserRound, Radar } from "lucide-react";
import Link from "next/link";

import { APP_CONFIG } from "@/config/app";
import { messages } from "@/config/messages";
import { signOut } from "@/features/auth/server/actions";

import { ThemeToggle } from "./theme-toggle";

type Props = {
	email: string | null;
};

export function DashboardHeader({ email }: Props) {
	return (
		<header className="radar-header">
			<div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
				<Link
					href={APP_CONFIG.routes.dashboard}
					className="flex items-center gap-2"
				>
					<Radar size={26} className="text-[var(--accent)]" />
					<span className="radar-heading text-xl font-bold">
						{APP_CONFIG.name}
					</span>
				</Link>

				<div className="flex items-center gap-3">
					<ThemeToggle />

					<details className="group relative">
						<summary
							aria-label={messages.account.label}
							className="radar-button-secondary flex cursor-pointer list-none items-center gap-2"
						>
							<CircleUserRound size={20} />
							<span className="hidden text-sm sm:inline">
								{messages.account.label}
							</span>
						</summary>

						<div className="radar-card absolute right-0 z-20 mt-2 w-64 p-4 shadow-lg">
							{email && (
								<p className="radar-muted mb-4 break-all text-sm">{email}</p>
							)}

							<form action={signOut}>
								<button
									type="submit"
									className="radar-button-secondary w-full text-sm"
								>
									{messages.navigation.logout}
								</button>
							</form>
						</div>
					</details>
				</div>
			</div>
		</header>
	);
}
