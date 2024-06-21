import {
	bigint,
	bigserial,
	boolean,
	colTimestamp,
	pgEnum,
	primaryKey,
	uniqueIndex,
	varchar
} from '@kmods/drizzle-pg/pg-core';
import { sbsSchema } from '../pgSchema';

export const pgAdapterAuthTypeEnum = pgEnum('enum_adapter_auth_type', [
	'oauth',
	'oidc',
	'email',
	'webauthn'
]);

export const users = sbsSchema.table('user', {
	id: bigserial('id').notNull().primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull(),
	emailVerified: colTimestamp('emailVerified'),
	image: varchar('image', { length: 1024 }),
	hoster: boolean('hoster').notNull().default(false)
});

export const accounts = sbsSchema.table(
	'account',
	{
		userId: bigint('userId')
			.notNull()
			.references(
				() => {
					return users.id;
				},
				{ onDelete: 'cascade' }
			),
		type: pgAdapterAuthTypeEnum('type').notNull(),
		provider: varchar('provider', { length: 1024 }).notNull(),
		providerAccountId: bigint('providerAccountId').notNull(),
		refresh_token: varchar('refresh_token', { length: 1024 }),
		access_token: varchar('access_token', { length: 1024 }),
		expires_at: colTimestamp('expires_at'),
		token_type: varchar('token_type', { length: 1024 }),
		scope: varchar('scope', { length: 1024 }),
		id_token: varchar('id_token', { length: 1024 }),
		session_state: varchar('session_state', { length: 1024 })
	},
	(account) => {
		return {
			compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
			uniqueProviderId: uniqueIndex().on(account.providerAccountId)
		};
	}
);

export const sessions = sbsSchema.table('session', {
	sessionToken: varchar('sessionToken', { length: 1024 }).notNull().primaryKey(),
	userId: bigint('userId')
		.notNull()
		.references(
			() => {
				return users.id;
			},
			{ onDelete: 'cascade' }
		),
	expires: colTimestamp('expires').notNull()
});

export const verificationTokens = sbsSchema.table(
	'verificationToken',
	{
		identifier: varchar('identifier', { length: 1024 }).notNull(),
		token: varchar('token', { length: 1024 }).notNull(),
		expires: colTimestamp('expires').notNull()
	},
	(vt) => {
		return {
			compoundKey: primaryKey({ columns: [vt.identifier, vt.token] })
		};
	}
);
