import { LoginForm } from "@/components/signup";

export default function LoginPage() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10 -mt-20">
			<div className="w-full max-w-sm md:max-w-3xl">
				<LoginForm />
			</div>
		</div>
	);
}
