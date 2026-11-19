import "server-only";

import { PRICE_HISTORY_CONFIG } from "@/config/price-history";
import { createClient } from "@/lib/supabase/server";

import type { PriceObservation, PriceVerificationStatus } from "../types";

const statuses = new Set<PriceVerificationStatus>([
	"pending",
	"verified",
	"rejected",
]);

export async function getLatestObservations(
	userId: string,
	listingIds: string[],
): Promise<Map<string, PriceObservation>> {
	const latest = new Map<string, PriceObservation>();

	if (listingIds.length === 0) {
		return latest;
	}

	const supabase = await createClient();

	const { data, error } = await supabase
		.from("listing_price_observations")
		.select(
			"id, listing_id, price, currency, provider, verification_status, collected_at",
		)
		.eq("user_id", userId)
		.in("listing_id", listingIds)
		.order("collected_at", { ascending: false })
		.limit(PRICE_HISTORY_CONFIG.observationLimit);

	if (error) {
		console.error("Erro ao consultar observações:", error.code);

		throw new Error("PRICE_HISTORY_QUERY_FAILED");
	}

	for (const row of data ?? []) {
		if (latest.has(row.listing_id)) {
			continue;
		}

		const price = Number(row.price);

		if (
			!Number.isFinite(price) ||
			price <= 0 ||
			!statuses.has(row.verification_status as PriceVerificationStatus)
		) {
			continue;
		}

		latest.set(row.listing_id, {
			...row,
			price,
			verification_status: row.verification_status as PriceVerificationStatus,
		});
	}

	return latest;
}
