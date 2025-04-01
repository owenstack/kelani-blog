"use client";

import Gradient from "@/assets/images/gradient.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth.client";
import { env } from "@/lib/env";
import { Turnstile } from "@marsidev/react-turnstile";
import { Eye, EyeOff } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { GoogleSignIn } from "./google-login";
import { Submit } from "./submit";

export function LoginForm() {
	const [token, setToken] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const handleSignUp = async (form: FormData) => {
		const name = form.get("name") as string;
		const email = form.get("email") as string;
		const password = form.get("password") as string;
		try {
			await signUp.email({
				name,
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
			<Card className="overflow-hidden shadow-lg">
				<CardContent className="grid p-0 md:grid-cols-2">
					<div className="flex flex-col gap-6 p-6 md:p-8">
						<Form action={handleSignUp} className="flex flex-col gap-6">
							<div className="flex flex-col items-center text-center">
								<h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
									Welcome!
								</h1>
								<p className="text-balance text-muted-foreground mt-2">
									Sign up for your Beyond Dogma account
								</p>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="name">Full name</Label>
								<Input
									id="name"
									placeholder="Bola Tinubu"
									autoComplete="name"
									name="name"
									required
									className="transition-all duration-200 focus:scale-[1.02]"
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									autoComplete="email"
									name="email"
									required
									className="transition-all duration-200 focus:scale-[1.02]"
								/>
							</div>
							<div className="grid gap-2">
								<Label>New password</Label>
								<div className="relative">
									<Input
										id="password"
										autoComplete="new-password"
										type={showPassword ? "text" : "password"}
										name="password"
										required
										className="pr-10 transition-all duration-200 focus:scale-[1.02]"
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</Button>
								</div>
							</div>
							<div className="grid gap-2">
								<Label>Confirm password</Label>
								<div className="relative">
									<Input
										id="confirmPassword"
										autoComplete="new-password"
										type={showConfirmPassword ? "text" : "password"}
										required
										className="pr-10 transition-all duration-200 focus:scale-[1.02]"
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									>
										{showConfirmPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</Button>
								</div>
							</div>
							<Submit
								disabled={!token}
								className="w-full bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-[1.02]"
							>
								Sign Up
							</Submit>
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
						<div className="text-center text-sm">
							Already have an account?{" "}
							<Link
								href="/log-in"
								className="text-primary hover:text-primary/90 underline underline-offset-4"
							>
								Log in
							</Link>
						</div>
					</div>
					<div className="relative hidden bg-muted md:block">
						<img
							src={Gradient.src}
							alt="gradient"
							className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
						/>
					</div>
				</CardContent>
			</Card>
			<div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
				By clicking continue, you agree to our{" "}
				<Link href="/about/tos">Terms of Service</Link> and{" "}
				<Link href="about/tos">Privacy Policy</Link>.
			</div>
		</div>
	);
}
