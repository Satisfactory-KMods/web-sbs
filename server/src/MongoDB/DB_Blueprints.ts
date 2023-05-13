import type { MongoBase } from "@server/Types/mongo";
import type { EDesignerSize } from "@shared/Enum/EDesignerSize";
import * as mongoose from "mongoose";
import { z } from "zod";

const ZodRating = z.object( {
	userid: z.string(),
	rating: z.number().min( 1 ).max( 5 ),
} );

const ZodBlueprintSchema = z.object( {
	name: z.string(),
	description: z.string(),
	owner: z.string(),
	DesignerSize: z.string(),
	mods: z.array( z.string() ),
	rating: z.array( ZodRating ),
	totalRating: z.number(),
	tags: z.array( z.string() ),
	images: z.array( z.string() ),
	downloads: z.number(),
	blacklisted: z.boolean()
} );

export interface BlueprintSchemaMethods {
	updateRating: () => Promise<boolean>;
}

const BlueprintSchema = new mongoose.Schema( {
	name: { type: String, required: true },
	description: { type: String, required: true },
	mods: { type: [ String ], required: true },
	likes: { type: [ String ], required: true },
	rating: { type: [ {
		userid: { type: String, required: true },
		rating: { type: Number, required: true },
	} ], required: true },
	totalRating: { type: Number, required: true },
	DesignerSize: { type: String, required: true },
	owner: { type: String, required: true },
	downloads: { type: Number, required: true, default: 0 },
	blacklisted: { type: Boolean, required: false, default: false },
	images: { type: [ String ], required: true },
}, { timestamps: true, methods: {
	updateRating: async function() {
		const findRating = () => {
			const totalRating = this.rating.length * 5;
			const currentTotalRating = this.rating.reduce( ( total, rating ) => total + rating.rating, 0 );
			const currRating = Math.round( currentTotalRating / totalRating * 5 * 100 ) / 100;
			return !isNaN( currRating ) ? currRating : 0;
		};
		this.totalRating = findRating();
		try {
			this.markModified( "rating" );
			this.markModified( "totalRation" );
			await this.save();
			return true;
		} catch( e ) {
			if( e instanceof Error ) {
				SystemLib.LogError( e.message );
			}
		}
		return false;
	}
} } );

interface BPInterface extends z.infer<typeof ZodBlueprintSchema> {
	DesignerSize: EDesignerSize;
}

export type BlueprintData = BPInterface & MongoBase;
export type BlueprintRating = z.infer<typeof ZodRating>;

export default mongoose.model<BlueprintData, mongoose.Model<BlueprintData, unknown, BlueprintSchemaMethods>>( "SBS_Blueprints", BlueprintSchema );
export { BlueprintSchema, ZodBlueprintSchema, ZodRating };

