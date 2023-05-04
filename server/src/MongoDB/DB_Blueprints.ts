import * as mongoose          from "mongoose";
import type { EDesignerSize } from "@shared/Enum/EDesignerSize";
import type { MongoBase }     from "@server/Types/mongo";

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

interface BPInterface extends mongoose.InferSchemaType<typeof BlueprintSchema> {
	DesignerSize : EDesignerSize;
}

export type BlueprintData = BPInterface & MongoBase

export default mongoose.model<BlueprintData>( "SBS_Blueprints", BlueprintSchema );
export { BlueprintSchema };