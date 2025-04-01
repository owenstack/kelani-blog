"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth.client";
import { env } from "@/lib/env";
import { Turnstile } from "@marsidev/react-turnstile";
import Form from "next/form";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { GoogleSignIn } from "./google-login";
import { Submit } from "./submit";

export function LoginForm() {
	const [token, setToken] = useState("");
	const handleSignIn = async (form: FormData) => {
		const email = form.get("name") as string;
		const password = form.get("password") as string;
		if (!token) {
			toast.error("Captcha not verified", {
				description: "Please verify the captcha",
			});
			return;
		}
		try {
			await signIn.email({
				email,
				password,
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
		}
	};
	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col items-center gap-2 text-center">
					<h1 className="text-2xl font-bold">Login to your account</h1>
					<p className="text-balance text-sm text-muted-foreground">
						Enter your email below to login to your account
					</p>
				</div>
				<Form action={handleSignIn} className="grid gap-6">
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							name="name"
							placeholder="someone@beyonddogma.blog"
							autoComplete="email"
							required
						/>
					</div>
					<div className="grid gap-2">
						<div className="flex items-center">
							<Label htmlFor="password">Password</Label>
							<Link
								href="/forget-password"
								className="ml-auto text-sm underline-offset-4 hover:underline"
							>
								Forgot your password?
							</Link>
						</div>
						<Input
							id="password"
							type="password"
							name="password"
							autoComplete="current-password"
							required
						/>
					</div>
					<Submit disabled={!token}>Log in</Submit>
				</Form>
				<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
					<span className="relative z-10 bg-background px-2 text-muted-foreground">
						Or continue with
					</span>
				</div>
				<GoogleSignIn token={token} disabled={!token} />
				<Turnstile
					onSuccess={(token) => {
						setToken(token);
					}}
					onError={() => {
						toast.error("Captcha verification failed");
					}}
					siteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
				/>
			</div>
			<div className="text-center text-sm">
				Don't have an account?{" "}
				<Link href="/sign-up" className="underline underline-offset-4">
					Sign up
				</Link>
			</div>
		</div>
	);
}
