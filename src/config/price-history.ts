export const PRICE_HISTORY_CONFIG = {
	timeZone: "America/Sao_Paulo",
	observationLimit: 500,
	currency: "BRL",

	statuses: {
		pending: "pending",
		verified: "verified",
		rejected: "rejected",
	},
} as const;
