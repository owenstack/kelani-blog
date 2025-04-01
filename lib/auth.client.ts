import { adminClient, usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL:
		process.env.NODE_ENV === "development"
			? process.env.NEXT_PUBLIC_NGROK_URL || "http://localhost:3000"
			: `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`,
	plugins: [usernameClient(), adminClient()],
});

export const { signIn, signOut, useSession, signUp } = authClient;
