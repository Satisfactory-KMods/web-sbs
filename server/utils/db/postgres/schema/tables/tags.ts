import { serial, varchar } from '@kmods/drizzle-pg/pg-core';
import { sbsSchema } from '../pgSchema';

export const scTags = sbsSchema.table('blueprint', {
	tag_id: serial('tag_id').primaryKey().notNull(),
	tag: varchar('tag', { length: 1024 }).unique().notNull()
});
