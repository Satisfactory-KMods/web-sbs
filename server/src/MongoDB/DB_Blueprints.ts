import type { MongoBase } from "@server/Types/mongo";
import type { EDesignerSize } from "@shared/Enum/EDesignerSize";
import * as mongoose from "mongoose";
import { z } from "zod";

const ZodBlueprintSchema = z.object( {
	name: z.string(),
	description: z.string(),
	owner: z.string(),
	DesignerSize: z.string(),
	mods: z.array( z.string() ),
	rating: z.array( z.object( {
		userid: z.string(),
		rating: z.number().min( 1 ).max( 5 ),
	} ) ),
	tags: z.array( z.string() ),
	downloads: z.number(),
	blacklisted: z.boolean()
} );

const BlueprintSchema = new mongoose.Schema( {
	name: { type: String, required: true },
	description: { type: String, required: true },
	mods: { type: [ String ], required: true },
	likes: { type: [ String ], required: true },
	rating: { type: [ {
		userid: { type: String, required: true },
		rating: { type: Number, required: true },
	} ], required: true },
	DesignerSize: { type: String, required: true },
	owner: { type: String, required: true },
	downloads: { type: Number, required: true, default: 0 },
	blacklisted: { type: Boolean, required: false, default: false }
}, { timestamps: true } );

interface BPInterface extends z.infer<typeof ZodBlueprintSchema> {
	DesignerSize : EDesignerSize;
}

export type BlueprintData = BPInterface & MongoBase;

export default mongoose.model<BlueprintData>( "SBS_Blueprints", BlueprintSchema );
export { BlueprintSchema };

