/** @type {import("vite").UserConfig} */

import type { Alias } from "vite";
import {
	defineConfig,
	loadEnv
}                     from "vite";
import reactvite      from "@vitejs/plugin-react";
import eslint         from "vite-plugin-eslint";
import {
	join,
	resolve
}                     from "path";
import fs             from "fs";

const react = [ "react", "react-router-dom", "react-dom" ];
const bootstrap = [ "react-bootstrap", "bootstrap" ];
const icons = [ "react-icons" ];
const addons = [ "react-markdown", "react-select", "lodash" ];
const sweetalert = [ "sweetalert2", "sweetalert2-react-content" ];

export default defineConfig( ( { command, mode, ssrBuild } ) => {
	const Paths : Record<string, string[]> = JSON.parse( fs.readFileSync( resolve( __dirname, "tsconfig.json" ), "utf-8" ).toString() ).compilerOptions.paths;
	const alias = Object.entries( Paths ).map<Alias>( ( [ key, value ] ) => ( {
		find: key.replace( "/*", "" ),
		replacement: join( __dirname, value[ 0 ].replace( "/*", "" ) )
	} ) );
	console.log( "Resolve Alias:", alias );
	const env = loadEnv( mode, process.cwd(), "" );
	return {
		define: {
			__APP_ENV__: env.APP_ENV
		},
		assetsInclude: [ "**/*.md" ],
		resolve: {
			alias
		},
		server: {
			port: 3000,
			watch: {
				usePolling: false
			},
			proxy: {
				"/api": {
					target: "http://127.0.0.1:80",
					changeOrigin: true,
					secure: false,
					ws: true
				}
			}
		},
		build: {
			target: [ "chrome88", "edge89", "es2021", "firefox79", "safari15" ],
			manifest: true,
			sourcemap: false,
			outDir: "build",
			rollupOptions: {
				output: {
					entryFileNames: `entry/[name].[hash].js`,
					chunkFileNames: `chunk/[name].[hash].js`,
					assetFileNames: `asset/[name].[hash].[ext]`,
					manualChunks: {
						react, bootstrap, icons, addons, sweetalert
						//...renderChunks( dependencies )
					}
				}
			}
		},
		plugins: [
			reactvite( {
				include: "{**/*,*}.{js,ts,jsx,tsx}",
				babel: {
					parserOpts: {
						plugins: [ "decorators-legacy" ]
					}
				}
			} ), eslint( {
				include: "{**/*,*}.{js,ts,jsx,tsx}"
			} )
		]
	};
} );
