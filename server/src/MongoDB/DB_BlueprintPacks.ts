import * as mongoose      from "mongoose";
import type { MongoBase } from "@server/Types/mongo";
import { z }              from "zod";

const ZodBlueprintPackSchema = z.object( {
	name: z.string(),
	description: z.string(),
	owner: z.string(),
	mods: z.array( z.string() ),
	likes: z.array( z.string() ),
	tags: z.array( z.string() ),
	downloads: z.number(),
	blacklisted: z.boolean(),
	blueprints: z.array( z.string() )
} );

const BlueprintPackSchema = new mongoose.Schema( {
	name: { type: String, required: true },
	description: { type: String, required: true },
	mods: { type: [ String ], required: true },
	likes: { type: [ String ], required: true },
	tags: { type: [ String ], required: true },
	owner: { type: String, required: true },
	downloads: { type: Number, required: true, default: 0 },
	blacklisted: { type: Boolean, required: false, default: false },
	blueprints: { type: [ String ], required: true }
}, { timestamps: true } );

export type BlueprintPack = z.infer<typeof ZodBlueprintPackSchema> & MongoBase;

export default mongoose.model<BlueprintPack>( "SBS_BlueprintPacks", BlueprintPackSchema );
export { BlueprintPackSchema };