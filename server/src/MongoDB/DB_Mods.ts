import * as mongoose from "mongoose";
import { IMO_Mod }   from "@shared/Types/MongoDB";

const UserAccountSchema = new mongoose.Schema<IMO_Mod>( {
	id: { type: String, required: true, unique: true }
}, { timestamps: true, strict: false } );


const myDB = mongoose.connections[ 0 ].useDb( "ficsit_app" );
export default myDB.model<IMO_Mod>( "Mods", UserAccountSchema );
export { UserAccountSchema };