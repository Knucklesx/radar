import { ArrowRight, Package } from "lucide-react";
import Link from "next/link";

import { APP_CONFIG } from "@/config/app";
import { messages } from "@/config/messages";
import { formatPrice } from "@/lib/utils/format-price";

import type { MonitoredProduct } from "../types";

type Props = {
	product: MonitoredProduct;
	listingCount: number;
};

export function ProductCard({ product, listingCount }: Props) {
	const details = [product.brand, product.model, product.variant, product.color]
		.filter(Boolean)
		.join(" · ");

	return (
		<Link
			href={APP_CONFIG.routes.productDetails(product.id)}
			className="radar-card group flex h-full flex-col p-5 transition-all hover:border-[var(--accent)] hover:shadow-md"
		>
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<h3 className="radar-heading text-lg font-bold">{product.name}</h3>

					<p className="radar-muted mt-2 text-sm">{details}</p>
				</div>

				<Package size={22} className="shrink-0 text-[var(--text-muted)]" />
			</div>

			<div className="mt-6 border-t border-[var(--border)] pt-4">
				<p className="radar-caption text-xs">{messages.products.targetPrice}</p>

				<p className="radar-heading mt-1 text-xl font-bold">
					{formatPrice(
						product.target_price === null ? null : Number(product.target_price),
					)}
				</p>

				<p className="radar-caption mt-3 text-xs">
					{messages.products.linkedListings}: {listingCount}
				</p>
			</div>

			<div className="mt-auto flex items-center justify-between gap-2 pt-6 text-sm font-semibold text-[var(--accent)]">
				<span>{messages.products.viewDetails}</span>
				<ArrowRight
					size={17}
					className="transition-transform group-hover:translate-x-1"
				/>
			</div>
		</Link>
	);
}
