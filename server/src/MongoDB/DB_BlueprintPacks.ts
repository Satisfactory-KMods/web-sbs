import * as mongoose from "mongoose";
import type { MongoBase } from "@server/Types/mongo";

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

export type BlueprintPack = mongoose.InferSchemaType<typeof BlueprintPackSchema> & MongoBase;

export default mongoose.model<BlueprintPack>( "SBS_BlueprintPacks", BlueprintPackSchema );
export { BlueprintPackSchema };