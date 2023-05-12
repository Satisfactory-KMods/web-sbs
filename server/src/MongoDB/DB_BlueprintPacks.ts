import type { MongoBase } from "@server/Types/mongo";
import * as mongoose from "mongoose";
import { z } from "zod";

const ZodBlueprintPackSchema = z.object( {
	name: z.string(),
	description: z.string(),
	owner: z.string(),
	mods: z.array( z.string() ),
	rating: z.array( z.object( {
		userid: z.string(),
		rating: z.number().min( 1 ).max( 5 ),
	} ) ),
	tags: z.array( z.string() ),
	downloads: z.number(),
	blacklisted: z.boolean(),
	blueprints: z.array( z.string() )
} );

const BlueprintPackSchema = new mongoose.Schema( {
	name: { type: String, required: true },
	description: { type: String, required: true },
	mods: { type: [ String ], required: true },
	rating: { type: [ {
		userid: { type: String, required: true },
		rating: { type: Number, required: true },
	} ], required: true },
	tags: { type: [ String ], required: true },
	owner: { type: String, required: true },
	downloads: { type: Number, required: true, default: 0 },
	blacklisted: { type: Boolean, required: false, default: false },
	blueprints: { type: [ String ], required: true }
}, { timestamps: true } );

export type BlueprintPack = z.infer<typeof ZodBlueprintPackSchema> & MongoBase;

export default mongoose.model<BlueprintPack>( "SBS_BlueprintPacks", BlueprintPackSchema );
export { BlueprintPackSchema };

