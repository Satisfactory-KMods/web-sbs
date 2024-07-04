import { ilikeAny } from '@kmods/drizzle-pg';
import { db, scTags } from '../postgres/pg';

export function getOrCreateTags(names: string[], trx = db) {
	if (!names.length) throw new Error('Tag names is empty');
	return trx
		.select()
		.from(scTags)
		.where(ilikeAny(scTags.tag, names))
		.allOrThrow()
		.then(async (tags) => {
			if (tags.length === names.length) return tags;

			const notExist = names.filter((name) => {
				return !tags.some((tag) => {
					return tag.tag === name;
				});
			});
			const createdTags = await trx
				.insert(scTags)
				.values(
					notExist.map((tag) => {
						return { tag };
					})
				)
				.returning()
				.allOrThrow();

			return tags.concat(createdTags);
		})
		.catch(async () => {
			return await trx
				.insert(scTags)
				.values(
					names.map((tag) => {
						return { tag };
					})
				)
				.returning()
				.allOrThrow();
		});
}
