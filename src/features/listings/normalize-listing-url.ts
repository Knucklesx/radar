import { STORES, type StoreId } from "@/config/stores";

export type NormalizedListing = {
	storeId: StoreId;
	url: string;
	externalId: string | null;
};

const MAX_URL_LENGTH = 2000;

function belongsToDomain(hostname: string, domain: string) {
	return hostname === domain || hostname.endsWith(`.${domain}`);
}

function identifyStore(hostname: string): StoreId | null {
	for (const store of Object.values(STORES)) {
		if (!store.enabled) continue;

		const matched = store.domains.some((domain) =>
			belongsToDomain(hostname, domain),
		);

		if (matched) {
			return store.id as StoreId;
		}
	}

	return null;
}

function extractAmazonAsin(pathname: string): string | null {
	const match = pathname.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})(?:\/|$)/i);

	return match?.[1]?.toUpperCase() ?? null;
}

export function normalizeListingUrl(raw: string): NormalizedListing | null {
	const input = raw.trim();

	if (!input || input.length > MAX_URL_LENGTH) {
		return null;
	}

	try {
		const url = new URL(input);

		if (url.protocol !== "https:" || url.username || url.password || url.port) {
			return null;
		}

		const storeId = identifyStore(url.hostname.toLowerCase());

		if (!storeId) return null;

		url.hash = "";

		if (storeId === "amazon") {
			const asin = extractAmazonAsin(url.pathname);

			if (asin) {
				return {
					storeId,
					url: `https://www.amazon.com.br/dp/${asin}`,
					externalId: asin,
				};
			}
		}

		// Remove apenas parâmetros conhecidos de rastreamento.
		// Outros parâmetros podem identificar variantes.
		for (const key of [...url.searchParams.keys()]) {
			if (
				key.toLowerCase().startsWith("utm_") ||
				["gclid", "fbclid", "msclkid"].includes(key.toLowerCase())
			) {
				url.searchParams.delete(key);
			}
		}

		const normalized = url.toString();

		if (normalized.length > MAX_URL_LENGTH) {
			return null;
		}

		return {
			storeId,
			url: normalized,
			externalId: null,
		};
	} catch {
		return null;
	}
}
