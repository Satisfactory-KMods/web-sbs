import {
	bigint,
	colTimestamp,
	integer,
	primaryKey,
	serial,
	varchar
} from '@kmods/drizzle-pg/pg-core';
import { sbsSchema } from '../pgSchema';
import { accounts } from './auth';
import { scBlueprint } from './blueprints';

export const scBlueprintPack = sbsSchema.table('blueprintpacks', {
	pack_id: serial('pack_id').primaryKey().notNull(),
	creator: bigint('creator')
		.notNull()
		.references(() => accounts.providerAccountId),
	name: varchar('name', { length: 2048 }).notNull(),
	description: varchar('description', { length: 32768 }).notNull(),
	created: colTimestamp('created').defaultNow().notNull(),
	updated: colTimestamp('updated').defaultNow().notNull()
});

export type BlueprintPack = typeof scBlueprintPack.$inferSelect;
export type BlueprintPackInsert = typeof scBlueprintPack.$inferInsert;

export const scBlueprintPackLink = sbsSchema.table(
	'blueprintpacks_blueprints',
	{
		id: integer('id')
			.references(() => scBlueprint.id)
			.notNull(),
		pack_id: integer('pack_id')
			.references(() => scBlueprintPack.pack_id)
			.notNull()
	},
	(t) => ({
		primary: primaryKey({ columns: [t.id, t.pack_id] })
	})
);

export type BlueprintPackLink = typeof scBlueprintPackLink.$inferSelect;
export type BlueprintPackLinkInsert = typeof scBlueprintPackLink.$inferInsert;
