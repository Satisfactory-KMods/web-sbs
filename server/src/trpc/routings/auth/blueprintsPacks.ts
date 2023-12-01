import type { BlueprintPackExtended } from '@/server/src/MongoDB/MongoBlueprints';
import { MongoBlueprintPacks } from '@/server/src/MongoDB/MongoBlueprints';
import { authProcedure, blueprintPackOwnerProcedure, blueprintPackProcedure, handleTRCPErr, router } from '@server/trpc/trpc';
import { TRPCError } from '@trpc/server';
import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import { z } from 'zod';
import { buildFilter, filterSchema } from '../public/blueprint';

const ZodBlueprintCreateSchema = z.object({
	data: z.object({
		name: z.string().min(3),
		description: z.string().min(3),
		blueprints: z.array(z.string()).min(1)
	})
});

export const authBlueprintPacks = router({
	rate: blueprintPackProcedure
		.input(
			z.object({
				rating: z.number().min(1).max(5)
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { blueprintPack, userClass } = ctx;
			const { rating } = input;

			try {
				const bpDocument = await blueprintPack.getDocument();
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

	remove: blueprintPackOwnerProcedure.mutation(async ({ ctx }) => {
		const { blueprintPack } = ctx;
		try {
			if (await blueprintPack.remove()) {
				return 'Blueprint deleted!';
			}
		} catch (e) {
			handleTRCPErr(e);
		}
		throw new TRPCError({ message: 'Something goes wrong!', code: 'INTERNAL_SERVER_ERROR' });
	}),

	modify: blueprintPackOwnerProcedure.input(ZodBlueprintCreateSchema).mutation(async ({ ctx, input }) => {
		const { blueprintPack } = ctx;
		const { data } = input;
		const { name, description, blueprints } = data;
		try {
			const docu = await blueprintPack.getDocument();
			if (docu) {
				docu.name = name;
				docu.description = description;
				docu.blueprints = blueprints;

				docu.markModified('name');
				docu.markModified('description');
				docu.markModified('blueprints');

				if (await docu.save()) {
					docu.updateModRefs(true);

					const id = docu._id.toString();
					const zipDir = path.join(__MountDir, 'PackZips', id);

					if (fs.existsSync(zipDir)) {
						fs.rmSync(zipDir, { recursive: true });
					}

					return { message: 'Blueprint modified!', id: docu._id.toString() };
				}
			} else {
				throw new TRPCError({ message: 'BlueprintPack is invalid!', code: 'BAD_REQUEST' });
			}
		} catch (e) {
			handleTRCPErr(e);
		}
		throw new TRPCError({ message: 'Something goes wrong!', code: 'INTERNAL_SERVER_ERROR' });
	}),

	my: authProcedure
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
				const totalBlueprints = await MongoBlueprintPacks.count({ ...filter, owner: userClass.Get._id });
				const blueprintPacks: BlueprintPackExtended[] = await MongoBlueprintPacks.find<BlueprintPackExtended>(
					{ ...filter, owner: userClass.Get._id },
					null,
					{
						...options,
						limit,
						skip
					}
				).populate(['blueprints', { path: 'owner', select: '-hash -apiKey -salt' }, 'tags']);

				return { blueprintPacks, totalBlueprints };
			} catch (e) {
				handleTRCPErr(e);
			}
			throw new TRPCError({ message: 'Something goes wrong!', code: 'INTERNAL_SERVER_ERROR' });
		}),

	add: authProcedure.input(ZodBlueprintCreateSchema).mutation(async ({ ctx, input }) => {
		const { data } = input;
		const { name, description, blueprints } = data;
		const { userClass } = ctx;
		try {
			const docu = new MongoBlueprintPacks();
			docu.name = name;
			docu.description = description;
			docu.blueprints = blueprints;
			docu.owner = userClass.Get._id;
			docu.rating = [];
			docu.totalRating = 0;
			docu.totalRatingCount = 0;
			docu.mods = [];

			if (await docu.save()) {
				docu.updateModRefs(true);
				return { message: 'Blueprint created!', id: docu._id.toString() };
			}
		} catch (e) {
			handleTRCPErr(e);
		}
		throw new TRPCError({ message: 'Something goes wrong!', code: 'INTERNAL_SERVER_ERROR' });
	})
});

export type BlueprintCreateInput = z.infer<typeof ZodBlueprintCreateSchema>;
