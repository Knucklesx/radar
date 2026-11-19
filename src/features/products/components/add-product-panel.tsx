import { ChevronDown, PlusCircle } from "lucide-react";

import { messages } from "@/config/messages";

import { CreateProductForm } from "./create-product-form";

export function AddProductPanel() {
	return (
		<details className="radar-card group overflow-hidden">
			<summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 marker:hidden [&::-webkit-details-marker]:hidden">
				<div className="flex items-center gap-3">
					<PlusCircle size={21} className="text-[var(--accent)]" />

					<div>
						<h2 className="radar-heading font-semibold">
							{messages.products.add}
						</h2>

						<p className="radar-muted mt-1 text-sm">
							{messages.products.addDescription}
						</p>
					</div>
				</div>

				<ChevronDown
					size={20}
					className="shrink-0 text-[var(--text-muted)] transition-transform group-open:rotate-180"
				/>
			</summary>

			<div className="border-t border-[var(--border)] p-4 sm:p-6">
				<CreateProductForm />
			</div>
		</details>
	);
}
