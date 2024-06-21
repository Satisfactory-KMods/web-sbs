import { and, eq, ilike } from '@kmods/drizzle-pg';
import { db } from './db/postgres/pg';
import { accounts, sessions, users, verificationTokens } from './db/postgres/schema';

/**
 * modified version to support own implementation with bigint and discord ID for the user
 */
export const pgDrizzleAdapter: any = {
	async createUser(data: any) {
		return await db
			.insert(users)
			.values(data as any)
			.returning()
			.then((res) => {
				return res[0] ?? null;
			});
	},
	async getUser(data: any) {
		return await db.select().from(users).where(eq(users.id, data)).first();
	},
	async getUserByEmail(data: any) {
		return await db.select().from(users).where(ilike(users.email, data)).first();
	},
	async createSession(data: any) {
		return await db
			.insert(sessions)
			.values(data)
			.returning()
			.then((res) => {
				return res[0]
					? {
							...res[0],
							expires: new Date(String(res[0].expires))
						}
					: null;
			});
	},
	async getSessionAndUser(data: any) {
		return await db
			.select({
				session: sessions,
				user: users
			})
			.from(sessions)
			.where(eq(sessions.sessionToken, data))
			.innerJoin(users, eq(users.id, sessions.userId))
			.then((res) => {
				return res[0]
					? {
							...res[0],
							session: {
								...res[0].session,
								expires: new Date(String(res[0].session.expires))
							}
						}
					: null;
			});
	},
	async updateUser(data: any) {
		if (!data.id) {
			throw new Error('No user id.');
		}

		return await db
			.update(users)
			.set(data)
			.where(eq(users.id, data.id))
			.returning()
			.then((res) => {
				return res[0];
			});
	},
	async updateSession(data: any) {
		return await db
			.update(sessions)
			.set(data)
			.where(eq(sessions.sessionToken, data.sessionToken))
			.returning()
			.then((res) => {
				return res[0];
			});
	},
	async linkAccount(rawAccount: any) {
		return await db
			.insert(accounts)
			.values(rawAccount)
			.returning()
			.firstOrThrow('Failed to link account');
	},
	async getUserByAccount(account: any) {
		const dbAccount = await db
			.select()
			.from(accounts)
			.where(
				and(
					eq(accounts.providerAccountId, account.providerAccountId),
					eq(accounts.provider, account.provider)
				)
			)
			.leftJoin(users, eq(accounts.userId, users.id))
			.first();

		return dbAccount?.user ?? null;
	},
	async deleteSession(sessionToken: any) {
		const session = await db
			.delete(sessions)
			.where(eq(sessions.sessionToken, sessionToken))
			.returning()
			.first();

		return session;
	},
	async createVerificationToken(token: any) {
		return await db.insert(verificationTokens).values(token).returning().first();
	},
	async useVerificationToken(token: any) {
		try {
			return await db
				.delete(verificationTokens)
				.where(
					and(
						eq(verificationTokens.identifier, token.identifier),
						eq(verificationTokens.token, token.token)
					)
				)
				.returning()
				.firstOrThrow();
		} catch (err) {
			throw new Error('No verification token found.');
		}
	},
	async deleteUser(id: any) {
		await db
			.delete(users)
			.where(eq(users.id, id))
			.returning()
			.then((res) => {
				return res[0] ?? null;
			});
	},
	async unlinkAccount(account: any) {
		const { type, provider, providerAccountId, userId } = await db
			.delete(accounts)
			.where(
				and(
					eq(accounts.providerAccountId, account.providerAccountId),
					eq(accounts.provider, account.provider)
				)
			)
			.returning()
			.then((res) => {
				return res[0] ?? null;
			});

		return { provider, type, providerAccountId, userId };
	}
} as const;
