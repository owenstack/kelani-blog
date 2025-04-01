import Google from "@/assets/icons/google";
import { toast } from "sonner";
import { Button, type ButtonProps } from "./ui/button";
import { signIn } from "@/lib/auth.client";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface GoogleButton extends ButtonProps {
	token?: string;
}

export function GoogleSignIn({ disabled, token }: GoogleButton) {
	const [loading, setLoading] = useState(false);
	const signInWithGoogle = async () => {
		setLoading(true);
		if (!token) {
			toast.error("Captcha not verified", {
				description: "Please verify the captcha",
			});
			setLoading(false);
			return;
		}
		try {
			await signIn.social({
				provider: "google",
				fetchOptions: {
					headers: {
						"x-captcha-response": token,
					},
				},
				callbackURL: "/",
			});
		} catch (error) {
			toast.error("Something went wrong", {
				description:
					error instanceof Error ? error.message : "Internal server error",
			});
		} finally {
			setLoading(false);
		}
	};
	return (
		<Button
			className=""
			variant={"outline"}
			disabled={disabled || loading}
			onClick={signInWithGoogle}
		>
			{loading ? (
				<Loader2 className="size-4 animate-spin" />
			) : (
				<span className="flex items-center gap-2">
					<Google className="size-4" />
					Login with Google
				</span>
			)}
		</Button>
	);
}
