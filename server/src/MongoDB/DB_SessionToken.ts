import * as mongoose from "mongoose";
import { ModSchema } from "@server/MongoDB/DB_Mods";

const SessionTokenSchema = new mongoose.Schema( {
	userid: { type: String, required: true },
	token: { type: String, required: true },
	expire: { type: Date, required: true }
}, { timestamps: true } );

export type SessionToken = mongoose.InferSchemaType<typeof ModSchema>;

export default mongoose.model<SessionToken>( "SBS_UserAccountToken", SessionTokenSchema );
export { SessionTokenSchema };