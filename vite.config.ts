/** @type {import("vite").UserConfig} */

import {
	Alias,
	defineConfig,
	loadEnv
}             from "vite";
import react  from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import {
	join,
	resolve
}             from "path";
import fs     from "fs";

const vendor = [ "react-bootstrap", "react-icons", "react", "react-markdown", "react-select", "react-router-dom", "react-dom" ];

function renderChunks( deps : Record<string, string> ) {
	const chunks : any = {};
	Object.keys( deps ).forEach( ( key ) => {
		if ( vendor.includes( key ) ) {
			return;
		}
		chunks[ key ] = [ key ];
	} );
	return chunks;
}

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
			manifest: true,
			sourcemap: false,
			outDir: "build",
			rollupOptions: {
				output: {
					entryFileNames: `entry/[name].js`,
					chunkFileNames: `chunk/[name].js`,
					assetFileNames: `asset/[name].[ext]`,
					manualChunks: {
						vendor//,
						//...renderChunks( dependencies )
					}
				}
			}
		},
		plugins: [
			react( {
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
