
import { parseBlueprintById } from "@/server/src/Lib/BlueprintParser";
import MongoUserAccount from "@/server/src/MongoDB/MongoUserAccount";
import type { BlueprintData, BlueprintPack } from "@server/MongoDB/MongoBlueprints";
import MongoBlueprints from "@server/MongoDB/MongoBlueprints";
import {
	handleTRCPErr,
	publicProcedure,
	router
} from "@server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import type {
	FilterQuery,
	QueryOptions
} from "mongoose";
import { z } from "zod";

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

export function buildFilter<T extends BlueprintData | BlueprintPack>( filter?: FilterSchema ) {
	const result: {
		filter: FilterQuery<T>,
		options: QueryOptions<T>
	} = {
		filter: {
			blacklisted: { $ne: true }
		},
		options: {
			sort: { createdAt: -1 }
		}
	};

	if( filter ) {
		if( filter.name ) {
			result.filter.name = { "$regex": filter.name, "$options": "i" };
		}
		if( filter.sortBy ) {
			result.options.sort = { [ filter.sortBy.by ]: filter.sortBy.up ? 1 : -1 };
		}
		if( filter.tags ) {
			result.filter.tags = { $all: filter.tags };
		}
		if( filter.mods ) {
			result.filter.mods = { $all: filter.mods };
		}
		if( filter.onlyVanilla !== undefined ) {
			// @ts-ignore because this key is fine here!
			result.filter[ "mods.0" ] = { $exists: !filter.onlyVanilla };
		}
	} else {
		result.options.sort = { createdAt: -1 };
	}

	return result;
}

export const publicBlueprint = router( {
	readBlueprint: publicProcedure.input( z.object( {
		blueprintId: z.string().min( 5 )
	} ) ).mutation( async( { input } ) => {
		const { blueprintId } = input;
		try {
			const BP = ( await MongoBlueprints.findById( blueprintId ) )!;
			const parse = parseBlueprintById( BP._id.toString(), BP.name );
			if( parse ) {
				return parse;
			}
			throw new TRPCError( { message: "Failed to read blueprint data!", code: "INTERNAL_SERVER_ERROR" } );
		} catch( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	} ),

	getBlueprint: publicProcedure.input( z.object( {
		blueprintId: z.string()
	} ) ).query( async( { input } ) => {
		const { blueprintId } = input;
		try {
			const blueprint = await MongoBlueprints.findById( blueprintId );
			if( blueprint ) {
				const owner = await MongoUserAccount.findById( blueprint.owner );
				const bpOwnerName: string = owner?.username || "Deleted User";
				if( blueprint ) {
					return { blueprintData: blueprint.toJSON() as BlueprintData, bpOwnerName };
				}
			}
		} catch( e ) {
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
			const totalBlueprints = await MongoBlueprints.count( filter );
			const blueprints = await MongoBlueprints.find<BlueprintData>( filter, null, { ...options, limit, skip } );
			return { blueprints, totalBlueprints };
		} catch( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	} )
} );
