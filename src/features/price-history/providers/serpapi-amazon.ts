import "server-only";

import type { PriceLookupResult } from "../types";

type SerpApiResponse = {
	error?: string;
	product_results?: {
		asin?: string;
		title?: string;
		extracted_price?: number;
		extracted_max_price?: number;
		availability?: string;
		condition?: string;
	};
};

const PROVIDER = "serpapi:amazon_product";

function isAsin(value: string) {
	return /^[A-Z0-9]{10}$/.test(value);
}

export function parseAmazonResponse(
	expectedAsin: string,
	payload: SerpApiResponse,
): PriceLookupResult {
	const product = payload.product_results;

	if (!product) {
		return {
			status: "error",
			reason: "invalid_response",
		};
	}

	if (!product.asin || product.asin.toUpperCase() !== expectedAsin) {
		return {
			status: "unverified",
			reason: "identity_mismatch",
		};
	}

	if (typeof product.extracted_price !== "number") {
		return {
			status: "unverified",
			reason: "missing_price",
		};
	}

	const price = product.extracted_price;

	if (!Number.isFinite(price) || price <= 0 || price > 9999999999.99) {
		return {
			status: "unverified",
			reason: "invalid_price",
		};
	}

	// Preços em faixa não representam um valor único.
	if (
		product.extracted_max_price !== undefined &&
		product.extracted_max_price !== price
	) {
		return {
			status: "unverified",
			reason: "price_range",
		};
	}

	// Política conservadora:
	// somente uma condição explicitamente nova
	// passa nesta primeira versão.
	if (product.condition?.trim().toLowerCase() !== "new") {
		return {
			status: "unverified",
			reason: "condition_not_confirmed",
		};
	}

	if (!product.title?.trim()) {
		return {
			status: "error",
			reason: "invalid_response",
		};
	}

	return {
		status: "success",
		provider: PROVIDER,
		externalId: expectedAsin,
		title: product.title,
		price,
		currency: "BRL",
		collectedAt: new Date().toISOString(),
		sellerVerified: false,
	};
}

export async function fetchAmazonPrice(
	asin: string,
): Promise<PriceLookupResult> {
	const normalizedAsin = asin.toUpperCase();

	if (!isAsin(normalizedAsin)) {
		return {
			status: "error",
			reason: "invalid_response",
		};
	}

	const apiKey = process.env.SERPAPI_API_KEY;

	if (!apiKey) {
		return {
			status: "error",
			reason: "not_configured",
		};
	}

	const params = new URLSearchParams({
		engine: "amazon_product",
		amazon_domain: "amazon.com.br",
		asin: normalizedAsin,
		api_key: apiKey,
		output: "json",
	});

	try {
		const response = await fetch(`https://serpapi.com/search.json?${params}`, {
			cache: "no-store",
			signal: AbortSignal.timeout(15000),
		});

		if (!response.ok) {
			return {
				status: "error",
				reason: "request_failed",
			};
		}

		const payload = (await response.json()) as SerpApiResponse;

		if (payload.error) {
			return {
				status: "error",
				reason: "request_failed",
			};
		}

		return parseAmazonResponse(normalizedAsin, payload);
	} catch {
		return {
			status: "error",
			reason: "request_failed",
		};
	}
}
