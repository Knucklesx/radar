export const APP_CONFIG = {
	name: "Radar",
	description: "Monitoramento inteligente de preços",
	locale: "pt-BR",
	currency: "BRL",
	routes: {
		home: "/",
		login: "/login",
		dashboard: "/dashboard",
		productDetails: (id: string) =>
			`/dashboard/products/${encodeURIComponent(id)}`,
	},
} as const;
