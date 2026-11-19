import { APP_CONFIG } from "@/config/app";
import { ProductDetailsView } from "@/features/products/components/product-details-view";
import { getProductDetails } from "@/features/products/server/get-product-details";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

type Props = {
	params: Promise<{ id: string }>;
};

async function ProductContent({ params }: Props) {
	await connection();

	const { id } = await params;
	const result = await getProductDetails(id);

	if (result.status === "unauthorized") {
		redirect(APP_CONFIG.routes.login);
	}

	if (result.status === "not_found") {
		notFound();
	}

	return (
		<ProductDetailsView
			userId={result.userId}
			email={result.email}
			product={result.product}
			listings={result.listings}
			listingsError={result.listingsError}
		/>
	);
}

function ProductSkeleton() {
	return (
		<main className="radar-page px-6 py-10">
			<div className="mx-auto max-w-6xl space-y-6">
				<div className="h-8 w-48 animate-pulse rounded bg-[var(--surface-secondary)]" />
				<div className="radar-card h-40 animate-pulse" />
				<div className="radar-card h-48 animate-pulse" />
			</div>
		</main>
	);
}

export default function ProductPage({ params }: Props) {
	return (
		<Suspense fallback={<ProductSkeleton />}>
			<ProductContent params={params} />
		</Suspense>
	);
}
