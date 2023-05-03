import * as mongoose from "mongoose";
import type { MongoBase } from "@server/Types/mongo";

const TagSchema = new mongoose.Schema( {
	DisplayName: { type: String, required: true }
}, { timestamps: true } );

export type Tag = mongoose.InferSchemaType<typeof TagSchema> & MongoBase;

export default mongoose.model<Tag>( "SBS_Tags", TagSchema );
export { TagSchema };