import type { MongoBase } from "@server/Types/mongo";
import * as mongoose from "mongoose";
import { z } from "zod";

const ZodTagSchema = z.object( {
	DisplayName: z.string()
} );

const TagSchema = new mongoose.Schema( {
	DisplayName: { type: String, required: true }
}, { timestamps: true } );

export type Tag = z.infer<typeof ZodTagSchema> & MongoBase;

export default mongoose.model<Tag>( "SBS_Tags", TagSchema );
export { TagSchema };
