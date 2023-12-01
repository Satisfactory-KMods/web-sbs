import { ZodUserAccountSchema } from '@/server/src/MongoDB/MongoUserAccount';
import type { MongoBase } from '@server/Types/mongo';
import * as mongoose from 'mongoose';
import { z } from 'zod';

const ZodSessionTokenSchema = z.object({
	userid: z.string().or(ZodUserAccountSchema),
	token: z.string(),
	expire: z.date().or(z.string())
});

const SessionTokenSchema = new mongoose.Schema(
	{
		userid: { type: mongoose.Schema.Types.ObjectId, ref: 'SBS_UserAccount', required: true },
		token: { type: String, required: true },
		expire: { type: Date, required: true }
	},
	{ timestamps: true }
);

export type SessionToken = z.infer<typeof ZodSessionTokenSchema> & MongoBase;

const MongoSessionToken = mongoose.model<SessionToken>('SBS_UserAccountToken', SessionTokenSchema);

export default MongoSessionToken;
export { SessionTokenSchema, ZodSessionTokenSchema };
