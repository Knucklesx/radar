import { messages } from "@/config/messages";

import type { MonitoredProduct } from "../types";
import { ProductCard } from "./product-card";

type Props = {
	products: MonitoredProduct[];
};

export function ProductGrid({ products }: Props) {
	return (
		<section className="space-y-4">
			<h2 className="radar-heading text-xl font-bold">
				{messages.products.title}
			</h2>

			{products.length === 0 ? (
				<div className="radar-card border-dashed p-8 text-center">
					<p className="radar-muted text-sm">{messages.products.empty}</p>
				</div>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			)}
		</section>
	);
}
