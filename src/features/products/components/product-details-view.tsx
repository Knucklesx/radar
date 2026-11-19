import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { APP_CONFIG } from "@/config/app";
import { messages } from "@/config/messages";

import { AddListingForm } from "@/features/listings/components/add-listing-form";

import {
	ProductListings,
	type ProductListing,
} from "@/features/listings/components/product-listings";

import { ObservedPricesPanel } from "@/features/price-history/components/observed-prices-panel";

import { formatPrice } from "@/lib/utils/format-price";
import type { MonitoredProduct } from "../types";

type Props = {
	userId: string;
	email: string | null;
	product: MonitoredProduct;
	listings: ProductListing[];
	listingsError: boolean;
};

export function ProductDetailsView({
	userId,
	email,
	product,
	listings,
	listingsError,
}: Props) {
	const t = messages.products;

	const attributes = [
		{ label: t.brand, value: product.brand },
		{ label: t.model, value: product.model },
		{ label: t.variant, value: product.variant },
		{ label: t.color, value: product.color },
	];

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
						{t.backToDashboard}
					</Link>

					<h1 className="radar-heading mt-6 text-3xl font-bold">
						{product.name}
					</h1>

					<p className="radar-muted mt-2">{t.detailsDescription}</p>
				</section>

				<section className="grid gap-4 sm:grid-cols-2">
					<div className="radar-card p-6">
						<p className="radar-caption text-sm">{t.targetPrice}</p>
						<p className="radar-heading mt-2 text-3xl font-bold">
							{formatPrice(product.target_price)}
						</p>
					</div>

					<div className="radar-card p-6">
						<p className="radar-caption text-sm">{t.linkedListings}</p>
						<p className="radar-heading mt-2 text-3xl font-bold">
							{listingsError ? "—" : listings.length}
						</p>
					</div>
				</section>

				<section className="radar-card p-6">
					<h2 className="radar-heading text-lg font-semibold">{t.details}</h2>

					<dl className="mt-5 grid gap-5 sm:grid-cols-2">
						{attributes.map((item) => (
							<div key={item.label}>
								<dt className="radar-caption text-sm">{item.label}</dt>
								<dd className="radar-heading mt-1 font-medium">
									{item.value || "—"}
								</dd>
							</div>
						))}
					</dl>
				</section>

				<AddListingForm productId={product.id} />

				<ProductListings listings={listings} error={listingsError} />

				{!listingsError && (
					<ObservedPricesPanel
						userId={userId}
						listings={listings}
						targetPrice={product.target_price}
					/>
				)}
			</div>
		</main>
	);
}
