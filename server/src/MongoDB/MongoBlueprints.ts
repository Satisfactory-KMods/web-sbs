import { BlueprintClass } from "@/server/src/Lib/Blueprint.Class";
import { parseBlueprintById } from "@/server/src/Lib/BlueprintParser";
import { findModsFromBlueprint } from "@/src/Shared/blueprintReadingHelper";
import type { BlueprintConfig } from "@etothepii/satisfactory-file-parser";
import type { MongoBase } from "@server/Types/mongo";
import { EDesignerSize } from "@shared/Enum/EDesignerSize";
import * as mongoose from "mongoose";
import { z } from "zod";

const ZodRating = z.object( {
	userid: z.string(),
	rating: z.number().min( 1 ).max( 5 ),
} );

const ZodColorData = z.object( {
	r: z.number(),
	g: z.number(),
	b: z.number(),
	a: z.number(),
} );

const ZodIconData = z.object( {
	color: ZodColorData,
	iconID: z.number(),
} );

const ZodBlueprintBase = z.object( {
	downloads: z.number(),
	blacklisted: z.boolean(),
	originalName: z.string(),
	iconData: ZodIconData.optional(),
	name: z.string(),
	description: z.string(),
	owner: z.string(),
	DesignerSize: z.nativeEnum( EDesignerSize ),
	mods: z.array( z.string() ),
	rating: z.array( ZodRating ),
	totalRating: z.number(),
	totalRatingCount: z.number(),
	tags: z.array( z.string() ),
	images: z.array( z.string() ),
} );

const ZodBlueprintPackSchema = z.object( {
	name: z.string(),
	description: z.string(),
	owner: z.string(),
	mods: z.array( z.string() ),
	rating: z.array( ZodRating ),
	totalRating: z.number(),
	totalRatingCount: z.number(),
	tags: z.array( z.string() ),
	downloads: z.number(),
	blacklisted: z.boolean(),
	images: z.array( z.string() ),
	blueprints: z.array( z.string() ).or( z.array( ZodBlueprintBase ) )
} );

const ZodBlueprintSchema = ZodBlueprintBase.merge( z.object( {
	inPacks: z.array( ZodBlueprintPackSchema ).or( z.array( z.string() ) )
} ) );

export interface BlueprintPackSchemaMethods {
	updateRating: () => Promise<boolean>;
	updateModRefs: ( save?: boolean ) => Promise<void>;

}

export interface BlueprintSchemaMethods {
	updateRating: () => Promise<boolean>;
	updateModRefs: ( save?: boolean ) => Promise<void>;
	updateBlueprintData: ( save?: boolean ) => Promise<void>;
}

