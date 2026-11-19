import { TrendingDown, TrendingUp } from "lucide-react";

import { messages } from "@/config/messages";
import { formatPrice } from "@/lib/utils/format-price";

type Props = {
	price: number;
	targetPrice: number | null;
};

export function PriceDifference({ price, targetPrice }: Props) {
	const t = messages.priceHistory;

	if (
		targetPrice === null ||
		!Number.isFinite(targetPrice) ||
		targetPrice <= 0
	) {
		return <p className="radar-caption text-sm">{t.missingTarget}</p>;
	}

	const difference = price - targetPrice;

	if (Math.abs(difference) < 0.005) {
		return <p className="radar-muted text-sm">{t.onTarget}</p>;
	}

	const above = difference > 0;
	const Icon = above ? TrendingUp : TrendingDown;

	return (
		<div className="flex items-center gap-2">
			<Icon
				size={16}
				className={
					above
						? "text-[var(--text-muted)]"
						: "text-emerald-600 dark:text-emerald-400"
				}
			/>

			<p className="radar-muted text-sm">
				{formatPrice(Math.abs(difference))}{" "}
				{above ? t.aboveTarget : t.belowTarget}
			</p>
		</div>
	);
}
