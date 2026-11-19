import "server-only";

import { createClient } from "@/lib/supabase/server";

import type { ProductListing } from "@/features/listings/components/product-listings";

import type { MonitoredProduct } from "../types";

export type ProductDetailsResult =
	| { status: "unauthorized" }
	| { status: "not_found" }
	| {
			status: "success";
			userId: string;
			email: string | null;
			product: MonitoredProduct;
			listings: ProductListing[];
			listingsError: boolean;
	  };

export async function getProductDetails(
	productId: string,
): Promise<ProductDetailsResult> {
	const supabase = await createClient();

	const { data: auth, error: authError } = await supabase.auth.getClaims();

	if (authError || !auth?.claims?.sub) {
		return { status: "unauthorized" };
	}

	const userId = auth.claims.sub;

	const { data, error: productError } = await supabase
		.from("monitored_products")
		.select("id, name, brand, model, variant, color, target_price")
		.eq("id", productId)
		.eq("user_id", userId)
		.maybeSingle();

	if (productError || !data) {
		return { status: "not_found" };
	}

	const { data: listingsData, error: listingsError } = await supabase
		.from("product_listings")
		.select("id, store_id, listing_url, external_id")
		.eq("product_id", productId)
		.eq("user_id", userId)
		.order("created_at", { ascending: true });

	return {
		status: "success",
		userId,
		email: typeof auth.claims.email === "string" ? auth.claims.email : null,
		product: {
			...data,
			target_price:
				data.target_price === null ? null : Number(data.target_price),
		},
		listings: listingsData ?? [],
		listingsError: Boolean(listingsError),
	};
}
