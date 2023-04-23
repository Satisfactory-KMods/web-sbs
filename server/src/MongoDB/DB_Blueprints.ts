import * as mongoose     from "mongoose";
import { IMO_Blueprint } from "@shared/Types/MongoDB";

const BlueprintSchema = new mongoose.Schema<IMO_Blueprint>( {
	name: { type: String, required: true },
	description: { type: String, required: true },
	mods: { type: [ String ], required: true },
	likes: { type: [ String ], required: true },
	tags: { type: [ String ], required: true },
	DesignerSize: { type: String, required: true },
	owner: { type: String, required: true },
	downloads: { type: Number, required: false, default: 0 },
	blacklisted: { type: Boolean, required: false, default: false }
}, { timestamps: true } );

export default mongoose.model<IMO_Blueprint>( "SBS_Blueprints", BlueprintSchema );
export { BlueprintSchema };