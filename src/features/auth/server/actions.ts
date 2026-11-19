"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { APP_CONFIG } from "@/config/app";
import { messages } from "@/config/messages";
import { createClient } from "@/lib/supabase/server";

export type AuthState = {
	error: string | null;
	success: string | null;
};

export async function authenticate(
	_previous: AuthState,
	formData: FormData,
): Promise<AuthState> {
	const mode = String(formData.get("mode") ?? "");
	const email = String(formData.get("email") ?? "")
		.trim()
		.toLowerCase();

	const password = String(formData.get("password") ?? "");

	if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return {
			error: messages.auth.invalidEmail,
			success: null,
		};
	}

	if (password.length < 8) {
		return {
			error: messages.auth.invalidPassword,
			success: null,
		};
	}

	const supabase = await createClient();

	if (mode === "signup") {
		const origin = process.env.APP_URL;

		if (!origin) {
			return {
				error: messages.errors.generic,
				success: null,
			};
		}

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${origin}/auth/callback`,
			},
		});

		if (error) {
			return {
				error: messages.auth.signupError,
				success: null,
			};
		}

		return {
			error: null,
			success: messages.auth.checkEmail,
		};
	}

	if (mode !== "login") {
		return {
			error: messages.errors.generic,
			success: null,
		};
	}

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		return {
			error: messages.auth.invalidCredentials,
			success: null,
		};
	}

	revalidatePath(APP_CONFIG.routes.dashboard);
	redirect(APP_CONFIG.routes.dashboard);
}

export async function signOut() {
	const supabase = await createClient();

	await supabase.auth.signOut();

	revalidatePath(APP_CONFIG.routes.dashboard);
	redirect(APP_CONFIG.routes.home);
}
