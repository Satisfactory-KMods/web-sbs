import * as mongoose        from "mongoose";
import { MO_BlueprintPack } from "@shared/Types/MongoDB";

const BlueprintPackSchema = new mongoose.Schema<MO_BlueprintPack>( {
	name: { type: String, required: true },
	description: { type: String, required: true },
	mods: { type: [ String ], required: true },
	likes: { type: [ String ], required: true },
	tags: { type: [ String ], required: true },
	owner: { type: String, required: true },
	downloads: { type: Number, required: false, default: 0 },
	blacklisted: { type: Boolean, required: false, default: false },
	blueprints: { type: [ String ], required: false }
}, { timestamps: true } );

export default mongoose.model<MO_BlueprintPack>( "SBS_BlueprintPacks", BlueprintPackSchema );
export { BlueprintPackSchema };