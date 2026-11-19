import { APP_CONFIG } from "@/config/app";
import { messages } from "@/config/messages";
import { signOut } from "@/features/auth/server/actions";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function DashboardContent() {
	const supabase = await createClient();

	const { data, error } = await supabase.auth.getClaims();

	if (error || !data?.claims?.sub) {
		redirect(APP_CONFIG.routes.login);
	}

	const email =
		typeof data.claims.email === "string" ? data.claims.email : null;

	return (
		<main className="min-h-screen bg-slate-50">
			<header className="border-b border-slate-200 bg-white">
				<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
					<Link
						href={APP_CONFIG.routes.home}
						className="text-xl font-bold text-slate-900"
					>
						{APP_CONFIG.name}
					</Link>

					<form action={signOut}>
						<button
							type="submit"
							className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700"
						>
							{messages.navigation.logout}
						</button>
					</form>
				</div>
			</header>

			<div className="mx-auto max-w-6xl space-y-8 px-6 py-10">
				<div>
					{email && <p className="text-sm text-slate-500">{email}</p>}

					<h1 className="mt-2 text-3xl font-bold text-slate-900">
						{messages.dashboard.title}
					</h1>

					<p className="mt-2 text-slate-600">{messages.dashboard.subtitle}</p>
				</div>

				<section className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
					<h2 className="text-lg font-semibold text-slate-900">
						{messages.dashboard.welcome}
					</h2>

					<p className="mt-3 text-slate-600">{messages.dashboard.empty}</p>

					<p className="mt-2 text-sm text-slate-500">
						{messages.dashboard.nextStep}
					</p>
				</section>
			</div>
		</main>
	);
}

export default function DashboardPage() {
	return (
		<Suspense
			fallback={
				<main className="min-h-screen bg-slate-50">
					<div className="mx-auto max-w-6xl px-6 py-10">
						<div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
						<div className="mt-4 h-5 w-80 max-w-full animate-pulse rounded bg-slate-200" />
						<div className="mt-8 h-48 animate-pulse rounded-xl bg-slate-200" />
					</div>
				</main>
			}
		>
			<DashboardContent />
		</Suspense>
	);
}
