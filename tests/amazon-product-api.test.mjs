import assert from "node:assert/strict";
import test from "node:test";

import { parseAmazonPrice } from "../scripts/lib/amazon-product-api.mjs";

const asin = "B0GQWF5JD1";

function response(overrides = {}) {
	return {
		product_results: {
			asin,
			title: "Apple iPhone 17 256 GB Azul-névoa",
			extracted_price: 5399.01,
			price: "R$5.399,01",
			...overrides,
		},
	};
}

test("aceita preço BRL do ASIN esperado", () => {
	const result = parseAmazonPrice(asin, response());

	assert.equal(result.price, 5399.01);
	assert.equal(result.currency, "BRL");
	assert.equal(result.verificationStatus, "pending");
});

test("rejeita ASIN diferente", () => {
	assert.throws(
		() => parseAmazonPrice(asin, response({ asin: "B000000001" })),
		/AMAZON_ASIN_MISMATCH/,
	);
});

test("rejeita preço inválido", () => {
	assert.throws(
		() => parseAmazonPrice(asin, response({ extracted_price: -1 })),
		/AMAZON_INVALID_PRICE/,
	);
});

test("rejeita moeda não confirmada", () => {
	assert.throws(
		() => parseAmazonPrice(asin, response({ price: "$999.00" })),
		/AMAZON_CURRENCY_UNCONFIRMED/,
	);
});

test("rejeita preço em faixa", () => {
	assert.throws(
		() => parseAmazonPrice(asin, response({ extracted_max_price: 6000 })),
		/AMAZON_PRICE_RANGE/,
	);
});

test("nunca verifica vendedor automaticamente", () => {
	const result = parseAmazonPrice(asin, response());

	assert.equal(result.verificationStatus, "pending");
});
