import { DashboardHeader } from "@/components/layout/dashboard-header";

import { APP_CONFIG } from "@/config/app";
import { messages } from "@/config/messages";
import { STORES } from "@/config/stores";

import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils/format-price";

import type { MonitoredProduct } from "@/features/products/types";

import { ArrowLeft, ExternalLink, Store } from "lucide-react";

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

type Props = {
	params: Promise<{ id: string }>;
};

function storeName(storeId: string) {
	const store = Object.values(STORES).find((item) => item.id === storeId);

	return store?.name ?? storeId;
}

async function ProductContent({ params }: Props) {
	await connection();

	const { id } = await params;

	const supabase = await createClient();

	const { data: auth, error: authError } = await supabase.auth.getClaims();

	if (authError || !auth?.claims?.sub) {
		redirect(APP_CONFIG.routes.login);
	}

	const userId = auth.claims.sub;

	const { data, error: productError } = await supabase
		.from("monitored_products")
		.select("id, name, brand, model, variant, color, target_price")
		.eq("id", id)
		.eq("user_id", userId)
		.maybeSingle();

	if (productError || !data) {
		notFound();
	}

	const product: MonitoredProduct = {
		...data,
		target_price: data.target_price === null ? null : Number(data.target_price),
	};

	const { data: listings, error: listingsError } = await supabase
		.from("product_listings")
		.select("id, store_id, listing_url, external_id")
		.eq("product_id", product.id)
		.eq("user_id", userId)
		.order("created_at", {
			ascending: true,
		});

	const email =
		typeof auth.claims.email === "string" ? auth.claims.email : null;

	return (
		<main className="radar-page">
			<DashboardHeader email={email} />

			<div className="mx-auto max-w-6xl space-y-8 px-6 py-10">
				<section>
					<Link
						href={APP_CONFIG.routes.dashboard}
						className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline"
					>
						<ArrowLeft size={16} />
						{messages.products.backToDashboard}
					</Link>

					<h1 className="radar-heading mt-6 text-3xl font-bold">
						{product.name}
					</h1>

					<p className="radar-muted mt-2">
						{messages.products.detailsDescription}
					</p>
				</section>

				<section className="grid gap-4 sm:grid-cols-2">
					<div className="radar-card p-6">
						<p className="radar-caption text-sm">
							{messages.products.targetPrice}
						</p>

						<p className="radar-heading mt-2 text-3xl font-bold">
							{formatPrice(product.target_price)}
						</p>
					</div>

					<div className="radar-card p-6">
						<p className="radar-caption text-sm">
							{messages.products.linkedListings}
						</p>

						<p className="radar-heading mt-2 text-3xl font-bold">
							{listingsError ? "—" : (listings?.length ?? 0)}
						</p>
					</div>
				</section>

				<section className="radar-card p-6">
					<h2 className="radar-heading text-lg font-semibold">
						{messages.products.details}
					</h2>

					<dl className="mt-5 grid gap-5 sm:grid-cols-2">
						{[
							{
								label: messages.products.brand,
								value: product.brand,
							},
							{
								label: messages.products.model,
								value: product.model,
							},
							{
								label: messages.products.variant,
								value: product.variant,
							},
							{
								label: messages.products.color,
								value: product.color,
							},
						].map((item) => (
							<div key={item.label}>
								<dt className="radar-caption text-sm">{item.label}</dt>

								<dd className="radar-heading mt-1 font-medium">
									{item.value || "—"}
								</dd>
							</div>
						))}
					</dl>
				</section>

				<section className="space-y-4">
					<h2 className="radar-heading text-xl font-semibold">
						{messages.listings.title}
					</h2>

					{listingsError ? (
						<p role="alert" className="radar-error">
							{messages.products.listingsError}
						</p>
					) : !listings?.length ? (
						<div className="radar-card border-dashed p-8 text-center">
							<Store size={28} className="mx-auto text-[var(--text-muted)]" />

							<p className="radar-muted mt-3 text-sm">
								{messages.products.noListingsDescription}
							</p>
						</div>
					) : (
						<div className="grid gap-4 sm:grid-cols-2">
							{listings.map((listing) => (
								<article key={listing.id} className="radar-card p-5">
									<h3 className="radar-heading font-semibold">
										{storeName(listing.store_id)}
									</h3>

									{listing.external_id && (
										<p className="radar-caption mt-2 text-xs">
											{listing.external_id}
										</p>
									)}

									<a
										href={listing.listing_url}
										target="_blank"
										rel="noopener noreferrer"
										className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline"
									>
										{messages.listings.url}
										<ExternalLink size={15} />
									</a>
								</article>
							))}
						</div>
					)}
				</section>
			</div>
		</main>
	);
}

export default function ProductPage({ params }: Props) {
	return (
		<Suspense
			fallback={
				<main className="radar-page px-6 py-10">
					<div className="mx-auto max-w-6xl">
						<div className="radar-card h-48 animate-pulse" />
					</div>
				</main>
			}
		>
			<ProductContent params={params} />
		</Suspense>
	);
}
