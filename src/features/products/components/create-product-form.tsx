"use client";

import { useActionState, useEffect, useRef } from "react";

import {
	createProduct,
	type CreateProductState,
} from "@/features/products/server/actions";

import { messages } from "@/config/messages";

const initialState: CreateProductState = {
	error: null,
	success: null,
};

const fields = [
	{
		name: "brand",
		label: messages.products.brand,
		required: true,
		minLength: 2,
		maxLength: 60,
	},
	{
		name: "model",
		label: messages.products.model,
		required: true,
		minLength: 2,
		maxLength: 120,
	},
	{
		name: "variant",
		label: messages.products.variant,
		required: false,
		minLength: undefined,
		maxLength: 100,
	},
	{
		name: "color",
		label: messages.products.color,
		required: false,
		minLength: undefined,
		maxLength: 60,
	},
] as const;

export function CreateProductForm() {
	const formRef = useRef<HTMLFormElement>(null);

	const [state, action, pending] = useActionState(createProduct, initialState);

	const t = messages.products;

	useEffect(() => {
		if (state.success) {
			formRef.current?.reset();
		}
	}, [state.success]);

	return (
		<form ref={formRef} action={action} className="radar-card space-y-5 p-6">
			<div>
				<h2 className="radar-heading text-lg font-semibold">{t.add}</h2>
			</div>

			{/* Nome do produto */}
			<div>
				<label htmlFor="product-name" className="radar-label">
					{t.name}
				</label>

				<input
					id="product-name"
					name="name"
					type="text"
					required
					minLength={3}
					maxLength={120}
					disabled={pending}
					className="radar-input"
				/>
			</div>

			{/* Características */}
			<div className="grid gap-4 sm:grid-cols-2">
				{fields.map((field) => (
					<div key={field.name}>
						<label htmlFor={`product-${field.name}`} className="radar-label">
							{field.label}
						</label>

						<input
							id={`product-${field.name}`}
							name={field.name}
							type="text"
							required={field.required}
							minLength={field.minLength}
							maxLength={field.maxLength}
							disabled={pending}
							className="radar-input"
						/>
					</div>
				))}
			</div>

			{/* Preço-alvo */}
			<div>
				<label htmlFor="product-target-price" className="radar-label">
					{t.targetPrice} ({t.optional})
				</label>

				<input
					id="product-target-price"
					name="target_price"
					type="number"
					min="0.01"
					max="9999999999.99"
					step="0.01"
					placeholder="5000.00"
					disabled={pending}
					className="radar-input"
				/>
			</div>

			{/* Feedback */}
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

			{/* Enviar */}
			<button type="submit" disabled={pending} className="radar-button-primary">
				{pending ? t.creating : t.create}
			</button>
		</form>
	);
}
