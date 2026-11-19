import { AuthForm } from "@/features/auth/components/auth-form";

export default function SignupPage() {
	return (
		<main className="radar-page flex items-center justify-center px-5 py-12">
			<div className="w-full max-w-md">
				<AuthForm mode="signup" />
			</div>
		</main>
	);
}
