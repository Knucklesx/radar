const API_URL = "https://serpapi.com/search.json";

export function parseAmazonPrice(asin, payload) {
	if (payload?.error) {
		throw new Error("SERPAPI_PROVIDER_ERROR");
	}

	const product = payload?.product_results;

	if (!product || String(product.asin ?? "").toUpperCase() !== asin) {
		throw new Error("AMAZON_ASIN_MISMATCH");
	}

	const price = product.extracted_price;

	if (
		typeof price !== "number" ||
		!Number.isFinite(price) ||
		price <= 0 ||
		price > 9999999999.99
	) {
		throw new Error("AMAZON_INVALID_PRICE");
	}

	if (typeof product.price !== "string" || !/R\$\s*/.test(product.price)) {
		throw new Error("AMAZON_CURRENCY_UNCONFIRMED");
	}

	if (!product.title || typeof product.title !== "string") {
		throw new Error("AMAZON_TITLE_MISSING");
	}

	if (
		product.extracted_max_price != null &&
		product.extracted_max_price !== price
	) {
		throw new Error("AMAZON_PRICE_RANGE");
	}

	return {
		asin,
		title: product.title,
		price,
		currency: "BRL",
		provider: "serpapi:amazon_product",
		verificationStatus: "pending",
	};
}

export async function fetchAmazonProduct(asin, apiKey) {
	const params = new URLSearchParams({
		engine: "amazon_product",
		amazon_domain: "amazon.com.br",
		asin,
		api_key: apiKey,
		output: "json",
	});

	const response = await fetch(`${API_URL}?${params.toString()}`, {
		cache: "no-store",
		signal: AbortSignal.timeout(15000),
	});

	if (!response.ok) {
		throw new Error(`SERPAPI_HTTP_${response.status}`);
	}

	return parseAmazonPrice(asin, await response.json());
}
