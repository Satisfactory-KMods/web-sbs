import { z } from 'zod';
import pkg from './package.json';

const version = pkg.version;

const zodStringOrNumber = z
	.string()
	.or(z.number())
	.transform((v) => {
		return parseInt(String(v));
	});

export const env = z
	.object({
		// Auth secrete can generate using `openssl rand -hex 64`
		NEXTAUTH_SECRET: z.string(),
		// Discord client id & secret can be found in discord developer portal
		DISCORD_CLIENT_ID: z.string().regex(/^\d+$/),
		DISCORD_CLIENT_SECRET: z.string(),
		DISCORD_BOT_TOKEN: z.string(),
		// Next auth url
		NEXTAUTH_URL: z.string(),
		// Redis password, host and port (for caching different data)
		REDIS_PASSWORD: z.string(),
		REDIS_HOST: z.string(),
		REDIS_PORT: zodStringOrNumber,
		// Postgres password, user, db, host and port
		POSTGRES_PASSWORD: z.string(),
		POSTGRES_USER: z.string(),
		POSTGRES_DB: z.string(),
		POSTGRES_HOST: z.string(),
		POSTGRES_PORT: zodStringOrNumber,
		// Ficsit app url
		FICSIT_APP_API_URL: z.string(),
		FICSIT_APP_API_TOKEN: z.string().optional()
	})
	.transform((env) => {
		return {
			version,
			dev: process.env.NODE_ENV !== 'production',
			ficsit: {
				url: env.FICSIT_APP_API_URL,
				token: env.FICSIT_APP_API_TOKEN
			},
			nuxt: {
				public: {
					version,
					discordClientId: env.DISCORD_CLIENT_ID,
					discordInviteUrl: `https://discord.com/oauth2/authorize?client_id=${env.DISCORD_CLIENT_ID}&permissions=8&scope=bot`,
					patreonUrl: 'https://www.patreon.com/kmods',
					githubRepo: 'https://github.com/Kyri123/kbot2',
					discordSupport: 'https://discord.gg/BeH4GRRWxc'
				}
			},
			auth: {
				secret: env.NEXTAUTH_SECRET,
				url: env.NEXTAUTH_URL,
				discord: {
					token: env.DISCORD_BOT_TOKEN,
					clientId: env.DISCORD_CLIENT_ID,
					clientSecret: env.DISCORD_CLIENT_SECRET
				}
			},
			redis: {
				password: env.REDIS_PASSWORD,
				host: env.REDIS_HOST,
				port: env.REDIS_PORT
			},
			postgres: {
				password: env.POSTGRES_PASSWORD,
				user: env.POSTGRES_USER,
				database: env.POSTGRES_DB,
				host: env.POSTGRES_HOST,
				port: env.POSTGRES_PORT
			}
		};
	})
	.parse(process.env);
