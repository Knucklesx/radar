export const ptBR = {
	common: {
		loading: "Carregando...",
		save: "Salvar",
		cancel: "Cancelar",
		back: "Voltar",
		delete: "Excluir",
		edit: "Editar",
		search: "Pesquisar",
		tryAgain: "Tentar novamente",
		comingSoon: "Em breve",
	},

	navigation: {
		home: "Início",
		dashboard: "Meu Radar",
		login: "Entrar",
		logout: "Sair",
	},

	home: {
		eyebrow: "MONITORAMENTO INTELIGENTE DE PREÇOS",
		title: "Não compre no escuro.",
		description:
			"Acompanhe os produtos que você deseja, compare ofertas e descubra quando realmente vale a pena comprar.",
		primaryAction: "Começar gratuitamente",
		actionUnavailable: "Cadastro disponível em breve",
		freeNotice: "Gratuito durante o MVP.",
		featuresTitle: "O que você poderá fazer",
		featuresDescription: "Seu acompanhamento de preços em um só lugar.",
		features: {
			comparison: {
				title: "Compare ofertas",
				description:
					"Encontre ofertas dos produtos que você deseja acompanhar.",
			},
			history: {
				title: "Histórico de preços",
				description: "Visualize como os preços evoluíram ao longo do tempo.",
			},
			alerts: {
				title: "Alertas inteligentes",
				description: "Saiba quando uma oferta atingir seu preço-alvo.",
			},
		},
		trustNotice:
			"Priorizamos produtos novos e lojas selecionadas. Ofertas não verificadas serão identificadas claramente.",
	},

	products: {
		title: "Meus produtos",
		add: "Adicionar produto",
		name: "Nome do produto",
		brand: "Marca",
		model: "Modelo",
		color: "Cor",
		targetPrice: "Preço-alvo",
		condition: "Condição",
		newCondition: "Somente novo",
		empty: "Você ainda não acompanha nenhum produto.",
	},

	listings: {
		title: "Anúncios acompanhados",
		add: "Adicionar anúncio",
		store: "Loja",
		url: "Link do anúncio",
		empty: "Nenhum anúncio vinculado.",
	},

	prices: {
		history: "Histórico de preços",
		comparison: "Comparar preços",
		lowestPrice: "Menor preço encontrado",
		noHistory: "Ainda não temos preços registrados.",
		stale: "Esta pesquisa está desatualizada.",
		unverified: "Oferta ainda não verificada",
	},

	errors: {
		generic: "Não foi possível concluir a operação.",
		unauthorized: "Sua sessão expirou. Entre novamente.",
		invalidProduct: "Confira os dados do produto.",
		invalidUrl: "Informe um link válido.",
		duplicateListing: "Você já acompanha este anúncio.",
	},
} as const;
