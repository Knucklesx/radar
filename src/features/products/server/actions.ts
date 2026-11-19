"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { APP_CONFIG } from "@/config/app";
import { messages } from "@/config/messages";
import { createClient } from "@/lib/supabase/server";

export type CreateProductState = {
	error: string | null;
	success: string | null;
};

const t = messages.products;

const productSchema = z.object({
	name: z.string().trim().min(3).max(120),
	brand: z.string().trim().min(2).max(60),
	model: z.string().trim().min(2).max(120),
	variant: z.string().trim().max(100),
	color: z.string().trim().max(60),
	targetPrice: z
		.string()
		.trim()
		.refine(
			(value) =>
				value === "" ||
				(/^\d+(\.\d{1,2})?$/.test(value) &&
					Number(value) > 0 &&
					Number(value) <= 9999999999.99),
		),
});

export async function createProduct(
	_previous: CreateProductState,
	formData: FormData,
): Promise<CreateProductState> {
	const parsed = productSchema.safeParse({
		name: formData.get("name"),
		brand: formData.get("brand"),
		model: formData.get("model"),
		variant: formData.get("variant"),
		color: formData.get("color"),
		targetPrice: formData.get("target_price"),
	});

	if (!parsed.success) {
		const field = parsed.error.issues[0]?.path[0];

		const errors: Record<string, string> = {
			name: t.validation.name,
			brand: t.validation.brand,
			model: t.validation.model,
			variant: t.validation.variant,
			color: t.validation.color,
			targetPrice: t.invalidPrice,
		};

		return {
			error: errors[String(field)] ?? t.createError,
			success: null,
		};
	}

	const supabase = await createClient();

	const { data: auth, error: authError } = await supabase.auth.getClaims();

	if (authError || !auth?.claims?.sub) {
		return {
			error: messages.errors.unauthorized,
			success: null,
		};
	}

	const product = parsed.data;

	const { error } = await supabase.from("monitored_products").insert({
		user_id: auth.claims.sub,
		name: product.name,
		brand: product.brand,
		model: product.model,
		variant: product.variant || null,
		color: product.color || null,
		condition: "new",
		target_price: product.targetPrice ? Number(product.targetPrice) : null,
	});

	if (error) {
		console.error("Create product:", error.code);

		return {
			error: t.createError,
			success: null,
		};
	}

	revalidatePath(APP_CONFIG.routes.dashboard);

	return {
		error: null,
		success: t.createSuccess,
	};
}
