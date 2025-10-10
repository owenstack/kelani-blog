import { useState } from "react";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export function GoogleSignIn({ className }: { className?: string }) {
	const [loading, setLoading] = useState(false);
	const handleSignIn = async () => {
		setLoading(true);
		toast.promise(
			signIn.social({ provider: "google", callbackURL: "/dashboard" }),
			{
				loading: "Signing in with Google...",
				success: (res) => {
					if (res.error) {
						setLoading(false);
						return res.error.message;
					}
					setLoading(false);
					return "Successfully signed in with Google";
				},
				error: (error) => {
					setLoading(false);
					return error instanceof Error
						? error.message
						: "Failed to sign in with Google";
				},
			},
		);
	};
	return (
		<Button
			onClick={handleSignIn}
			disabled={loading}
			className={cn("w-full", className)}
		>
			{loading ? "Loading..." : "Sign in with Google"}
		</Button>
	);
}
