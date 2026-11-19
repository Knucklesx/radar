import { ExternalLink, Store } from "lucide-react";

import { messages } from "@/config/messages";
import { STORES } from "@/config/stores";

export type ProductListing = {
	id: string;
	store_id: string;
	listing_url: string;
	external_id: string | null;
};

type Props = {
	listings: ProductListing[];
	error?: boolean;
};

function getStoreName(storeId: string) {
	return (
		Object.values(STORES).find((store) => store.id === storeId)?.name ?? storeId
	);
}

export function ProductListings({ listings, error = false }: Props) {
	const t = messages.listings;

	return (
		<section className="space-y-4">
			<h2 className="radar-heading text-xl font-semibold">{t.title}</h2>

			{error ? (
				<p role="alert" className="radar-error">
					{messages.products.listingsError}
				</p>
			) : listings.length === 0 ? (
				<div className="radar-card border-dashed p-8 text-center">
					<Store size={28} className="mx-auto text-[var(--text-muted)]" />

					<p className="radar-muted mt-3 text-sm">
						{messages.products.noListingsDescription}
					</p>
				</div>
			) : (
				<div className="grid gap-4 sm:grid-cols-2">
					{listings.map((listing) => (
						<article
							key={listing.id}
							className="radar-card flex flex-col gap-3 p-5"
						>
							<div className="flex items-center gap-2">
								<Store size={18} className="text-[var(--accent)]" />

								<h3 className="radar-heading font-semibold">
									{getStoreName(listing.store_id)}
								</h3>
							</div>

							{listing.external_id && (
								<p className="radar-caption break-all text-xs">
									{t.externalId}: {listing.external_id}
								</p>
							)}

							<p className="radar-caption text-xs">{t.pendingCollection}</p>

							<a
								href={listing.listing_url}
								target="_blank"
								rel="noopener noreferrer"
								className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-medium text-[var(--accent)] hover:underline"
							>
								{t.viewStore}
								<ExternalLink size={15} />
							</a>
						</article>
					))}
				</div>
			)}
		</section>
	);
}
