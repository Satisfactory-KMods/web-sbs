// @ts-ignore
import { defineConfig } from "vite";
// @ts-ignore
import react            from "@vitejs/plugin-react";
// @ts-ignore
import eslint           from "vite-plugin-eslint";
import tailwindcss      from "tailwindcss";

export default defineConfig( {
	server: {
		watch: {
			usePolling: false
		},
		proxy: {
			"/api": {
				target: "http://127.0.0.1:80",
				changeOrigin: true,
				secure: false
			}
		}
	},
	build: {
		outDir: "build"
	},
	plugins: [
		tailwindcss(),
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