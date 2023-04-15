import * as mongoose from "mongoose";
import { IMO_Mod }   from "../../../src/Shared/Types/MongoDB";

const UserAccountSchema = new mongoose.Schema<IMO_Mod>( {
	id: { type: String, required: true, unique: true }
}, { timestamps: true, strict: false } );

export default mongoose.model<IMO_Mod>( "SBS_Mods", UserAccountSchema );
export { UserAccountSchema };