export const MONITORING_CONFIG = {
	currency: "BRL",

	productCondition: "new",

	shopping: {
		provider: "serpapi",
		country: "br",
		language: "pt",
		googleDomain: "google.com.br",
	},

	quota: {
		monthlyReservationLimit: 200,
	},

	cache: {
		ttlHours: 6,
	},

	automation: {
		enabled: false,
	},

	alerts: {
		enabled: false,
	},
} as const;
