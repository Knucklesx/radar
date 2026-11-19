const args = process.argv.slice(2);

const live = args.includes("--live");

const asin = args.find((arg) => !arg.startsWith("--"))?.toUpperCase();

if (!asin || !/^[A-Z0-9]{10}$/.test(asin)) {
	console.error("Informe um ASIN válido.");
	process.exit(1);
}

console.log("RADAR — Teste de preço Amazon");
console.log("ASIN:", asin);
console.log("Modo:", live ? "Consulta real" : "Sem consulta");

if (!live) {
	console.log("Nenhuma API foi consultada. Use --live para uma consulta.");
	process.exit(0);
}

const apiKey = process.env.SERPAPI_API_KEY ?? process.env.SERPAPI_KEY;

if (!apiKey) {
	console.error("Chave da SerpApi não configurada.");
	process.exit(1);
}

const params = new URLSearchParams({
	engine: "amazon_product",
	amazon_domain: "amazon.com.br",
	asin,
	api_key: apiKey,
	output: "json",
});

try {
	const response = await fetch(`https://serpapi.com/search.json?${params}`, {
		signal: AbortSignal.timeout(15000),
	});

	console.log("HTTP status:", response.status);

	if (!response.ok) {
		console.error("Consulta não concluída.");
		process.exitCode = 1;
	} else {
		const payload = await response.json();
		const product = payload.product_results;

		if (payload.error || !product) {
			console.error("A API não retornou dados de produto utilizáveis.");
			process.exitCode = 1;
		} else {
			console.log({
				asinSolicitado: asin,
				asinRetornado: product.asin ?? null,
				titulo: product.title ?? null,
				preco: product.extracted_price ?? null,
				precoMaximo: product.extracted_max_price ?? null,
				precoFormatado: product.price ?? null,
				condicao: product.condition ?? null,
				disponibilidade: product.availability ?? null,
			});
		}
	}
} catch (error) {
	console.error(
		"Falha na consulta:",
		error instanceof Error ? error.message : "Erro desconhecido",
	);
	process.exitCode = 1;
}

console.log("Nenhum dado foi gravado no Supabase.");
