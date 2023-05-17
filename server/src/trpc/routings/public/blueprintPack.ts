import {
	buildFilter,
	filterSchema,
} from '@/server/src/trpc/routings/public/blueprint';
import type { BlueprintData } from '@server/MongoDB/MongoBlueprints';
import { MongoBlueprintPacks } from '@server/MongoDB/MongoBlueprints';
import { handleTRCPErr, publicProcedure, router } from '@server/trpc/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const publicBlueprintPacks = router( {
	getBlueprintPacks: publicProcedure
		.input(
			z.object( {
				skip: z.number().optional(),
				limit: z.number().optional(),
				filterOptions: filterSchema.optional(),
			} )
		)
		.query( async( { input } ) => {
			const { limit, filterOptions, skip } = input;
			try {
				const { filter, options } = buildFilter( filterOptions );
				const totalBlueprints = await MongoBlueprintPacks.count( filter );
				const blueprintPacks = await MongoBlueprintPacks.find<BlueprintData>(
					filter,
					null,
					{
						...options,
						limit,
						skip,
					}
				).populate( 'blueprints' );
				return { blueprintPacks, totalBlueprints };
			} catch( e ) {
				handleTRCPErr( e );
			}
			throw new TRPCError( {
				message: 'Something goes wrong!',
				code: 'INTERNAL_SERVER_ERROR',
			} );
		} ),
} );
