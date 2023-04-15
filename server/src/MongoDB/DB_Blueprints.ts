import * as mongoose     from "mongoose";
import { IMO_Blueprint } from "../../../src/Shared/Types/MongoDB";

const BlueprintSchema = new mongoose.Schema<IMO_Blueprint>( {
	name: { type: String, required: true },
	description: { type: String, required: true },
	mods: { type: [ String ], required: true },
	likes: { type: [ String ], required: true },
	tags: { type: [ String ], required: true },
	size: { type: String, required: true },
	owner: { type: String, required: true }
}, { timestamps: true } );

export default mongoose.model<IMO_Blueprint>( "SBS_Blueprints", BlueprintSchema );
export { BlueprintSchema };