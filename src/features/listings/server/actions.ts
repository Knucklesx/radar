"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { APP_CONFIG } from "@/config/app";
import { messages } from "@/config/messages";
import { normalizeListingUrl } from "@/features/listings/normalize-listing-url";
import { createClient } from "@/lib/supabase/server";

export type AddListingState = {
	error: string | null;
	success: string | null;
};

const schema = z.object({
	productId: z.uuid(),
	listingUrl: z.string().trim().min(1).max(2000),
});

export async function addProductListing(
	_previous: AddListingState,
	formData: FormData,
): Promise<AddListingState> {
	const t = messages.listings;

	const parsed = schema.safeParse({
		productId: formData.get("product_id"),
		listingUrl: formData.get("listing_url"),
	});

	if (!parsed.success) {
		return {
			error: t.invalidUrl,
			success: null,
		};
	}

	const listing = normalizeListingUrl(parsed.data.listingUrl);

	if (!listing) {
		return {
			error: t.invalidUrl,
			success: null,
		};
	}

	const supabase = await createClient();

	const { data: auth, error: authError } = await supabase.auth.getClaims();

	if (authError || !auth?.claims?.sub) {
		return {
			error: messages.errors.unauthorized,
			success: null,
		};
	}

	const userId = auth.claims.sub;

	// Confirma que o produto pertence ao usuário.
	const { data: product, error: productError } = await supabase
		.from("monitored_products")
		.select("id")
		.eq("id", parsed.data.productId)
		.eq("user_id", userId)
		.maybeSingle();

	if (productError || !product) {
		return {
			error: t.invalidProduct,
			success: null,
		};
	}

	const { error } = await supabase.from("product_listings").insert({
		user_id: userId,
		product_id: product.id,
		store_id: listing.storeId,
		listing_url: listing.url,
		external_id: listing.externalId,
	});

	if (error) {
		if (error.code === "23505") {
			return {
				error: t.duplicate,
				success: null,
			};
		}

		console.error("Erro ao vincular anúncio:", error.code);

		return {
			error: t.createError,
			success: null,
		};
	}

	revalidatePath(APP_CONFIG.routes.productDetails(product.id));

	return {
		error: null,
		success: t.success,
	};
}
