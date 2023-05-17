import type { BlueprintData, BlueprintPack } from "@server/MongoDB/MongoBlueprints";
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


