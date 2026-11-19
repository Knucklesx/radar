export type PriceLookupResult =
	| {
			status: "success";
			provider: string;
			externalId: string;
			title: string;
			price: number;
			currency: "BRL";
			collectedAt: string;
			sellerVerified: false;
	  }
	| {
			status: "unverified";
			reason:
				| "missing_price"
				| "invalid_price"
				| "identity_mismatch"
				| "price_range"
				| "condition_not_confirmed";
	  }
	| {
			status: "error";
			reason: "not_configured" | "request_failed" | "invalid_response";
	  };

export type PriceVerificationStatus = "pending" | "verified" | "rejected";

export type PriceObservation = {
	id: string;
	listing_id: string;
	price: number;
	currency: string;
	provider: string;
	verification_status: PriceVerificationStatus;
	collected_at: string;
};

export type PriceListing = {
	id: string;
	store_id: string;
	external_id: string | null;
};
