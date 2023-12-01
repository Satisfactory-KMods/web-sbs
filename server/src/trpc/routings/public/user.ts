import type { ClientUserAccount } from '@server/MongoDB/MongoUserAccount';
import MongoUserAccount from '@server/MongoDB/MongoUserAccount';
import { handleTRCPErr, publicProcedure, router } from '@server/trpc/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const publicUser = router({
	getUser: publicProcedure
		.input(
			z.object({
				userId: z.string()
			})
		)
		.query(async ({ input }) => {
			const { userId } = input;

			try {
				const user = await MongoUserAccount.findById<ClientUserAccount>(userId, { hash: 0, salt: 0, apiKey: 0 });
				return user;
			} catch (e) {
				handleTRCPErr(e);
			}
			throw new TRPCError({ message: 'password or login is to short.', code: 'BAD_REQUEST' });
		})
});
