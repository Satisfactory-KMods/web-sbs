import {
	buildFilter,
	filterSchema
} from '@/server/src/trpc/routings/public/blueprint';
import type { BlueprintPackExtended } from '@server/MongoDB/MongoBlueprints';
import { MongoBlueprintPacks } from '@server/MongoDB/MongoBlueprints';
import { handleTRCPErr, publicProcedure, router } from '@server/trpc/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';


export const publicBlueprintPacks = router( {
	getBlueprintPack: publicProcedure.input( z.object( { id: z.string() } ) ).query( async( { input } ) => {
		const { id } = input;
		try {
			const docu = await MongoBlueprintPacks.findById( id ).populate( [ 'blueprints', 'owner', 'tags' ] );
			if( docu ) {
				return docu.toJSON<BlueprintPackExtended>();
			}
		} catch( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( {
			message: 'Something goes wrong!',
			code: 'INTERNAL_SERVER_ERROR'
		} );
	} ),

	getBlueprintPacks: publicProcedure
		.input(
			z.object( {
				skip: z.number().optional(),
				limit: z.number().optional(),
				filterOptions: filterSchema.optional()
			} )
		)
		.query( async( { input } ) => {
			const { limit, filterOptions, skip } = input;
			try {
				const { filter, options } = buildFilter( filterOptions );
				const totalBlueprints = await MongoBlueprintPacks.count( filter );
				const blueprintPacks: BlueprintPackExtended[] = await MongoBlueprintPacks.find<BlueprintPackExtended>(
					filter,
					null,
					{
						...options,
						limit,
						skip
					}
				).populate( [ 'blueprints', 'owner', 'tags' ] );
				return { blueprintPacks, totalBlueprints };
			} catch( e ) {
				handleTRCPErr( e );
			}
			throw new TRPCError( {
				message: 'Something goes wrong!',
				code: 'INTERNAL_SERVER_ERROR'
			} );
		} )
} );
