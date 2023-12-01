import type { Tag } from '@server/MongoDB/MongoTags';
import MongoTags from '@server/MongoDB/MongoTags';
import { handleTRCPErr, publicProcedure, router } from '@server/trpc/trpc';
import { TRPCError } from '@trpc/server';

export const publicTags = router({
	getTags: publicProcedure.query(async () => {
		try {
			const tags = await MongoTags.find<Tag>();
			if (tags) {
				return tags;
			}
		} catch (e) {
			handleTRCPErr(e);
		}
		throw new TRPCError({ message: 'Something goes wrong!', code: 'INTERNAL_SERVER_ERROR' });
	})
});
