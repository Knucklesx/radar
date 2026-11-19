import { AuthForm } from "@/features/auth/components/auth-form";

export default function LoginPage() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
			<div className="w-full max-w-md">
				<AuthForm mode="login" />
			</div>
		</main>
	);
}
