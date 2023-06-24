/* eslint-disable no-undef */
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";


export const env = createEnv( {
	server: {
		DATABASE_URL: z.string().url(),
		NODE_ENV: z.enum( [ "development", "test", "production" ] ),
		DISCORD_CLIENT_ID: z.string(),
		NEXTAUTH_URL: z.string(),
		NEXTAUTH_SECRET: z.string(),
		DISCORD_CLIENT_SECRET: z.string(),
		APIKey: z.string()
	},

	client: {
	},

	/**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		NODE_ENV: process.env.NODE_ENV,
		NEXTAUTH_URL: process.env.NEXTAUTH_URL,
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
		DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
		APIKey: process.env.APIKey
	},

	skipValidation: !!process.env.SKIP_ENV_VALIDATION
} );
