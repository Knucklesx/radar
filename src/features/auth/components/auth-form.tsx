"use client";

import { APP_CONFIG } from "@/config/app";
import { messages } from "@/config/messages";
import { authenticate, type AuthState } from "@/features/auth/server/actions";
import Link from "next/link";
import { useActionState } from "react";

const initialAuthState: AuthState = {
	error: null,
	success: null,
};

type Props = {
	mode: "login" | "signup";
};

export function AuthForm({ mode }: Props) {
	const [state, action, pending] = useActionState(
		authenticate,
		initialAuthState,
	);

	const isSignup = mode === "signup";

	const t = messages.auth;

	return (
		<form
			action={action}
			className="space-y-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
		>
			<input type="hidden" name="mode" value={mode} />

			<div>
				<h1 className="text-2xl font-bold text-slate-900">
					{isSignup ? t.signupTitle : t.loginTitle}
				</h1>

				<p className="mt-2 text-sm text-slate-500">
					{isSignup ? t.signupDescription : t.loginDescription}
				</p>
			</div>

			<div>
				<label
					htmlFor="email"
					className="mb-2 block text-sm font-medium text-slate-700"
				>
					{t.email}
				</label>

				<input
					id="email"
					name="email"
					type="email"
					autoComplete="email"
					required
					maxLength={254}
					disabled={pending}
					className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
				/>
			</div>

			<div>
				<label
					htmlFor="password"
					className="mb-2 block text-sm font-medium text-slate-700"
				>
					{t.password}
				</label>

				<input
					id="password"
					name="password"
					type="password"
					autoComplete={isSignup ? "new-password" : "current-password"}
					required
					minLength={8}
					disabled={pending}
					className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
				/>
			</div>

			{state.error && (
				<p
					role="alert"
					className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
				>
					{state.error}
				</p>
			)}

			{state.success && (
				<p
					role="status"
					className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
				>
					{state.success}
				</p>
			)}

			<button
				type="submit"
				disabled={pending}
				className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
			>
				{pending ? t.submitting : isSignup ? t.signupAction : t.loginAction}
			</button>

			<p className="text-center text-sm text-slate-600">
				{isSignup ? t.hasAccount : t.noAccount}{" "}
				<Link
					href={isSignup ? APP_CONFIG.routes.login : "/cadastro"}
					className="font-semibold text-blue-600 hover:underline"
				>
					{isSignup ? t.signIn : t.createAccount}
				</Link>
			</p>
		</form>
	);
}
