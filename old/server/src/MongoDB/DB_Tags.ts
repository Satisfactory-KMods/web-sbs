import * as mongoose from "mongoose";
import { MO_Tag }    from "@shared/Types/MongoDB";

const UserAccountSchema = new mongoose.Schema<MO_Tag>( {
	DisplayName: { type: String, required: true }
}, { timestamps: true } );

export default mongoose.model<MO_Tag>( "SBS_Tags", UserAccountSchema );
export { UserAccountSchema };