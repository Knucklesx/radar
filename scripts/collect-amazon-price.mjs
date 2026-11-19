import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

import { fetchAmazonProduct } from "./lib/amazon-product-api.mjs";

const args = process.argv.slice(2);
const listingId = args.find((arg) => !arg.startsWith("--"));

const live = args.includes("--live");
const statusMode = args.includes("--status");

const UUID_REGEX =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

if (!UUID_REGEX.test(listingId ?? "")) {
	console.error("Informe o UUID do anúncio.");
	process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseKey =
	process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
	console.error("Credenciais Supabase ausentes.");
	process.exit(1);
}

const db = createClient(supabaseUrl, supabaseKey, {
	auth: {
		persistSession: false,
		autoRefreshToken: false,
	},
});

async function getBudgetStatus() {
	const { data: config, error: configError } = await db
		.from("api_budget_config")
		.select("monthly_limit, enabled")
		.eq("provider", "serpapi")
		.single();

	if (configError) {
		throw new Error("BUDGET_CONFIG_FAILED");
	}

	const period = new Date().toISOString().slice(0, 7) + "-01";

	const { data: usage, error: usageError } = await db
		.from("api_monthly_usage")
		.select("reserved_count")
		.eq("provider", "serpapi")
		.eq("period_start", period)
		.maybeSingle();

	if (usageError) {
		throw new Error("BUDGET_USAGE_FAILED");
	}

	return {
		enabled: config.enabled,
		limit: config.monthly_limit,
		reserved: usage?.reserved_count ?? 0,
	};
}

async function main() {
	const { data: listing, error } = await db
		.from("product_listings")
		.select("id, user_id, store_id, external_id")
		.eq("id", listingId)
		.maybeSingle();

	if (error || !listing) {
		throw new Error("LISTING_NOT_FOUND");
	}

	const asin = String(listing.external_id ?? "").toUpperCase();

	if (listing.store_id !== "amazon" || !/^[A-Z0-9]{10}$/.test(asin)) {
		throw new Error("INVALID_AMAZON_LISTING");
	}

	console.log("RADAR — Coleta protegida");
	console.log("Anúncio:", listing.id);
	console.log("ASIN:", asin);

	const budget = await getBudgetStatus();

	console.table(budget);

	if (statusMode) {
		console.log("Somente consulta do orçamento.");
		return;
	}

	if (!live) {
		console.log("Modo simulação.");
		console.log("Nenhum crédito reservado.");
		console.log("Nenhuma API consultada.");
		return;
	}

	const apiKey = process.env.SERPAPI_API_KEY ?? process.env.SERPAPI_KEY;

	if (!apiKey) {
		throw new Error("SERPAPI_KEY_MISSING");
	}

	// Evita coletar novamente anúncios que
	// já tiveram observações nas últimas 24h.
	const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

	const { data: recent, error: recentError } = await db
		.from("listing_price_observations")
		.select("id")
		.eq("listing_id", listing.id)
		.gte("collected_at", cutoff)
		.limit(1);

	if (recentError) {
		throw new Error("RECENT_LOOKUP_FAILED");
	}

	if (recent?.length) {
		console.log("Coleta recente encontrada. Consulta ignorada.");
		return;
	}

	// Cada tentativa tem seu próprio identificador.
	const requestId = randomUUID();

	const { data: authorized, error: budgetError } = await db.rpc(
		"reserve_api_request",
		{
			p_provider: "serpapi",
			p_request_id: requestId,
		},
	);

	if (budgetError) {
		throw new Error(`BUDGET_RESERVATION_FAILED: ${budgetError.code}`);
	}

	if (authorized !== true) {
		console.log("Consulta bloqueada pelo orçamento.");
		return;
	}

	console.log("Crédito reservado:", requestId);

	// Daqui em diante a tentativa já conta
	// no orçamento, mesmo se a API falhar.
	const observation = await fetchAmazonProduct(asin, apiKey);

	const { error: insertError } = await db
		.from("listing_price_observations")
		.insert({
			user_id: listing.user_id,
			listing_id: listing.id,
			price: observation.price,
			currency: observation.currency,
			provider: observation.provider,
			external_id: observation.asin,
			verification_status: observation.verificationStatus,
		});

	if (insertError) {
		throw new Error(`PRICE_INSERT_FAILED: ${insertError.code}`);
	}

	console.log("Preço observado:", observation.price);
	console.log("Status:", observation.verificationStatus);
	console.log("Registro salvo no Supabase.");
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : "Erro desconhecido");

	process.exitCode = 1;
});
