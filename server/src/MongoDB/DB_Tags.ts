import * as mongoose from "mongoose";
import { ModSchema } from "@server/MongoDB/DB_Mods";

const TagSchema = new mongoose.Schema( {
	DisplayName: { type: String, required: true }
}, { timestamps: true } );

export type Tag = mongoose.InferSchemaType<typeof ModSchema>;

export default mongoose.model<Tag>( "SBS_Tags", TagSchema );
export { TagSchema };