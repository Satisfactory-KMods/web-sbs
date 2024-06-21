import {
	boolean,
	colJson,
	colTimestamp,
	integer,
	primaryKey,
	varchar
} from '@kmods/drizzle-pg/pg-core';
import { z } from 'zod';
import { sbsSchema } from '../pgSchema';
import { scTags } from './tags';

export const zodIconData = z.object({
	iconID: z.number(),
	color: z.object({
		r: z.number(),
		g: z.number(),
		b: z.number(),
		a: z.number()
	})
});

export const scBlueprint = sbsSchema.table('blueprint', {
	id: integer('id').primaryKey().notNull(),
	name: varchar('name', { length: 2048 }).notNull(),
	raw_name: varchar('raw_name', { length: 2048 }).notNull(),
	images: colJson('images', z.string().array()).notNull(),
	size: integer('size').notNull(),
	description: varchar('description', { length: 32768 }).notNull(),
	created: colTimestamp('created').defaultNow().notNull(),
	updated: colTimestamp('updated').defaultNow().notNull(),
	isModded: boolean('is_modded').notNull(),
	download: integer('download').notNull(),
	iconData: colJson('icon_data', zodIconData).notNull(),
	scimUser: varchar('scim_user', { length: 2048 }).notNull()
});

export type Blueprint = typeof scBlueprint.$inferSelect;
export type BlueprintInsert = typeof scBlueprint.$inferInsert;

export const scBlueprintMods = sbsSchema.table(
	'blueprint_mods',
	{
		id: integer('id')
			.references(() => scBlueprint.id)
			.notNull(),
		mod_ref: varchar('mod_ref', { length: 128 }).notNull()
	},
	(t) => ({
		primary: primaryKey({ columns: [t.id, t.mod_ref] })
	})
);

export type BlueprintMods = typeof scBlueprintMods.$inferSelect;
export type BlueprintModsInsert = typeof scBlueprintMods.$inferInsert;

export const scBlueprintTags = sbsSchema.table(
	'blueprint_tags',
	{
		id: integer('id')
			.references(() => scBlueprint.id)
			.notNull(),
		tag_id: integer('tag_id')
			.references(() => scTags.tag_id)
			.notNull()
	},
	(t) => ({
		primary: primaryKey({ columns: [t.id, t.tag_id] })
	})
);

export type BlueprintTags = typeof scBlueprintTags.$inferSelect;
export type BlueprintTagsInsert = typeof scBlueprintTags.$inferInsert;
