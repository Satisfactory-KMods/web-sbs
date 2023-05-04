import { z }                  from "zod";
import { TRPCError }          from "@trpc/server";
import {
	handleTRCPErr,
	publicProcedure,
	router
}                             from "@server/trpc/trpc";
import type { BlueprintData } from "@server/MongoDB/DB_Blueprints";
import DB_Blueprints          from "@server/MongoDB/DB_Blueprints";
import type {
	FilterQuery,
	QueryOptions
}                             from "mongoose";
import type { BlueprintPack } from "@server/MongoDB/DB_BlueprintPacks";

export const filterSchema = z.object( {
	name: z.string().optional(),
	sortBy: z.object( {
		by: z.string(),
		up: z.boolean()
	} ).optional(),
	tags: z.array( z.string() ).optional(),
	mods: z.array( z.string() ).optional(),
	onlyVanilla: z.boolean().optional()
} );

export type FilterSchema = z.infer<typeof filterSchema>;

export function buildFilter<T extends BlueprintData | BlueprintPack>( filter? : FilterSchema ) {
	const result : {
		filter : FilterQuery<T>,
		options : QueryOptions<T>
	} = {
		filter: {
			blacklisted: { $ne: true }
		},
		options: {
			sort: { createdAt: -1 }
		}
	};

	if ( filter ) {
		if ( filter.name ) {
			result.filter.name = { "$regex": filter.name, "$options": "i" };
		}
		if ( filter.sortBy ) {
			result.options.sort = { [ filter.sortBy.by ]: filter.sortBy.up ? 1 : -1 };
		}
		if ( filter.tags ) {
			result.filter.tags = { $all: filter.tags };
		}
		if ( filter.mods ) {
			result.filter.mods = { $all: filter.mods };
		}
		if ( filter.onlyVanilla !== undefined ) {
			// @ts-ignore
			result.filter[ "mods.1" ] = { $exists: !filter.onlyVanilla };
		}
	}
	else {
		result.options.sort = { createdAt: -1 };
	}

	return result;
}

export const public_blueprint = router( {
	getBlueprint: publicProcedure.input( z.object( {
		blueprintId: z.string()
	} ) ).query( async( { input } ) => {
		const { blueprintId } = input;
		try {
			const blueprint = await DB_Blueprints.findById( blueprintId );
			if ( blueprint ) {
				return { blueprintData: blueprint.toJSON() };
			}
		}
		catch ( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	} ),

	getBlueprints: publicProcedure.input( z.object( {
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
		}
		catch ( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	} )
} );
