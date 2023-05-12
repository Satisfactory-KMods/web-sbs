import * as mongoose          from "mongoose";
import type { EDesignerSize } from "@shared/Enum/EDesignerSize";
import type { MongoBase }     from "@server/Types/mongo";
import { z }                  from "zod";

const ZodBlueprintSchema = z.object( {
	name: z.string(),
	description: z.string(),
	owner: z.string(),
	DesignerSize: z.string(),
	mods: z.array( z.string() ),
	likes: z.array( z.string() ),
	tags: z.array( z.string() ),
	downloads: z.number(),
	blacklisted: z.boolean()
} );

const BlueprintSchema = new mongoose.Schema( {
	name: { type: String, required: true },
	description: { type: String, required: true },
	mods: { type: [ String ], required: true },
	likes: { type: [ String ], required: true },
	tags: { type: [ String ], required: true },
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