import { APP_CONFIG } from "@/config/app";
import { messages } from "@/config/messages";
import {
	Bell,
	ChartNoAxesCombined,
	Radar,
	Search,
	ShieldCheck,
} from "lucide-react";
import Link from "next/link";

const features = [
	{
		icon: Search,
		content: messages.home.features.comparison,
	},
	{
		icon: ChartNoAxesCombined,
		content: messages.home.features.history,
	},
	{
		icon: Bell,
		content: messages.home.features.alerts,
	},
];

export default function HomePage() {
	return (
		<main className="min-h-screen bg-slate-50">
			<section className="bg-[#050b1c] text-white">
				<header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
					<div className="flex items-center gap-2">
						<Radar className="h-7 w-7 text-blue-500" />

						<span className="text-2xl font-bold">{APP_CONFIG.name}</span>
					</div>

					<span className="rounded-full border border-slate-700 px-4 py-2 text-xs text-slate-300">
						{messages.common.comingSoon}
					</span>
				</header>

				<div className="mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
					<p className="text-sm font-semibold tracking-widest text-blue-400">
						{messages.home.eyebrow}
					</p>

					<h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
						{messages.home.title}
					</h1>

					<p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
						{messages.home.description}
					</p>

					<div className="mt-10">
						<Link
							href="/cadastro"
							className="inline-flex rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white hover:bg-blue-700"
						>
							{messages.home.primaryAction}
						</Link>
					</div>

					<p className="mt-4 text-sm text-slate-400">
						{messages.home.freeNotice}
					</p>
				</div>
			</section>

			<section className="mx-auto max-w-6xl px-6 py-20">
				<h2 className="text-3xl font-bold text-slate-900">
					{messages.home.featuresTitle}
				</h2>

				<p className="mt-3 text-slate-600">
					{messages.home.featuresDescription}
				</p>

				<div className="mt-10 grid gap-5 md:grid-cols-3">
					{features.map(({ icon: Icon, content }) => (
						<article
							key={content.title}
							className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
						>
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
								<Icon className="h-6 w-6 text-blue-600" />
							</div>

							<h3 className="mt-5 text-lg font-semibold text-slate-900">
								{content.title}
							</h3>

							<p className="mt-2 text-sm leading-6 text-slate-600">
								{content.description}
							</p>
						</article>
					))}
				</div>

				<div className="mt-10 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-5">
					<ShieldCheck className="h-6 w-6 shrink-0 text-blue-600" />

					<p className="text-sm text-slate-600">{messages.home.trustNotice}</p>
				</div>
			</section>
		</main>
	);
}
