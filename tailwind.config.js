/** @type {import('tailwindcss').Config} */

const { join } = require( "path" );
module.exports = {
	mode: 'jit',
	content: [
		join( __dirname, 'index.html' ),
		join( __dirname, 'src/**/*.{js,jsx,ts,tsx}' )
	],
	darkMode: 'media',
	theme: {},
	variants: {},
	plugins: [],
}