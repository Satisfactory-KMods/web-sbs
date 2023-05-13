import type { BlueprintData } from "@/server/src/MongoDB/DB_Blueprints";
import DB_Blueprints from "@/server/src/MongoDB/DB_Blueprints";
import {
	adminBlueprintProcedure,
	adminProcedure,
	blueprintModOwnerProcedure,
	blueprintProcedure,
	handleTRCPErr,
	router
} from "@server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import _ from "lodash";
import { z } from "zod";
import { buildFilter, filterSchema } from "../public/blueprint";

export const auth_blueprints = router( {
	rate: blueprintProcedure.input( z.object( {
		rating: z.number().min( 1 ).max( 5 ),
	} ) ).mutation( async( { ctx, input } ) => {
		const { blueprint, userClass } = ctx;
		const { rating } = input;

		try {
			const bpDocument = await blueprint.getDocument();
			if( bpDocument ) {
				const ratingIndex = bpDocument.rating.findIndex( e => _.isEqual( e.userid, userClass.Get._id ) );
				if( ratingIndex >= 0 ) {
					bpDocument.rating[ ratingIndex ].rating = rating;
				} else {
					bpDocument.rating.push( { userid: userClass.Get._id, rating } );
				}
				if( await bpDocument.updateRating() ) {
					return "Rating saved!";
				}
			}
		} catch( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "password or login is to short.", code: "BAD_REQUEST" } );
	} ),

	getBlacklistedBlueprints: adminProcedure.input( z.object( {
		skip: z.number().optional(),
		limit: z.number().optional(),
		filterOptions: filterSchema.optional()
	} ) ).query( async( { input } ) => {
		const { limit, filterOptions, skip } = input;
		try {
			const { filter, options } = buildFilter( filterOptions );
			const totalBlueprints = await DB_Blueprints.count( filter );
			const blueprints = await DB_Blueprints.find<BlueprintData>( filter, null, { ...options, limit, skip } );
			return { blueprints, totalBlueprints };
		} catch( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	} ),

	toggleBlueprint: blueprintModOwnerProcedure.mutation( async( { ctx } ) => {
		const { blueprint } = ctx;
		try {
			const bpDocument = await blueprint.getDocument();
			if( bpDocument ) {
				bpDocument.blacklisted = !bpDocument.blacklisted;
				if( await bpDocument.save() ) {
					return bpDocument.blacklisted ? "Blueprint blacklisted!" : "Blueprint removed from blacklist!";
				}
			}
		} catch( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	} ),

	deleteBlueprint: adminBlueprintProcedure.mutation( async( { ctx } ) => {
		const { blueprint } = ctx;
		try {
			const bpDocument = await blueprint.getDocument();
			if( bpDocument ) {
				await bpDocument.deleteOne();
				return "Blueprint deleted!";
			}
		} catch( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	} )
} );