const BlueprintSchema = new mongoose.Schema( {
	name: { type: String, required: true },
	description: { type: String, required: true },
	mods: { type: [ String ], required: true, default: [] },
	tags: { type: [ String ], required: true, default: [] },
	rating: { type: [ {
		userid: { type: String, required: true },
		rating: { type: Number, required: true },
	} ], required: true },
	totalRating: { type: Number, required: true },
	totalRatingCount: { type: Number, required: true },
	DesignerSize: { type: String, required: true },
	owner: { type: String, required: true },
	downloads: { type: Number, required: true, default: 0 },
	blacklisted: { type: Boolean, required: false, default: false },
	images: { type: [ String ], required: true },
	inPacks: { type: [ mongoose.Schema.Types.ObjectId ], ref: "SBS_BlueprintPacks", required: true },
	originalName: { type: String, required: true, unique: true },
	iconData: { type: {
		color: { type: {
			r: { type: Number, required: false },
			g: { type: Number, required: false },
			b: { type: Number, required: false },
			a: { type: Number, required: false },
		}, required: false },
		iconID: { type: Number, required: false },
	}, required: false },
}, { timestamps: true, methods: {
	updateRating: async function() {
		const findRating = () => {
			const totalRating = this.rating.length * 5;
			const currentTotalRating = this.rating.reduce( ( total, rating ) => total + rating.rating, 0 );
			const currRating = Math.round( currentTotalRating / totalRating * 5 * 100 ) / 100;
			return !isNaN( currRating ) ? currRating : 0;
		};
		this.totalRating = findRating();
		this.totalRatingCount = this.rating.length;
		try {
			this.markModified( "rating" );
			this.markModified( "totalRating" );
			this.markModified( "totalRatingCount" );
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
		const parse = parseBlueprintById( this._id.toString(), this.name );
		if( parse ) {
			this.mods = findModsFromBlueprint( parse.objects );
			if( save ) {
				this.markModified( "mods" );
				this.save();
			}
		}
	},
	updateBlueprintData: async function( save = true ) {
		try {
			const bp = await BlueprintClass.createClass( this._id.toString() );
			if( bp ) {
				const blueprint = await bp.parseBlueprint();
				if( blueprint ) {
					const partic: Partial<BlueprintConfig> = blueprint.config;
					delete partic.description;
					this.iconData = partic as IconData;
					this.markModified( "iconData" );
					if( save ) {
						await this.save();
					}
				}
			}
		} catch( e ) {
			if( e instanceof Error ) {
				SystemLib.LogError( e.message );
			}
		}
	}
} } );

export type BlueprintData = BPInterface & MongoBase;
export type BlueprintRating = z.infer<typeof ZodRating>;
export type IconData = z.infer<typeof ZodIconData>;

const MongoBlueprints = mongoose.model<BlueprintData, mongoose.Model<BlueprintData, unknown, BlueprintSchemaMethods>>( "SBS_Blueprints", BlueprintSchema );

const BlueprintPackSchema = new mongoose.Schema( {
	name: { type: String, required: true },
	description: { type: String, required: true },
	mods: { type: [ String ], required: true },
	rating: { type: [ {
		userid: { type: String, required: true },
		rating: { type: Number, required: true },
	} ], required: true },
	totalRating: { type: Number, required: true },
	totalRatingCount: { type: Number, required: true },
	tags: { type: [ String ], required: true },
	owner: { type: String, required: true },
	downloads: { type: Number, required: true, default: 0 },
	blacklisted: { type: Boolean, required: false, default: false },
	blueprints: { type: [ mongoose.Schema.Types.ObjectId ], ref: "SBS_Blueprints", required: true }
}, { timestamps: true, methods: {
	updateRating: async function() {
		const findRating = () => {
			const totalRating = this.rating.length * 5;
			const currentTotalRating = this.rating.reduce( ( total, rating ) => total + rating.rating, 0 );
			const currRating = Math.round( currentTotalRating / totalRating * 5 * 100 ) / 100;
			return !isNaN( currRating ) ? currRating : 0;
		};
		this.totalRating = findRating();
		this.totalRatingCount = this.rating.length;
		try {
			this.markModified( "rating" );
			this.markModified( "totalRating" );
			this.markModified( "totalRatingCount" );
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
		for await ( const bp of MongoBlueprints.find( { _id: this.blueprints } ) ) {
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

interface BPInterface extends z.infer<typeof ZodBlueprintSchema> {
	DesignerSize: EDesignerSize;
}

type BlueprintPack = z.infer<typeof ZodBlueprintPackSchema> & MongoBase;


export const Revalidate = async() => {
	for await ( const bpDoc of MongoBlueprints.find( { iconData: { $exists: false } } ) ) {
		await bpDoc.updateBlueprintData();
	}
};

export default MongoBlueprints;

const MongoBlueprintPacks = mongoose.model<BlueprintPack, mongoose.Model<BlueprintPack, unknown, BlueprintPackSchemaMethods>>( "SBS_BlueprintPacks", BlueprintPackSchema );

export { BlueprintSchema, ZodBlueprintSchema, ZodRating, ZodIconData, BlueprintPackSchema, ZodBlueprintPackSchema, BlueprintPack, MongoBlueprintPacks };

