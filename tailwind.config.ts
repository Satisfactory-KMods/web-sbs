import type { Config } from "tailwindcss";


export default  {
	darkMode: 'class',
	important: true,
	content: [
		"./src/**/*.{js,ts,jsx,tsx}",
		"./node_modules/flowbite-react/**/*.{js,ts,jsx,tsx}"
	],
	plugins: [ require( 'flowbite/plugin' ), require( '@tailwindcss/typography' ) ],
	theme: {
		'desktop': '1200px'
	},
	safelist: [
		'bg-red-500',
		'bg-green-500',
		'dark:hover:bg-dark-800',
		'dark:bg-gray-700',
		'dark:hover:bg-green-900',
		'dark:bg-green-800'
	]
} satisfies Config;
