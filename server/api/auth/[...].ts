import { NuxtAuthHandler } from '#auth';
import { and, eq } from '@kmods/drizzle-pg';
import DiscordProvider from 'next-auth/providers/discord';
import { env } from '~~/env';
import { accounts, db, users } from '~~/server/utils/db/postgres/pg';

/**
 * https://github.com/nuxt/nuxt/issues/20576#issuecomment-1712859008
 * we need to use .default because of a random issue here
 * also ignore the TS error because it's not actually an error and it works fine
 */
export default NuxtAuthHandler({
	secret: env.auth.secret,
	providers: [
		// @ts-ignore
		DiscordProvider.default({
			clientId: env.auth.discord.clientId,
			clientSecret: env.auth.discord.clientSecret
		})
	],
	pages: {
		// Change the default behavior to use `/login` as the path for the sign-in page
		signIn: '/login',
		error: '/login'
	},
	callbacks: {
		// we need to add discordId and superAdmin to the session
		// so we can use that later to indentify the servers to assign the permissions
		session: async ({ session, user }: any) => {
			const fullAccount = await db
				.select({
					discordId: accounts.providerAccountId
				})
				.from(accounts)
				.where(and(eq(accounts.provider, 'discord'), eq(accounts.userId, user.id)))
				.firstOrThrow('Account not found');
			const fullUser = await db
				.select({
					superAdmin: users.hoster
				})
				.from(users)
				.where(eq(users.id, user.id))
				.firstOrThrow('Account not found');

			// uppercase the first letter of the name
			session.user.name = user.name.charAt(0).toUpperCase() + user.name.slice(1);
			session.user.discordId = fullAccount.discordId;
			session.user.superAdmin = fullUser.superAdmin;

			return session;
		}
	},
	session: {
		strategy: 'database',
		updateAge: 86400 * 7
	},
	adapter: pgDrizzleAdapter
});
