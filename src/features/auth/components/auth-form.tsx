"use client";

import Link from "next/link";
import { useActionState } from "react";

import { APP_CONFIG } from "@/config/app";
import { messages } from "@/config/messages";

import { authenticate, type AuthState } from "@/features/auth/server/actions";

type Props = {
	mode: "login" | "signup";
};

const initialAuthState: AuthState = {
	error: null,
	success: null,
};

export function AuthForm({ mode }: Props) {
	const [state, action, pending] = useActionState(
		authenticate,
		initialAuthState,
	);

	const isSignup = mode === "signup";
	const t = messages.auth;

	return (
		<form action={action} className="radar-card space-y-5 p-8">
			<input type="hidden" name="mode" value={mode} />

			{/* Título */}
			<div>
				<h1 className="radar-heading text-2xl font-bold">
					{isSignup ? t.signupTitle : t.loginTitle}
				</h1>

				<p className="radar-muted mt-2 text-sm">
					{isSignup ? t.signupDescription : t.loginDescription}
				</p>
			</div>

			{/* E-mail */}
			<div>
				<label htmlFor="auth-email" className="radar-label">
					{t.email}
				</label>

				<input
					id="auth-email"
					name="email"
					type="email"
					autoComplete="email"
					required
					maxLength={254}
					disabled={pending}
					className="radar-input"
				/>
			</div>

			{/* Senha */}
			<div>
				<label htmlFor="auth-password" className="radar-label">
					{t.password}
				</label>

				<input
					id="auth-password"
					name="password"
					type="password"
					autoComplete={isSignup ? "new-password" : "current-password"}
					required
					minLength={8}
					disabled={pending}
					className="radar-input"
				/>
			</div>

			{/* Mensagem de erro */}
			{state.error && (
				<p role="alert" className="radar-error">
					{state.error}
				</p>
			)}

			{/* Mensagem de sucesso */}
			{state.success && (
				<p role="status" className="radar-success">
					{state.success}
				</p>
			)}

			{/* Enviar */}
			<button
				type="submit"
				disabled={pending}
				className="radar-button-primary w-full"
			>
				{pending ? t.submitting : isSignup ? t.signupAction : t.loginAction}
			</button>

			{/* Alternância entre login e cadastro */}
			<p className="radar-muted text-center text-sm">
				{isSignup ? t.hasAccount : t.noAccount}{" "}
				<Link
					href={isSignup ? APP_CONFIG.routes.login : "/cadastro"}
					className="font-semibold text-[var(--accent)] hover:underline"
				>
					{isSignup ? t.signIn : t.createAccount}
				</Link>
			</p>
		</form>
	);
}
