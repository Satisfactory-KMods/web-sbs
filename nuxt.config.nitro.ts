import { env } from './env';

export const nitro: Parameters<typeof defineNuxtConfig>[0]['nitro'] = {
	storage: {
		redis: {
			driver: 'redis',
			...env.redis
		}
	},
	preset: 'node-server',
	hooks: {
		'dev:reload': () => {
			// @ts-ignore
			return require('sharp');
		}
	},
	runtimeConfig: {
		/**
		 * Will be available on both server and client
		 * we want to create urls to invite the bot to the server
		 * for exmaplte: runtimeConfig: https://discord.com/oauth2/authorize?client_id=${useRuntimeConfig().discordClientId}
		 */
		public: env.nuxt.public
	}
} as const;
