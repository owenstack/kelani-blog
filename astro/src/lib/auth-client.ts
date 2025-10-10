import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"

const authClient = createAuthClient({
	baseURL: import.meta.env.DEV
		? "http://localhost:4321"
		: "https://beyonddogma.blog",
	plugins: [
		adminClient()
	],
});

export const {signIn, signOut, useSession, signUp} = authClient