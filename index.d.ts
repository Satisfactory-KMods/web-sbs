import '@nuxt/schema';
import type { Result } from 'h3-formidable';
import type { DefaultSession } from 'next-auth';

import '@nuxtjs/mdc';

// ts global for yaml
declare module '*.yaml' {
	const json: Record<string, string>;
	export default json;
}

declare module '*.yml' {
	const json: Record<string, string>;
	export default json;
}

declare module '@nuxt/schema' {
	interface PublicRuntimeConfig {
		version: string;
		discordClientId: string;
		discordInviteUrl: string;
		patreonUrl: string;
		githubRepo: string;
		discordSupport: string;
		mdc: {
			useNuxtImage: any;
			components: {
				prose: boolean;
				map: Record<string, string>;
			};
			headings: any;
		};
	}
}

declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: {
			id: string;
			name: string;
			email: string;
			image: string;
			discordId: string;
			superAdmin: boolean;
		};
		expires: string;
	}
}

declare module 'h3' {
	interface H3EventContext {
		formidable: Result;
	}
}

// It is always important to ensure you import/export something when augmenting a type
export {};
