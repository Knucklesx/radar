import { messages } from "@/config/messages";
import { getLatestObservations } from "../server/get-lastest-observations";
import type { PriceListing } from "../types";
import { ObservedPriceCard } from "./observed-price-card";

type Props = {
	userId: string;
	listings: PriceListing[];
	targetPrice: number | null;
};

export async function ObservedPricesPanel({
	userId,
	listings,
	targetPrice,
}: Props) {
	if (listings.length === 0) {
		return null;
	}

	const t = messages.priceHistory;

	let observations;

	try {
		observations = await getLatestObservations(
			userId,
			listings.map((listing) => listing.id),
		);
	} catch {
		return (
			<section className="radar-card p-6">
				<p role="alert" className="radar-error">
					{t.loadError}
				</p>
			</section>
		);
	}

	return (
		<section className="space-y-4">
			<div>
				<h2 className="radar-heading text-xl font-semibold">{t.title}</h2>

				<p className="radar-muted mt-1 text-sm">{t.description}</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				{listings.map((listing) => (
					<ObservedPriceCard
						key={listing.id}
						listing={listing}
						observation={observations.get(listing.id)}
						targetPrice={targetPrice}
					/>
				))}
			</div>

			<p className="radar-caption text-xs">{t.notForAlerts}</p>
		</section>
	);
}
