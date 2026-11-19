import { AlertCircle, Store } from "lucide-react";

import { messages } from "@/config/messages";
import { PRICE_HISTORY_CONFIG } from "@/config/price-history";
import { STORES } from "@/config/stores";
import { formatPrice } from "@/lib/utils/format-price";

import type {
	PriceListing,
	PriceObservation,
	PriceVerificationStatus,
} from "../types";

import { PriceDifference } from "./price-difference";

type Props = {
	listing: PriceListing;
	observation?: PriceObservation;
	targetPrice: number | null;
};

const statusStyles: Record<PriceVerificationStatus, string> = {
	verified: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
	pending: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
	rejected: "bg-red-500/10 text-red-700 dark:text-red-300",
};

function formatDate(value: string) {
	const date = new Date(value);

	if (!Number.isFinite(date.getTime())) {
		return "—";
	}

	return new Intl.DateTimeFormat("pt-BR", {
		dateStyle: "short",
		timeStyle: "short",
		timeZone: PRICE_HISTORY_CONFIG.timeZone,
	}).format(date);
}

function getStoreName(storeId: string) {
	return (
		Object.values(STORES).find((store) => store.id === storeId)?.name ?? storeId
	);
}

export function ObservedPriceCard({
	listing,
	observation,
	targetPrice,
}: Props) {
	const t = messages.priceHistory;

	const status = observation?.verification_status;

	const statusLabel = status
		? {
				pending: t.pending,
				verified: t.verified,
				rejected: t.rejected,
			}[status]
		: null;

	const validPrice =
		observation !== undefined &&
		observation.currency === PRICE_HISTORY_CONFIG.currency &&
		Number.isFinite(observation.price) &&
		observation.price > 0;

	return (
		<article className="radar-card space-y-4 p-5">
			<div className="flex items-start justify-between gap-3">
				<div className="flex items-center gap-2">
					<Store size={18} className="text-[var(--accent)]" />

					<h3 className="radar-heading font-semibold">
						{getStoreName(listing.store_id)}
					</h3>
				</div>

				{status && (
					<span
						className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
					>
						{statusLabel}
					</span>
				)}
			</div>

			{listing.external_id && (
				<p className="radar-caption break-all text-xs">{listing.external_id}</p>
			)}

			{!validPrice || !observation ? (
				<p className="radar-muted text-sm">{t.noData}</p>
			) : (
				<>
					<div>
						<p className="radar-caption text-xs">{t.observedPrice}</p>

						<p className="radar-heading mt-1 text-3xl font-bold">
							{formatPrice(observation.price)}
						</p>

						{status !== "rejected" && (
							<div className="mt-3">
								<PriceDifference
									price={observation.price}
									targetPrice={targetPrice}
								/>
							</div>
						)}
					</div>

					<div className="space-y-2 border-t border-[var(--border)] pt-4">
						<div className="flex flex-wrap justify-between gap-2">
							<span className="radar-caption text-xs">{t.lastCollection}</span>

							<span className="radar-muted text-xs">
								{formatDate(observation.collected_at)}
							</span>
						</div>

						<div className="flex flex-wrap justify-between gap-2">
							<span className="radar-caption text-xs">{t.source}</span>

							<span className="radar-muted break-all text-xs">
								{observation.provider}
							</span>
						</div>
					</div>

					{status !== "verified" && (
						<div
							className={
								status === "rejected"
									? "rounded-lg border border-red-500/20 bg-red-500/10 p-3"
									: "rounded-lg border border-amber-500/20 bg-amber-500/10 p-3"
							}
						>
							<div className="flex items-start gap-2">
								<AlertCircle
									size={17}
									className="mt-0.5 shrink-0 text-amber-500"
								/>

								<div className="space-y-1">
									<p className="radar-heading text-sm font-semibold">
										{status === "rejected" ? t.rejected : t.pendingTitle}
									</p>

									<p className="radar-muted text-xs leading-relaxed">
										{status === "rejected"
											? t.rejectedDescription
											: t.pendingDescription}
									</p>
								</div>
							</div>
						</div>
					)}
				</>
			)}
		</article>
	);
}
