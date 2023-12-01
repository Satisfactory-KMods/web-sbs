/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
	darkMode: 'class',
	important: true,
	mode: 'jit',
	colors: {
		orange: {
			500: '#fa9549'
		},
		blue: {
			500: '#5f668c'
		}
	},
	content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}', 'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'],
	fontFamily: {
		sans: ['Graphik', 'sans-serif'],
		serif: ['Merriweather', 'serif']
	},
	theme: {
		extend: {}
	},
	plugins: [require('flowbite/plugin')]
};
