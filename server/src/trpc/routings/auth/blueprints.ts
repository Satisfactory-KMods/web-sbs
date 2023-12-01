import type { BlueprintData } from '@/server/src/MongoDB/MongoBlueprints';
import MongoBlueprints from '@/server/src/MongoDB/MongoBlueprints';
import { authProcedure, blueprintModOwnerProcedure, blueprintProcedure, handleTRCPErr, router } from '@server/trpc/trpc';
import { TRPCError } from '@trpc/server';
import _ from 'lodash';
import { z } from 'zod';
import { buildFilter, filterSchema } from '../public/blueprint';

export const authBlueprints = router({
	rate: blueprintProcedure
		.input(
			z.object({
				rating: z.number().min(1).max(5)
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { blueprint, userClass } = ctx;
			const { rating } = input;

			try {
				const bpDocument = await blueprint.getDocument();
				if (bpDocument) {
					const ratingIndex = bpDocument.rating.findIndex((e) => _.isEqual(e.userid.toString(), userClass.Get._id));
					if (ratingIndex >= 0) {
						bpDocument.rating[ratingIndex].rating = rating;
					} else {
						bpDocument.rating.push({ userid: userClass.Get._id, rating });
					}
					if (await bpDocument.updateRating()) {
						return 'Rating saved!';
					}
				}
			} catch (e) {
				handleTRCPErr(e);
			}
			throw new TRPCError({ message: 'password or login is to short.', code: 'BAD_REQUEST' });
		}),

	deleteBlueprint: blueprintModOwnerProcedure.mutation(async ({ ctx }) => {
		const { blueprint } = ctx;
		try {
			if (await blueprint.remove()) {
				return 'Blueprint deleted!';
			}
		} catch (e) {
			handleTRCPErr(e);
		}
		throw new TRPCError({ message: 'Something goes wrong!', code: 'INTERNAL_SERVER_ERROR' });
	}),

	myBlueprints: authProcedure
		.input(
			z.object({
				skip: z.number().optional(),
				limit: z.number().optional(),
				filterOptions: filterSchema.optional()
			})
		)
		.query(async ({ ctx, input }) => {
			const { limit, filterOptions, skip } = input;
			const { userClass } = ctx;
			try {
				const { filter, options } = buildFilter(filterOptions);
				const totalBlueprints = await MongoBlueprints.count({ ...filter, owner: userClass.Get._id });
				const blueprints = await MongoBlueprints.find<BlueprintData>({ ...filter, owner: userClass.Get._id }, null, {
					...options,
					limit,
					skip
				});
				return { blueprints, totalBlueprints };
			} catch (e) {
				handleTRCPErr(e);
			}
			throw new TRPCError({ message: 'Something goes wrong!', code: 'INTERNAL_SERVER_ERROR' });
		})
});
