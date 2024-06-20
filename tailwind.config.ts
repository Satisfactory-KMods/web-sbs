import type tailwind from 'tailwindcss';
/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	plugins: [require('@tailwindcss/typography')],
	content: [
		'./presets/**/*.{js,ts}',
		'./components/**/*.{ts,js,vue}',
		'./pages/**/*.{ts,js,vue}'
	],
	theme: {
		extend: {
			colors: {
				'surface-0': 'rgb(var(--custom-surface-0))',
				'surface-50': 'rgb(var(--custom-surface-50))',
				'surface-100': 'rgb(var(--custom-surface-100))',
				'surface-200': 'rgb(var(--custom-surface-200))',
				'surface-300': 'rgb(var(--custom-surface-300))',
				'surface-400': 'rgb(var(--custom-surface-400))',
				'surface-500': 'rgb(var(--custom-surface-500))',
				'surface-600': 'rgb(var(--custom-surface-600))',
				'surface-700': 'rgb(var(--custom-surface-700))',
				'surface-800': 'rgb(var(--custom-surface-800))',
				'surface-900': 'rgb(var(--custom-surface-900))',
				'surface-950': 'rgb(var(--custom-surface-950))',
				'primary': {
					'50': '#f3f7fc',
					'100': '#e6eff8',
					'200': '#c8deef',
					'300': '#97c3e2',
					'400': '#5fa4d1',
					'500': '#3b88bc',
					'600': '#2a6c9f',
					'700': '#265e8b',
					'800': '#214a6b',
					'900': '#20405a',
					'950': '#15283c',
					'default': '#265e8b'
				},
				'secondary': {
					'50': '#effaf4',
					'100': '#d8f3e2',
					'200': '#b3e7c8',
					'300': '#81d4a8',
					'400': '#4dba84',
					'500': '#268c5d',
					'600': '#1c7f53',
					'700': '#166645',
					'800': '#145138',
					'900': '#114330',
					'950': '#09251a',
					'default': '#268c5d'
				}
			}
		}
	}
} satisfies tailwind.Config;
