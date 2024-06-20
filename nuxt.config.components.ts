export const components: Parameters<typeof defineNuxtConfig>[0]['components'] = {
	global: true,
	dirs: [
		{
			path: '~/components/layout',
			prefix: 'Layout'
		},
		{
			path: '~/components/home',
			prefix: 'Home'
		},
		{
			path: '~/components/common',
			prefix: 'Common'
		}
	]
} as const;
