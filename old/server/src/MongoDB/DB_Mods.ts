import * as mongoose from "mongoose";
import { MO_Mod }    from "@shared/Types/MongoDB";

const UserAccountSchema = new mongoose.Schema<MO_Mod>( {
	id: { type: String, required: true, unique: true }
}, { timestamps: true, strict: false } );


const myDB = mongoose.connections[ 0 ].useDb( "ficsit_app" );
export default myDB.model<MO_Mod>( "Mods", UserAccountSchema );
export { UserAccountSchema };