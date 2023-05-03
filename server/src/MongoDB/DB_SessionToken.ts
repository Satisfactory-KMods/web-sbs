import * as mongoose from "mongoose";
import type { MongoBase } from "@server/Types/mongo";

const SessionTokenSchema = new mongoose.Schema( {
	userid: { type: String, required: true },
	token: { type: String, required: true },
	expire: { type: Date, required: true }
}, { timestamps: true } );

export type SessionToken = mongoose.InferSchemaType<typeof SessionTokenSchema> & MongoBase;

export default mongoose.model<SessionToken>( "SBS_UserAccountToken", SessionTokenSchema );
export { SessionTokenSchema };