import * as mongoose      from "mongoose";
import type { MongoBase } from "@server/Types/mongo";
import { z }              from "zod";

const ZodSessionTokenSchema = z.object( {
	userid: z.string(),
	token: z.string(),
	expire: z.date().or( z.string() )
} );

const SessionTokenSchema = new mongoose.Schema( {
	userid: { type: String, required: true },
	token: { type: String, required: true },
	expire: { type: Date, required: true }
}, { timestamps: true } );

export type SessionToken = z.infer<typeof ZodSessionTokenSchema> & MongoBase;

export default mongoose.model<SessionToken>( "SBS_UserAccountToken", SessionTokenSchema );
export { SessionTokenSchema };