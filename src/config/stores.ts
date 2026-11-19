export const STORES = {
	amazon: {
		id: "amazon",
		name: "Amazon",
		domains: ["amazon.com.br"],
		enabled: true,
	},
	mercadolivre: {
		id: "mercadolivre",
		name: "Mercado Livre",
		domains: ["mercadolivre.com.br"],
		enabled: true,
	},
	magalu: {
		id: "magalu",
		name: "Magalu",
		domains: ["magazineluiza.com.br", "magalu.com"],
		enabled: true,
	},
} as const;

export type StoreId = keyof typeof STORES;

export const ENABLED_STORES = Object.values(STORES).filter(
	(store) => store.enabled,
);
