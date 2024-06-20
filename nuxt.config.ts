import ViteYaml from '@modyfi/vite-plugin-yaml';
import { resolve } from 'node:path';
import { components } from './nuxt.config.components';
import { nitro } from './nuxt.config.nitro';
import Aura from './themes/aura.js';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	future: {
		compatibilityVersion: 4
	},
	modules: [
		'@vueuse/nuxt',
		'@nuxt/image',
		'nuxt-icon',
		'@nuxtjs/color-mode',
		'@primevue/nuxt-module',
		'@pinia/nuxt',
		'@pinia-plugin-persistedstate/nuxt',
		'@nuxtjs/tailwindcss'
	],
	colorMode: {
		classSuffix: '',
		preference: 'light'
	},
	primevue: {
		importTheme: { from: resolve(__dirname, 'themes/aura.js') },
		options: {
			theme: Aura,
			ripple: true,
			unstyled: false
		}
	},
	vite: {
		plugins: [ViteYaml()]
	},
	alias: {
		cookie: 'cookie'
	},
	css: ['~/assets/css/tailwind.css', 'primeicons/primeicons.css'],
	tailwindcss: {
		cssPath: '~/assets/css/tailwind.css'
	},
	pages: true,
	devtools: { enabled: true },
	components,
	nitro
});
