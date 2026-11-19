import { DashboardHeader } from "@/components/layout/dashboard-header";
import { APP_CONFIG } from "@/config/app";
import { messages } from "@/config/messages";

import { AddProductPanel } from "@/features/products/components/add-product-panel";
import { ProductGrid } from "@/features/products/components/product-grid";
import type { MonitoredProduct } from "@/features/products/types";

import { createClient } from "@/lib/supabase/server";

import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

async function DashboardContent() {
	await connection();

	const supabase = await createClient();

	const { data: auth, error: authError } = await supabase.auth.getClaims();

	if (authError || !auth?.claims?.sub) {
		redirect(APP_CONFIG.routes.login);
	}

	const userId = auth.claims.sub;

	const email =
		typeof auth.claims.email === "string" ? auth.claims.email : null;

	const { data, error: productsError } = await supabase
		.from("monitored_products")
		.select("id, name, brand, model, variant, color, target_price")
		.eq("user_id", userId)
		.order("created_at", { ascending: false });

	const products: MonitoredProduct[] = (data ?? []).map((product) => ({
		...product,
		target_price:
			product.target_price === null ? null : Number(product.target_price),
	}));

	const listingCounts: Record<string, number> = {};
	let countsError = false;

	if (products.length > 0 && !productsError) {
		const { data: listings, error } = await supabase
			.from("product_listings")
			.select("product_id")
			.eq("user_id", userId)
			.in(
				"product_id",
				products.map((product) => product.id),
			);

		if (error) {
			countsError = true;
		} else {
			for (const listing of listings ?? []) {
				listingCounts[listing.product_id] =
					(listingCounts[listing.product_id] ?? 0) + 1;
			}
		}
	}

	return (
		<main className="radar-page">
			<DashboardHeader email={email} />

			<div className="mx-auto max-w-6xl space-y-8 px-6 py-10">
				<section>
					<h1 className="radar-heading text-3xl font-bold">
						{messages.dashboard.title}
					</h1>

					<p className="radar-muted mt-2">{messages.dashboard.subtitle}</p>
				</section>

				<AddProductPanel />

				{productsError || countsError ? (
					<div role="alert" className="radar-error">
						{messages.errors.generic}
					</div>
				) : (
					<ProductGrid products={products} listingCounts={listingCounts} />
				)}
			</div>
		</main>
	);
}

function DashboardSkeleton() {
	return (
		<main className="radar-page">
			<div className="mx-auto max-w-6xl space-y-6 px-6 py-10">
				<div className="h-8 w-48 animate-pulse rounded bg-[var(--surface-secondary)]" />
				<div className="h-5 w-80 max-w-full animate-pulse rounded bg-[var(--surface-secondary)]" />
				<div className="radar-card h-20 animate-pulse" />
				<div className="radar-card h-48 w-full max-w-sm animate-pulse" />
			</div>
		</main>
	);
}

export default function DashboardPage() {
	return (
		<Suspense fallback={<DashboardSkeleton />}>
			<DashboardContent />
		</Suspense>
	);
}
