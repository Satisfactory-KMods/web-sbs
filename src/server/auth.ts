import { env } from "@/env.mjs";
import { prisma } from "@/server/db";
import type { NextAuthSession } from "@/types/Next";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { GetServerSidePropsContext } from "next";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import {
	getServerSession,
	getServerSession as originalGetServerSession
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { cookies, headers } from 'next/headers';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string,
			isAdmin: boolean
		} & DefaultSession["user"]
	}
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
	secret: env.NEXTAUTH_SECRET,
	callbacks: {
		session: ( { session, user } ) => ( {
			...session,
			user: {
				...session.user,
				...user
			}
		} )
	},
	adapter: PrismaAdapter( prisma ),
	providers: [
		DiscordProvider( {
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET
		} )
	]
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = ( ctx: {
	req: GetServerSidePropsContext["req"],
	res: GetServerSidePropsContext["res"]
} ) => getServerSession( ctx.req, ctx.res, authOptions );

// workaround for App directory > https://github.com/nextauthjs/next-auth/issues/7486#issuecomment-1543747325
export const getAppSession = async(): Promise<NextAuthSession> => {
	const req = {
		headers: Object.fromEntries( headers() as Headers ),
		cookies: Object.fromEntries(
			cookies()
				.getAll()
				.map( c => [ c.name, c.value ] )
		)
	};
	const res = { getHeader() {}, setCookie() {}, setHeader() {} };

	// @ts-ignore - The type used in next-auth for the req object doesn't match, but it still works
	const session = await originalGetServerSession( req, res, authOptions );
	return session as NextAuthSession;
};
