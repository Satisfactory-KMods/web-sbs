/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import( "./src/build_env.mjs" );

/** @type {import("next").NextConfig} */
const config = {
	modularizeImports: {
		lodash: {
			transform: 'lodash/{{member}}'
		}
	},
	compress: true,
	productionBrowserSourceMaps: false,
	poweredByHeader: false,
	transpilePackages: [ 'flowbite-react', "flowbite" ],
	images: {
		domains: [ 'avatars.githubusercontent.com', 'cdn.discordapp.com', 'kyrium.space' ]
	},
	/*compiler: {
		removeConsole: {
			exclude: [ 'error' ]
		}
	},*/
	reactStrictMode: true,
	experimental: {
		serverComponentsExternalPackages: [ "typescript", "eslint", "lodash", "prisma", "ts-node", "@prisma/client" ],
		serverActions: true
	}
};

export default config;
