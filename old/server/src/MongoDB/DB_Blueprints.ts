import * as mongoose    from "mongoose";
import { MO_Blueprint } from "@shared/Types/MongoDB";

const BlueprintSchema = new mongoose.Schema<MO_Blueprint>( {
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

export default mongoose.model<MO_Blueprint>( "SBS_Blueprints", BlueprintSchema );
export { BlueprintSchema };