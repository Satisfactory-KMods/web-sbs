import * as mongoose from "mongoose";
import { IMO_Tag }   from "@shared/Types/MongoDB";

const UserAccountSchema = new mongoose.Schema<IMO_Tag>( {
	DisplayName: { type: String, required: true }
}, { timestamps: true } );

export default mongoose.model<IMO_Tag>( "SBS_Tags", UserAccountSchema );
export { UserAccountSchema };