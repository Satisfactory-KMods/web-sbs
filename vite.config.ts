// @ts-ignore
import { defineConfig } from "vite";
// @ts-ignore
import react            from "@vitejs/plugin-react";
// @ts-ignore
import eslint           from "vite-plugin-eslint";

export default defineConfig( {
	assetsInclude: [ "**/*.md" ],
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
		outDir: "build"
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
} );