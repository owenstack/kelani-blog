import {betterAuth} from 'better-auth'
import {drizzleAdapter} from 'better-auth/adapters/drizzle'
import {db} from '../db'
import {admin} from 'better-auth/plugins'
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from 'astro:env/server'

export const auth = betterAuth({
    appName: 'Beyond Dogma',
    database: drizzleAdapter(db, {
		provider: 'sqlite',
	}),
	socialProviders: {
		google: {
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
		},
	},
    plugins: [admin()]
})