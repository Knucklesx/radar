"use client";

import { useActionState, useEffect, useRef } from "react";

import { messages } from "@/config/messages";

import {
	addProductListing,
	type AddListingState,
} from "@/features/listings/server/actions";

type Props = {
	productId: string;
};

const initialState: AddListingState = {
	error: null,
	success: null,
};

export function AddListingForm({ productId }: Props) {
	const formRef = useRef<HTMLFormElement>(null);

	const [state, action, pending] = useActionState(
		addProductListing,
		initialState,
	);

	const t = messages.listings;

	useEffect(() => {
		if (state.success) {
			formRef.current?.reset();
		}
	}, [state.success]);

	return (
		<form ref={formRef} action={action} className="radar-card space-y-5 p-6">
			<div>
				<h2 className="radar-heading text-lg font-semibold">{t.add}</h2>

				<p className="radar-muted mt-1 text-sm">{t.description}</p>
			</div>

			<input type="hidden" name="product_id" value={productId} />

			<div>
				<label htmlFor="listing-url" className="radar-label">
					{t.url}
				</label>

				<input
					id="listing-url"
					name="listing_url"
					type="url"
					required
					maxLength={2000}
					disabled={pending}
					placeholder={t.urlPlaceholder}
					className="radar-input"
				/>

				<p className="radar-caption mt-2 text-xs">{t.urlHelp}</p>
			</div>

			{state.error && (
				<p role="alert" className="radar-error">
					{state.error}
				</p>
			)}

			{state.success && (
				<p role="status" className="radar-success">
					{state.success}
				</p>
			)}

			<button type="submit" disabled={pending} className="radar-button-primary">
				{pending ? t.submitting : t.submit}
			</button>
		</form>
	);
}
