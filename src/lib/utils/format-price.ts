import { APP_CONFIG } from "@/config/app";

export function formatPrice(value: number | null) {
	if (value === null || !Number.isFinite(value)) {
		return "—";
	}

	return new Intl.NumberFormat(APP_CONFIG.locale, {
		style: "currency",
		currency: APP_CONFIG.currency,
	}).format(value);
}
