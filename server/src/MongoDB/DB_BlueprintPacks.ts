import type { MongoBase } from "@server/Types/mongo";
import * as mongoose from "mongoose";
import { z } from "zod";
import DB_Blueprints, { ZodRating } from "./DB_Blueprints";

const ZodBlueprintPackSchema = z.object( {
	name: z.string(),
	description: z.string(),
	owner: z.string(),
	mods: z.array( z.string() ),
	rating: z.array( ZodRating ),
	totalRating: z.number(),
	tags: z.array( z.string() ),
	downloads: z.number(),
	blacklisted: z.boolean(),
	images: z.array( z.string() ),
	blueprints: z.array( z.string() )
} );

export interface BlueprintPackSchemaMethods {
	updateRating: () => Promise<boolean>;
	updateModRefs: ( save?: boolean ) => Promise<void>;

}

const BlueprintPackSchema = new mongoose.Schema( {
	name: { type: String, required: true },
	description: { type: String, required: true },
	mods: { type: [ String ], required: true },
	rating: { type: [ {
		userid: { type: String, required: true },
		rating: { type: Number, required: true },
	} ], required: true },
	totalRating: { type: Number, required: true },
	tags: { type: [ String ], required: true },
	owner: { type: String, required: true },
	downloads: { type: Number, required: true, default: 0 },
	blacklisted: { type: Boolean, required: false, default: false },
	blueprints: { type: [ String ], required: true }
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
	},
	updateModRefs: async function( save = true ) {
		const blueprintSet = new Set<string>();
		for await ( const bp of DB_Blueprints.find( { _id: this.blueprints } ) ) {
			for( const mod of bp.mods ) {
				blueprintSet.add( mod );
			}
		}
		this.mods = Array.from( blueprintSet );
		if( save ) {
			this.markModified( "mods" );
			await this.save();
		}
	}
} } );

export type BlueprintPack = z.infer<typeof ZodBlueprintPackSchema> & MongoBase;

export default mongoose.model<BlueprintPack, mongoose.Model<BlueprintPack, any, BlueprintPackSchemaMethods>>( "SBS_BlueprintPacks", BlueprintPackSchema );
export { BlueprintPackSchema, ZodBlueprintPackSchema };

